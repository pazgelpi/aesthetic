import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getGoogleClient } from '@/lib/google/client'
import { sendEmail, buildProgressReportHtml } from '@/lib/google/gmail'
import { generateProgressStory } from '@/lib/ai/generate-progress-story'
import { differenceInDays } from 'date-fns'
import { NextRequest } from 'next/server'

/**
 * POST /api/reports/email
 * Body: { treatmentId, recipientType: 'patient' | 'professional' }
 *
 * Generates or fetches the progress story and sends it via Gmail
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: professional } = await admin
    .from('professionals')
    .select('id, clinic_id, full_name')
    .eq('user_id', user.id)
    .single()
  if (!professional) return Response.json({ error: 'Professional not found' }, { status: 404 })

  const body = await req.json() as { treatmentId: string; recipientType: 'patient' | 'professional' }
  const { treatmentId, recipientType } = body

  const [treatmentRes, comparisonRes, clinicRes, profileRes] = await Promise.all([
    admin.from('treatments').select('id, patient_id, treatment_type, areas_treated, treated_at').eq('id', treatmentId).single(),
    admin.from('comparisons').select('metrics_json, ai_synthesis_clinic, shareable_image_url').eq('treatment_id', treatmentId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    admin.from('clinics').select('name').eq('id', professional.clinic_id).single(),
    admin.from('clinic_profiles').select('pronoun_usage, formality_level, signature_template').eq('clinic_id', professional.clinic_id).maybeSingle(),
  ])

  const treatment = treatmentRes.data
  const comparison = comparisonRes.data
  if (!treatment || !comparison) {
    return Response.json({ error: 'Treatment or comparison not found' }, { status: 404 })
  }

  const { data: patient } = await admin
    .from('patients')
    .select('first_name, full_name, email')
    .eq('id', treatment.patient_id)
    .single()

  // Determine recipient email
  let recipientEmail: string | null = null
  let recipientName: string | null = null

  if (recipientType === 'patient') {
    recipientEmail = patient?.email ?? null
    recipientName = patient?.first_name ?? patient?.full_name ?? 'Paciente'
  } else {
    recipientEmail = user.email ?? null
    recipientName = professional.full_name
  }

  if (!recipientEmail) {
    return Response.json({ error: 'No email address for recipient' }, { status: 400 })
  }

  const clinicName = clinicRes.data?.name ?? 'Tu clínica'
  const daysSinceTreatment = differenceInDays(new Date(), new Date(treatment.treated_at))

  const pronounRaw = profileRes.data?.pronoun_usage ?? 'voseo'
  const pronoun = (['voseo', 'tuteo', 'usted'] as const).includes(pronounRaw as 'voseo' | 'tuteo' | 'usted')
    ? (pronounRaw as 'voseo' | 'tuteo' | 'usted')
    : 'voseo'

  const formalityRaw = profileRes.data?.formality_level ?? 'friendly'
  const formality = (['formal', 'casual', 'friendly'] as const).includes(formalityRaw as 'formal' | 'casual' | 'friendly')
    ? (formalityRaw as 'formal' | 'casual' | 'friendly')
    : 'friendly'

  const story = await generateProgressStory({
    patientFirstName: patient?.first_name ?? 'Paciente',
    treatmentType: treatment.treatment_type as 'toxin' | 'filler',
    areasText: (treatment.areas_treated ?? []).join(', '),
    daysSinceTreatment,
    metricsJson: (comparison.metrics_json ?? {}) as Record<string, unknown>,
    aiSynthesisClinic: comparison.ai_synthesis_clinic ?? '',
    clinicName,
    pronoun,
    formality,
    signature: profileRes.data?.signature_template ?? null,
  })

  const html = buildProgressReportHtml({
    title: story.title,
    narrative: story.narrative,
    highlightValue: story.highlightValue,
    highlightLabel: story.highlightLabel,
    ctaText: story.ctaText,
    clinicName,
    imageUrl: comparison.shareable_image_url ?? undefined,
  })

  try {
    const auth = await getGoogleClient(professional.id)
    await sendEmail(auth, {
      to: recipientEmail,
      subject: `✨ ${story.title}`,
      html,
      fromName: clinicName,
    })
    return Response.json({ ok: true, sentTo: recipientEmail })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('not connected')) {
      return Response.json({ error: 'Google account not connected' }, { status: 400 })
    }
    console.error('Email report error:', err)
    return Response.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
