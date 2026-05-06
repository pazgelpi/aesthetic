import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ImportWizard } from '@/components/import/import-wizard'

export default async function ImportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: professional } = await supabase
    .from('professionals')
    .select('clinic_id')
    .eq('user_id', user.id)
    .single()

  if (!professional) redirect('/onboarding')

  return (
    <div className="p-7 max-w-3xl mx-auto">
      <ImportWizard clinicId={professional.clinic_id} />
    </div>
  )
}
