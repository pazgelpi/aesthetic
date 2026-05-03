'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Clock, Camera } from 'lucide-react'

interface Patient {
  id: string
  full_name: string
  trafficLight: 'green' | 'yellow' | 'red'
}

interface PriorityActionsProps {
  nearBaseline: Patient[]
  atRisk: Patient[]
  pendingPhoto: Patient[]
}

export function PriorityActions({ nearBaseline, atRisk, pendingPhoto }: PriorityActionsProps) {
  const hasAny = nearBaseline.length + atRisk.length + pendingPhoto.length > 0
  if (!hasAny) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Acciones prioritarias</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {atRisk.length > 0 && (
          <ActionRow
            icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
            label="En riesgo de churn"
            count={atRisk.length}
            patients={atRisk}
            color="red"
          />
        )}
        {nearBaseline.length > 0 && (
          <ActionRow
            icon={<Clock className="h-4 w-4 text-yellow-500" />}
            label="Próximas a baseline"
            count={nearBaseline.length}
            patients={nearBaseline}
            color="yellow"
          />
        )}
        {pendingPhoto.length > 0 && (
          <ActionRow
            icon={<Camera className="h-4 w-4 text-purple-500" />}
            label="Foto post pendiente"
            count={pendingPhoto.length}
            patients={pendingPhoto}
            color="purple"
          />
        )}
      </CardContent>
    </Card>
  )
}

function ActionRow({
  icon, label, count, patients, color,
}: {
  icon: React.ReactNode
  label: string
  count: number
  patients: Patient[]
  color: 'red' | 'yellow' | 'purple'
}) {
  const colorMap = {
    red: 'bg-red-50 border-red-100',
    yellow: 'bg-yellow-50 border-yellow-100',
    purple: 'bg-purple-50 border-purple-100',
  }
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${colorMap[color]}`}>
      {icon}
      <span className="text-sm font-medium flex-1">{label}</span>
      <Badge variant="secondary" className="shrink-0">{count}</Badge>
      <div className="flex gap-1 flex-wrap max-w-xs">
        {patients.slice(0, 3).map((p) => (
          <Link key={p.id} href={`/patients/${p.id}`}>
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">
              {p.full_name.split(' ')[0]}
            </Badge>
          </Link>
        ))}
        {patients.length > 3 && (
          <Badge variant="outline" className="text-xs">+{patients.length - 3}</Badge>
        )}
      </div>
    </div>
  )
}
