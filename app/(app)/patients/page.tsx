import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PatientsTable } from '@/components/patients/patients-table'
import { differenceInDays } from 'date-fns'
import { Treatment } from '@/types/database'

export const revalidate = 0

export default async function PatientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: professional } = await supabase
    .from('professionals')
    .select('clinic_id')
    .eq('user_id', user.id)
    .single()
  if (!professional) redirect('/onboarding')

  const { data: patientsRaw } = await supabase
    .from('patients')
    .select('*')
    .eq('clinic_id', professional.clinic_id)
    .neq('status', 'archived')
    .order('full_name')

  const { data: allTreatmentsRaw } = await supabase
    .from('treatments')
    .select('*')
    .eq('clinic_id', professional.clinic_id)
    .order('treated_at', { ascending: false })

  const patients = patientsRaw ?? []
  const allTreatments = allTreatmentsRaw ?? []

  const treatmentsByPatient = new Map<string, Treatment[]>()
  for (const t of allTreatments) {
    const arr = treatmentsByPatient.get(t.patient_id) ?? []
    arr.push(t)
    treatmentsByPatient.set(t.patient_id, arr)
  }

  const patientsWithStatus = patients.map((p) => {
    const treatments = treatmentsByPatient.get(p.id) ?? []
    const lastTreatment = treatments[0] ?? null
    const now = new Date()
    const oneYearAgo = new Date(); oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    let trafficLight: 'green' | 'yellow' | 'red' = 'green'
    if (lastTreatment?.expected_re_treatment_at) {
      const exp = new Date(lastTreatment.expected_re_treatment_at)
      if (differenceInDays(now, exp) > 30) trafficLight = 'red'
      else if (differenceInDays(exp, now) <= 21) trafficLight = 'yellow'
    }

    return {
      ...p,
      trafficLight,
      isVip: treatments.filter((t) => new Date(t.treated_at) >= oneYearAgo).length > 3,
      lastTreatment,
      nextExpected: lastTreatment?.expected_re_treatment_at ?? null,
      pendingPhoto: false,
    }
  })

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pacientes</h1>
          <p className="text-sm text-muted-foreground">{patientsRaw?.length ?? 0} pacientes registradas</p>
        </div>
        <Link href="/patients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva paciente
          </Button>
        </Link>
      </div>
      <PatientsTable patients={patientsWithStatus} />
    </div>
  )
}
