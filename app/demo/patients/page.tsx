import Link from 'next/link'
import { DEMO_PATIENTS } from '@/lib/demo/data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, ChevronRight } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'

const TRAFFIC_LIGHT = {
  green: { label: 'Normal', class: 'bg-green-500' },
  yellow: { label: 'Próxima', class: 'bg-yellow-400' },
  red: { label: 'Riesgo', class: 'bg-red-500' },
}

export default function DemoPatientsPage() {
  return (
    <div className="p-7 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Pacientes</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{DEMO_PATIENTS.length} pacientes activas en esta demo</p>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Todas las pacientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {DEMO_PATIENTS.map((p) => (
              <Link key={p.id} href={`/demo/patients/${p.id}`}>
                <div className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${TRAFFIC_LIGHT[p.trafficLight].class}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{p.full_name}</span>
                      {p.isVip && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{p.phone_e164}</p>
                  </div>
                  {p.nextExpected && (
                    <Badge variant="outline" className={`text-xs hidden md:flex ${p.trafficLight === 'red' ? 'border-red-300 text-red-600' : p.trafficLight === 'yellow' ? 'border-yellow-300 text-yellow-700' : ''}`}>
                      {formatRelativeDate(p.nextExpected)}
                    </Badge>
                  )}
                  {p.pendingPhoto && <Badge variant="secondary" className="text-xs">📷 Foto pendiente</Badge>}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
