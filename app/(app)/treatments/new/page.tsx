import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewTreatmentForm } from '@/components/treatments/new-treatment-form'

export default async function NewTreatmentPage({
  searchParams,
}: {
  searchParams: Promise<{ patient?: string }>
}) {
  const { patient: patientId } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: professional } = await supabase
    .from('professionals')
    .select('id, clinic_id, full_name, role')
    .eq('user_id', user.id)
    .single()
  if (!professional) redirect('/onboarding')

  const { data: patientsRaw } = await supabase
    .from('patients')
    .select('id, full_name, first_name, phone_e164')
    .eq('clinic_id', professional.clinic_id)
    .eq('status', 'active')
    .order('full_name')

  const { data: protocolsRaw } = await supabase
    .from('clinic_protocols')
    .select('*')
    .eq('clinic_id', professional.clinic_id)

  const patients = patientsRaw ?? []
  const protocols = protocolsRaw ?? []

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nuevo tratamiento</h1>
        <p className="text-sm text-muted-foreground">
          Registrá el tratamiento y capturá las fotos pre-tratamiento.
        </p>
      </div>
      <NewTreatmentForm
        patients={patients as { id: string; full_name: string; first_name: string; phone_e164: string }[]}
        protocols={protocols}
        professionalId={professional.id}
        clinicId={professional.clinic_id}
        preselectedPatientId={patientId}
      />
    </div>
  )
}
