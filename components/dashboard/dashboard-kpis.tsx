interface Kpis {
  totalActive: number
  pendingThisWeek: number
  atRisk: number
  nearBaseline: number
  pendingPhoto: number
}

const items = [
  {
    key: 'totalActive' as const,
    label: 'Activas',
    sub: 'esta semana',
    dot: null,
  },
  {
    key: 'nearBaseline' as const,
    label: 'Por retratarse',
    sub: '≤ 21 días',
    dot: 'amber',
  },
  {
    key: 'atRisk' as const,
    label: 'Riesgo de churn',
    sub: 'sin respuesta',
    dot: 'rose',
  },
  {
    key: 'pendingPhoto' as const,
    label: 'Foto pendiente',
    sub: 'desde portal',
    dot: 'green',
  },
]

const DOT_COLOR: Record<string, string> = {
  green: 'var(--status-green)',
  amber: 'var(--status-amber)',
  rose:  'var(--status-rose)',
}

export function DashboardKpis({ kpis }: { kpis: Kpis }) {
  return (
    <div
      className="bg-card rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--hairline-strong)' }}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {items.map(({ key, label, sub, dot }) => (
          <div key={key} className="px-6 py-5 relative">
            {dot && (
              <div
                className="absolute top-5 right-5 w-2 h-2 rounded-full"
                style={{ background: DOT_COLOR[dot] }}
              />
            )}
            <div
              className="text-5xl leading-none tracking-tight mb-1.5"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {kpis[key]}
            </div>
            <div className="text-sm font-medium text-foreground">{label}</div>
            <div
              className="mt-0.5 uppercase tracking-widest"
              style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 10,
                color: 'var(--ink-4)',
                letterSpacing: '0.12em',
              }}
            >
              {sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
