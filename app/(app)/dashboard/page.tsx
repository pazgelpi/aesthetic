import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardKpis } from '@/components/dashboard/dashboard-kpis'
import { PriorityActions } from '@/components/dashboard/priority-actions'
import { PatientsTable } from '@/components/patients/patients-table'
import { differenceInDays } from 'date-fns'
import { Patient, Treatment } from '@/types/database'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: professional } = await supabase
    .from('professionals')
    .select('clinic_id')
    .eq('user_id', user.id)
    .single()

  if (!professional) redirect('/onboarding')
  const clinicId = professional.clinic_id

  // Fetch all active patients with their last treatment
  const { data: patientsRaw } = await supabase
    .from('patients')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('status', 'active')
    .order('updated_at', { ascending: false })

  const { data: allTreatmentsRaw } = await supabase
    .from('treatments')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('treated_at', { ascending: false })

  // Fetch pending messages (no response, older than 21 days)
  const { data: pendingMessagesRaw } = await supabase
    .from('scheduled_messages')
    .select('patient_id, scheduled_for')
    .eq('clinic_id', clinicId)
    .eq('template_type', 'day14_photo_request')
    .eq('status', 'sent')
    .is('patient_response', null)

  const patients = patientsRaw ?? []
  const allTreatments = allTreatmentsRaw ?? []
  const pendingMessages = pendingMessagesRaw ?? []

  const pendingPhotoMap = new Map<string, number>()
  for (const msg of pendingMessages) {
    const daysSince = differenceInDays(new Date(), new Date(msg.scheduled_for))
    if (daysSince >= 21) {
      pendingPhotoMap.set(msg.patient_id, (pendingPhotoMap.get(msg.patient_id) ?? 0) + 1)
    }
  }

  // Build patient status map
  const treatmentsByPatient = new Map<string, Treatment[]>()
  for (const t of allTreatments) {
    const arr = treatmentsByPatient.get(t.patient_id) ?? []
    arr.push(t)
    treatmentsByPatient.set(t.patient_id, arr)
  }

  const patientsWithStatus = patients.map((p) => {
    const treatments = treatmentsByPatient.get(p.id) ?? []
    const lastTreatment = treatments[0] ?? null
    const pendingPhoto = (pendingPhotoMap.get(p.id) ?? 0) > 0
    const now = new Date()

    let trafficLight: 'green' | 'yellow' | 'red' = 'green'
    if (lastTreatment) {
      const expected = lastTreatment.expected_re_treatment_at
        ? new Date(lastTreatment.expected_re_treatment_at)
        : null

      if (pendingPhoto) {
        trafficLight = 'red'
      } else if (expected && differenceInDays(now, expected) > 30) {
        trafficLight = 'red'
      } else if (expected && differenceInDays(expected, now) <= 21) {
        trafficLight = 'yellow'
      }
    }

    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const isVip = treatments.filter((t) => new Date(t.treated_at) >= oneYearAgo).length > 3

    return {
      ...p,
      trafficLight,
      isVip,
      lastTreatment,
      nextExpected: lastTreatment?.expected_re_treatment_at ?? null,
      pendingPhoto,
    }
  })

  const kpis = {
    totalActive: patientsWithStatus.length,
    pendingThisWeek: patientsWithStatus.filter((p) => {
      if (!p.nextExpected) return false
      const days = differenceInDays(new Date(p.nextExpected), new Date())
      return days >= 0 && days <= 7
    }).length,
    atRisk: patientsWithStatus.filter((p) => p.trafficLight === 'red').length,
    nearBaseline: patientsWithStatus.filter((p) => p.trafficLight === 'yellow').length,
    pendingPhoto: patientsWithStatus.filter((p) => p.pendingPhoto).length,
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Seguimiento de tus pacientes activas</p>
        </div>
        <Link href="/treatments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo tratamiento
          </Button>
        </Link>
      </div>

      <DashboardKpis kpis={kpis} />
      <PriorityActions
        nearBaseline={patientsWithStatus.filter((p) => p.trafficLight === 'yellow')}
        atRisk={patientsWithStatus.filter((p) => p.trafficLight === 'red')}
        pendingPhoto={patientsWithStatus.filter((p) => p.pendingPhoto)}
      />
      <PatientsTable patients={patientsWithStatus} />
    </div>
  )
}
