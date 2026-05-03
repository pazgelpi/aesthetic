import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { PatientDetail } from '@/components/patients/patient-detail'

export const revalidate = 0

export default async function PatientPage({
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

  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .eq('clinic_id', professional.clinic_id)
    .single()

  if (!patient) notFound()

  const [treatmentsRes, messagesRes, recommendationsRes] = await Promise.all([
    supabase.from('treatments').select('*').eq('patient_id', id).order('treated_at', { ascending: false }),
    supabase.from('scheduled_messages').select('*').eq('patient_id', id).order('scheduled_for', { ascending: false }),
    supabase.from('recommendations').select('*').eq('patient_id', id).eq('status', 'active').order('suggested_at', { ascending: false }),
  ])

  return (
    <PatientDetail
      patient={patient}
      treatments={treatmentsRes.data ?? []}
      messages={messagesRes.data ?? []}
      recommendations={recommendationsRes.data ?? []}
    />
  )
}
