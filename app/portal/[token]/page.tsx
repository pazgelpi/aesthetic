import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { PatientPortal } from '@/components/portal/patient-portal'
import { generateProgressStory } from '@/lib/ai/generate-progress-story'
import { differenceInDays } from 'date-fns'

export const revalidate = 0

export default async function PortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ purpose?: string }>
}) {
  const { token } = await params
  const { purpose } = await searchParams
  const supabase = createAdminClient()

  const { data: captureToken } = await supabase
    .from('capture_tokens')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!captureToken) notFound()

  const [treatmentRes, patientRes, sessionsRes, comparisonRes, recommendationsRes] = await Promise.all([
    supabase.from('treatments').select('*').eq('id', captureToken.treatment_id).single(),
    supabase.from('patients').select('id, first_name, full_name').eq('id', captureToken.patient_id).single(),
    supabase.from('photo_sessions').select('*').eq('treatment_id', captureToken.treatment_id).order('captured_at'),
    supabase
      .from('comparisons')
      .select('*')
      .eq('treatment_id', captureToken.treatment_id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('recommendations')
      .select('*')
      .eq('patient_id', captureToken.patient_id)
      .eq('status', 'active')
      .order('suggested_at', { ascending: false })
      .limit(5),
  ])

  if (!treatmentRes.data || !patientRes.data) notFound()

  const clinicId = treatmentRes.data.clinic_id

  const [protocol, clinicRes, profileRes] = await Promise.all([
    supabase
      .from('clinic_protocols')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('treatment_type', treatmentRes.data.treatment_type)
      .maybeSingle(),
    supabase.from('clinics').select('name').eq('id', clinicId).single(),
    supabase
      .from('clinic_profiles')
      .select('pronoun_usage, formality_level, signature_template')
      .eq('clinic_id', clinicId)
      .maybeSingle(),
  ])

  // Log adherence visit
  await supabase.from('adherence_logs').insert({
    patient_id: captureToken.patient_id,
    clinic_id: clinicId,
    logged_at: new Date().toISOString(),
  })

  const story = comparisonRes.data
    ? await generateProgressStory({
        patientFirstName: patientRes.data.first_name,
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
    : null

  return (
    <PatientPortal
      token={token}
      captureToken={captureToken}
      treatment={treatmentRes.data}
      patient={patientRes.data as { id: string; first_name: string; full_name: string }}
      photoSessions={sessionsRes.data ?? []}
      comparison={comparisonRes.data ?? null}
      recommendations={recommendationsRes.data ?? []}
      protocol={protocol.data ?? null}
      story={story}
      initialTab={purpose === 'photo' ? 'photos' : 'plan'}
    />
  )
}
