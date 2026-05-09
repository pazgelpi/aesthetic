import Link from 'next/link'
import { Plus } from 'lucide-react'
import { DashboardKpis } from '@/components/dashboard/dashboard-kpis'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MonthCalendar } from '@/components/demo/month-calendar'
import { DEMO_KPIS, DEMO_PATIENTS, DEMO_PROFESSIONAL } from '@/lib/demo/data'
import { formatRelativeDate } from '@/lib/utils'
import { Star, ChevronRight, AlertTriangle, Clock } from 'lucide-react'

const TRAFFIC_LIGHT = {
  green: { label: 'Normal', class: 'bg-green-500' },
  yellow: { label: 'Próxima', class: 'bg-yellow-400' },
  red: { label: 'Riesgo', class: 'bg-red-500' },
}

export default function DemoDashboard() {
  const atRisk = DEMO_PATIENTS.filter(p => p.trafficLight === 'red')
  const nearBaseline = DEMO_PATIENTS.filter(p => p.trafficLight === 'yellow')

  return (
    <div className="p-7 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Hola, {DEMO_PROFESSIONAL.full_name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Seguimiento de tus pacientes activas</p>
        </div>
        <Button className="rounded-xl shadow-sm" disabled>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo tratamiento
        </Button>
      </div>

      <DashboardKpis kpis={DEMO_KPIS} />

      {/* Priority actions */}
      {(atRisk.length > 0 || nearBaseline.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {atRisk.length > 0 && (
            <Card className="border-rose-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-rose-700">
                  <AlertTriangle className="h-4 w-4" />
                  En riesgo de churn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {atRisk.map(p => (
                  <Link key={p.id} href={`/demo/patients/${p.id}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-rose-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm font-medium">{p.full_name}</span>
                      {p.pendingPhoto && <Badge variant="secondary" className="text-xs">📷 Foto</Badge>}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
          {nearBaseline.length > 0 && (
            <Card className="border-amber-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
                  <Clock className="h-4 w-4" />
                  Próximas a retratarse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {nearBaseline.map(p => (
                  <Link key={p.id} href={`/demo/patients/${p.id}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <span className="text-sm font-medium">{p.full_name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{p.nextExpected ? formatRelativeDate(p.nextExpected) : ''}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Month planner */}
      <MonthCalendar />

      {/* Patients table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Pacientes activas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {DEMO_PATIENTS.map((p) => (
              <Link key={p.id} href={`/demo/patients/${p.id}`}>
                <div className="flex items-center gap-4 px-6 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${TRAFFIC_LIGHT[p.trafficLight].class}`}
                    title={TRAFFIC_LIGHT[p.trafficLight].label}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{p.full_name}</span>
                      {p.isVip && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{p.phone_e164}</p>
                  </div>
                  <div className="hidden md:block w-40 shrink-0">
                    {p.nextExpected && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${p.trafficLight === 'red' ? 'border-red-300 text-red-600' : p.trafficLight === 'yellow' ? 'border-yellow-300 text-yellow-700' : ''}`}
                      >
                        {formatRelativeDate(p.nextExpected)}
                      </Badge>
                    )}
                  </div>
                  {p.pendingPhoto && <Badge variant="secondary" className="text-xs shrink-0">📷 Foto pendiente</Badge>}
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
