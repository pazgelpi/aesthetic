import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { PatientPortal } from '@/components/portal/patient-portal'

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

  const { data: protocol } = await supabase
    .from('clinic_protocols')
    .select('*')
    .eq('clinic_id', treatmentRes.data.clinic_id)
    .eq('treatment_type', treatmentRes.data.treatment_type)
    .maybeSingle()

  // Log adherence visit
  await supabase.from('adherence_logs').insert({
    patient_id: captureToken.patient_id,
    clinic_id: treatmentRes.data.clinic_id,
    logged_at: new Date().toISOString(),
  })

  return (
    <PatientPortal
      token={token}
      captureToken={captureToken}
      treatment={treatmentRes.data}
      patient={patientRes.data as { id: string; first_name: string; full_name: string }}
      photoSessions={sessionsRes.data ?? []}
      comparison={comparisonRes.data ?? null}
      recommendations={recommendationsRes.data ?? []}
      protocol={protocol ?? null}
      initialTab={purpose === 'photo' ? 'photos' : 'plan'}
    />
  )
}
