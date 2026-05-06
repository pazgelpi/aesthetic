import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'
import { generateProgressStory } from '@/lib/ai/generate-progress-story'
import { differenceInDays } from 'date-fns'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ treatmentId: string }> }
) {
  const { treatmentId } = await params
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return Response.json({ error: 'Missing token' }, { status: 401 })

  const supabase = createAdminClient()

  const { data: captureToken } = await supabase
    .from('capture_tokens')
    .select('treatment_id, patient_id')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!captureToken || captureToken.treatment_id !== treatmentId) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 403 })
  }

  const [treatmentRes, comparisonRes, patientRes] = await Promise.all([
    supabase.from('treatments').select('treatment_type, areas_treated, treated_at, clinic_id').eq('id', treatmentId).single(),
    supabase.from('comparisons').select('metrics_json, ai_synthesis_clinic').eq('treatment_id', treatmentId).order('generated_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('patients').select('first_name').eq('id', captureToken.patient_id).single(),
  ])

  if (!treatmentRes.data || !comparisonRes.data) {
    return Response.json({ error: 'No comparison available yet' }, { status: 404 })
  }

  const clinicId = treatmentRes.data.clinic_id
  const [clinicRes, profileRes] = await Promise.all([
    supabase.from('clinics').select('name').eq('id', clinicId).single(),
    supabase.from('clinic_profiles').select('pronoun_usage, formality_level, signature_template').eq('clinic_id', clinicId).maybeSingle(),
  ])

  const story = await generateProgressStory({
    patientFirstName: patientRes.data?.first_name ?? 'Paciente',
    treatmentType: treatmentRes.data.treatment_type as 'toxin' | 'filler',
    areasText: treatmentRes.data.areas_treated.join(', '),
    daysSinceTreatment: differenceInDays(new Date(), new Date(treatmentRes.data.treated_at)),
    metricsJson: comparisonRes.data.metrics_json as Record<string, unknown>,
    aiSynthesisClinic: comparisonRes.data.ai_synthesis_clinic,
    clinicName: clinicRes.data?.name ?? 'Tu clínica',
    pronoun: profileRes.data?.pronoun_usage ?? 'tuteo',
    formality: profileRes.data?.formality_level ?? 'friendly',
    signature: profileRes.data?.signature_template ?? null,
  })

  return Response.json(story)
}
