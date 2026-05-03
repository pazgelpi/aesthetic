import { Card, CardContent } from '@/components/ui/card'
import { Users, AlertTriangle, Clock, Camera } from 'lucide-react'

interface Kpis {
  totalActive: number
  pendingThisWeek: number
  atRisk: number
  nearBaseline: number
  pendingPhoto: number
}

export function DashboardKpis({ kpis }: { kpis: Kpis }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pacientes activas</p>
              <p className="text-3xl font-bold mt-1">{kpis.totalActive}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendientes esta semana</p>
              <p className="text-3xl font-bold mt-1">{kpis.pendingThisWeek}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En riesgo de churn</p>
              <p className="text-3xl font-bold mt-1 text-red-600">{kpis.atRisk}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Foto post pendiente</p>
              <p className="text-3xl font-bold mt-1">{kpis.pendingPhoto}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Camera className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
