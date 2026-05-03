import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/layout/app-sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        clinic={clinic ?? { id: professional.clinic_id, name: '', city: null, phone: null }}
        professional={professional}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
