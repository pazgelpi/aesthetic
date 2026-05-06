import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { ClinicWizard } from '@/components/wizard/clinic-wizard'
import { GoogleIntegration } from '@/components/settings/google-integration'

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

  const admin = createAdminClient()
  const [clinicRes, profileRes, protocolsRes, documentsRes, oauthRes] = await Promise.all([
    supabase.from('clinics').select('id, name, city, phone').eq('id', professional.clinic_id).single(),
    supabase.from('clinic_profiles').select('*').eq('clinic_id', professional.clinic_id).single(),
    supabase.from('clinic_protocols').select('*').eq('clinic_id', professional.clinic_id),
    supabase.from('clinic_documents').select('*').eq('clinic_id', professional.clinic_id).order('created_at', { ascending: false }),
    // oauth_credentials may not be in generated types yet — use raw query with cast
    admin.from('oauth_credentials' as string).select('google_email').eq('professional_id', professional.id).eq('provider', 'google').maybeSingle(),
  ])

  const oauthData = oauthRes.data as { google_email: string | null } | null

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración de clínica</h1>
        <p className="text-sm text-muted-foreground">
          Configurá tu perfil de voz, protocolos y documentos. La AI del producto opera con esta información.
        </p>
      </div>

      <GoogleIntegration
        connected={!!oauthData}
        googleEmail={oauthData?.google_email}
      />

      <ClinicWizard
        clinic={clinicRes.data ?? { id: professional.clinic_id, name: '', city: null, phone: null }}
        profile={profileRes.data}
        protocols={protocolsRes.data ?? []}
        documents={documentsRes.data ?? []}
        clinicId={professional.clinic_id}
        professionalName={professional.full_name}
      />
    </div>
  )
}
