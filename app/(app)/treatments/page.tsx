import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, formatRelativeDate } from '@/lib/utils'
import { differenceInDays } from 'date-fns'
import { Plus, Camera } from 'lucide-react'
import { Treatment, Patient } from '@/types/database'

export const revalidate = 0

export default async function TreatmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: professional } = await supabase
    .from('professionals')
    .select('clinic_id')
    .eq('user_id', user.id)
    .single()
  if (!professional) redirect('/onboarding')

  const { data: treatmentsRaw } = await supabase
    .from('treatments')
    .select('*')
    .eq('clinic_id', professional.clinic_id)
    .order('treated_at', { ascending: false })

  const treatments = treatmentsRaw ?? []

  const { data: patientsRaw } = await supabase
    .from('patients')
    .select('id, full_name')
    .eq('clinic_id', professional.clinic_id)

  const patientMap = new Map<string, string>()
  for (const p of patientsRaw ?? []) {
    patientMap.set(p.id, p.full_name)
  }

  const treatmentIds = treatments.map((t) => t.id)
  const { data: photoSessionsRaw } = treatmentIds.length > 0
    ? await supabase.from('photo_sessions').select('treatment_id, session_type').in('treatment_id', treatmentIds)
    : { data: [] }

  const photoMap = new Map<string, Set<string>>()
  for (const ps of photoSessionsRaw ?? []) {
    if (!photoMap.has(ps.treatment_id)) photoMap.set(ps.treatment_id, new Set())
    photoMap.get(ps.treatment_id)!.add(ps.session_type)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tratamientos</h1>
          <p className="text-sm text-muted-foreground">{treatments.length} registrados</p>
        </div>
        <Button asChild>
          <Link href="/treatments/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo tratamiento
          </Link>
        </Button>
      </div>

      {treatments.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground mb-4">Aún no hay tratamientos registrados.</p>
            <Button asChild>
              <Link href="/treatments/new">
                <Plus className="mr-2 h-4 w-4" />
                Registrar primer tratamiento
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {treatments.map((treatment: Treatment) => {
            const sessions = photoMap.get(treatment.id) ?? new Set()
            const hasPre = sessions.has('pre')
            const hasPost = sessions.has('post_14d') || sessions.has('post_30d')
            const expectedAt = treatment.expected_re_treatment_at ? new Date(treatment.expected_re_treatment_at) : null
            const trafficLight: 'green' | 'yellow' | 'red' = expectedAt
              ? differenceInDays(new Date(), expectedAt) > 30 ? 'red'
              : differenceInDays(expectedAt, new Date()) <= 21 ? 'yellow'
              : 'green'
              : 'green'
            const patientName = patientMap.get(treatment.patient_id) ?? 'Paciente desconocida'

            return (
              <Link key={treatment.id} href={`/treatments/${treatment.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          trafficLight === 'green' ? 'bg-green-500' :
                          trafficLight === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm">{patientName}</span>
                          <Badge variant={treatment.treatment_type === 'toxin' ? 'default' : 'secondary'} className="text-xs">
                            {treatment.treatment_type === 'toxin' ? 'Toxina' : 'Filler'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-3">
                          <span>{formatDate(treatment.treated_at)}</span>
                          <span>{treatment.areas_treated.slice(0, 3).join(', ')}{treatment.areas_treated.length > 3 ? '…' : ''}</span>
                          {treatment.expected_re_treatment_at && (
                            <span>Próximo: {formatRelativeDate(treatment.expected_re_treatment_at)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {hasPre && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Camera className="h-3 w-3" /> Pre
                          </Badge>
                        )}
                        {hasPost && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Camera className="h-3 w-3" /> Post
                          </Badge>
                        )}
                        {!hasPre && (
                          <Badge variant="destructive" className="text-xs">Sin fotos</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
