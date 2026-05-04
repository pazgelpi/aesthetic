import { Users, AlertTriangle, Clock, Camera } from 'lucide-react'

interface Kpis {
  totalActive: number
  pendingThisWeek: number
  atRisk: number
  nearBaseline: number
  pendingPhoto: number
}

const cards = [
  {
    key: 'totalActive' as const,
    label: 'Pacientes activas',
    icon: Users,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    key: 'pendingThisWeek' as const,
    label: 'Por retratarse esta semana',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    key: 'atRisk' as const,
    label: 'En riesgo de churn',
    icon: AlertTriangle,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  {
    key: 'pendingPhoto' as const,
    label: 'Foto post pendiente',
    icon: Camera,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
  },
]

export function DashboardKpis({ kpis }: { kpis: Kpis }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color, bg, border }) => (
        <div
          key={key}
          className={`bg-white rounded-2xl border ${border} p-5 shadow-[0_1px_4px_oklch(0_0_0/0.06)]`}
        >
          <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${bg} mb-3`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <p className="text-2xl font-bold tracking-tight">{kpis[key]}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{label}</p>
        </div>
      ))}
    </div>
  )
}
