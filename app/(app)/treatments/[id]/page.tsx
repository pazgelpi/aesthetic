import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { TreatmentDetail } from '@/components/treatments/treatment-detail'

export const revalidate = 0

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: professional } = await supabase
    .from('professionals')
    .select('clinic_id')
    .eq('user_id', user.id)
    .single()
  if (!professional) redirect('/onboarding')

  const { data: treatment } = await supabase
    .from('treatments')
    .select('*')
    .eq('id', id)
    .eq('clinic_id', professional.clinic_id)
    .single()

  if (!treatment) notFound()

  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', treatment.patient_id)
    .single()

  const [sessionsRes, comparisonRes, tokenRes] = await Promise.all([
    supabase.from('photo_sessions').select('*').eq('treatment_id', id).order('captured_at'),
    supabase.from('comparisons').select('*').eq('treatment_id', id).order('generated_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('capture_tokens').select('token, purpose, expires_at').eq('treatment_id', id).eq('purpose', 'post_photo').gt('expires_at', new Date().toISOString()).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  return (
    <TreatmentDetail
      treatment={treatment}
      patient={patient!}
      photoSessions={sessionsRes.data ?? []}
      comparison={comparisonRes.data ?? null}
      captureToken={tokenRes.data?.token ?? null}
    />
  )
}
