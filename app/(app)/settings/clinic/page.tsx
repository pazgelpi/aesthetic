import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ClinicWizard } from '@/components/wizard/clinic-wizard'

export const revalidate = 0

export default async function ClinicSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: professional } = await supabase
    .from('professionals')
    .select('id, clinic_id, full_name, role')
    .eq('user_id', user.id)
    .single()
  if (!professional) redirect('/onboarding')

  const { data: clinic } = await supabase
    .from('clinics')
    .select('id, name, city, phone')
    .eq('id', professional.clinic_id)
    .single()

  const { data: profile } = await supabase
    .from('clinic_profiles')
    .select('*')
    .eq('clinic_id', professional.clinic_id)
    .single()

  const { data: protocols } = await supabase
    .from('clinic_protocols')
    .select('*')
    .eq('clinic_id', professional.clinic_id)

  const { data: documents } = await supabase
    .from('clinic_documents')
    .select('*')
    .eq('clinic_id', professional.clinic_id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración de clínica</h1>
        <p className="text-sm text-muted-foreground">
          Configurá tu perfil de voz, protocolos y documentos. La AI del producto opera con esta información.
        </p>
      </div>
      <ClinicWizard
        clinic={clinic ?? { id: professional.clinic_id, name: '', city: null, phone: null }}
        profile={profile}
        protocols={protocols ?? []}
        documents={documents ?? []}
        clinicId={professional.clinic_id}
        professionalName={professional.full_name}
      />
    </div>
  )
}
