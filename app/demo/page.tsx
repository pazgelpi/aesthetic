import Link from 'next/link'
import { Plus, ChevronRight, Star } from 'lucide-react'
import { DashboardKpis } from '@/components/dashboard/dashboard-kpis'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MonthCalendar } from '@/components/demo/month-calendar'
import { DEMO_KPIS, DEMO_PATIENTS, DEMO_PROFESSIONAL, TREATMENT_TYPE_LABELS } from '@/lib/demo/data'
import { formatRelativeDate } from '@/lib/utils'

const TRAFFIC_LIGHT = {
  green:  { label: 'Normal',   color: 'var(--status-green)' },
  yellow: { label: 'Próxima',  color: 'var(--status-amber)' },
  red:    { label: 'Riesgo',   color: 'var(--status-rose)'  },
}

// Group patients by treatmentType, preserving order of first appearance
function groupByType(patients: typeof DEMO_PATIENTS) {
  const order: string[] = []
  const map: Record<string, typeof DEMO_PATIENTS> = {}
  for (const p of patients) {
    const t = p.treatmentType
    if (!map[t]) { map[t] = []; order.push(t) }
    map[t].push(p)
  }
  return order.map(t => ({ type: t, label: TREATMENT_TYPE_LABELS[t] ?? t, patients: map[t] }))
}

export default function DemoDashboard() {
  const atRisk      = DEMO_PATIENTS.filter(p => p.trafficLight === 'red')
  const nearBaseline = DEMO_PATIENTS.filter(p => p.trafficLight === 'yellow')
  const groups      = groupByType(DEMO_PATIENTS)

  return (
    <div className="p-7 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p
            className="mb-1"
            style={{
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
            }}
          >
            Seguimiento de pacientes activas
          </p>
          <h1
            className="text-4xl leading-none tracking-tight"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Hola,{' '}
            <em>{DEMO_PROFESSIONAL.full_name.split(' ')[1]}.</em>
          </h1>
        </div>
        <Button
          className="rounded-lg shadow-sm text-[var(--primary-foreground)] font-medium"
          style={{ background: 'var(--terracota)' }}
          disabled
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo tratamiento
        </Button>
      </div>

      {/* KPI strip */}
      <DashboardKpis kpis={DEMO_KPIS} />

      {/* ── Por tipo de tratamiento ── */}
      <div>
        <p
          className="mb-3"
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
          }}
        >
          Por tipo de tratamiento
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {groups.map(({ type, label, patients }) => {
            const nRed    = patients.filter(p => p.trafficLight === 'red').length
            const nYellow = patients.filter(p => p.trafficLight === 'yellow').length
            const nGreen  = patients.filter(p => p.trafficLight === 'green').length
            const hasCritical = nRed > 0
            return (
              <div
                key={type}
                className="rounded-xl p-4 flex flex-col gap-2"
                style={{
                  background: 'var(--paper)',
                  border: `1px solid ${hasCritical ? 'rgba(184,90,90,0.25)' : 'var(--hairline-strong)'}`,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: hasCritical ? 'var(--status-rose)' : 'var(--ink-3)',
                  }}
                >
                  {label}
                </p>
                <p
                  className="leading-none"
                  style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 36 }}
                >
                  {patients.length}
                </p>
                <p className="text-xs" style={{ color: 'var(--ink-4)' }}>
                  {patients.length === 1 ? 'paciente' : 'pacientes'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {nRed > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--status-rose)' }} />
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, color: 'var(--status-rose)' }}>{nRed}</span>
                    </span>
                  )}
                  {nYellow > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--status-amber)' }} />
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, color: 'var(--status-amber)' }}>{nYellow}</span>
                    </span>
                  )}
                  {nGreen > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--status-green)' }} />
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, color: 'var(--status-green)' }}>{nGreen}</span>
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Priority actions */}
      {(atRisk.length > 0 || nearBaseline.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">

          {atRisk.length > 0 && (
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--status-rose-tint)', border: '1px solid rgba(184,90,90,0.2)' }}
            >
              <p
                className="mb-3 flex items-center gap-1.5"
                style={{
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--status-rose)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--status-rose)' }} />
                Riesgo de churn
              </p>
              <div className="space-y-1">
                {atRisk.map(p => (
                  <Link key={p.id} href={`/demo/patients/${p.id}`}>
                    <div
                      className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
                      style={{ background: 'rgba(184,90,90,0.06)' }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--status-rose)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{p.full_name}</span>
                        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'var(--status-rose)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                          {TREATMENT_TYPE_LABELS[p.treatmentType]?.split(' ')[0]}
                        </span>
                        {p.pendingPhoto && (
                          <Badge variant="secondary" className="text-xs">📷 Foto</Badge>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4" style={{ color: 'var(--ink-3)' }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {nearBaseline.length > 0 && (
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--status-amber-tint)', border: '1px solid rgba(184,133,46,0.2)' }}
            >
              <p
                className="mb-3 flex items-center gap-1.5"
                style={{
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--status-amber)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--status-amber)' }} />
                Próximas a retratarse
              </p>
              <div className="space-y-1">
                {nearBaseline.map(p => (
                  <Link key={p.id} href={`/demo/patients/${p.id}`}>
                    <div
                      className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
                      style={{ background: 'rgba(184,133,46,0.06)' }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--status-amber)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{p.full_name}</span>
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono)',
                          fontSize: 11,
                          color: 'var(--status-amber)',
                        }}
                      >
                        {p.nextExpected ? formatRelativeDate(p.nextExpected) : ''}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Month planner */}
      <MonthCalendar />

      {/* ── Patient table — grouped by treatment type ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle
            className="text-xl leading-tight"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Pacientes <em>activas</em>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {groups.map(({ type, label, patients }, gi) => (
            <div key={type}>
              {/* Group header */}
              <div
                className="px-6 py-2.5 flex items-center gap-3"
                style={{
                  borderTop: gi === 0 ? '1px solid var(--border)' : undefined,
                  borderBottom: '1px solid var(--hairline-strong)',
                  background: 'var(--cream-2)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: 9.5,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-3)',
                  }}
                >
                  {label} · {patients.length} {patients.length === 1 ? 'paciente' : 'pacientes'}
                </span>
              </div>

              {/* Patient rows */}
              <div className="divide-y divide-border">
                {patients.map((p) => (
                  <Link key={p.id} href={`/demo/patients/${p.id}`}>
                    <div className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/50 transition-colors cursor-pointer">
                      {/* Status dot */}
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: TRAFFIC_LIGHT[p.trafficLight].color }}
                        title={TRAFFIC_LIGHT[p.trafficLight].label}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-lg leading-tight truncate"
                            style={{ fontFamily: 'var(--font-instrument-serif)' }}
                          >
                            {p.full_name}
                          </span>
                          {p.isVip && (
                            <Star
                              className="h-3 w-3 shrink-0"
                              style={{ color: 'var(--vip)', fill: 'var(--vip)' }}
                            />
                          )}
                        </div>
                        <p
                          style={{
                            fontFamily: 'var(--font-jetbrains-mono)',
                            fontSize: 10.5,
                            color: 'var(--ink-4)',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {p.phone_e164}
                        </p>
                      </div>
                      <div className="hidden md:block w-40 shrink-0">
                        {p.nextExpected && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: p.trafficLight === 'red'
                                ? 'var(--status-rose-tint)'
                                : p.trafficLight === 'yellow'
                                ? 'var(--status-amber-tint)'
                                : 'var(--status-green-tint)',
                              color: p.trafficLight === 'red'
                                ? 'var(--status-rose)'
                                : p.trafficLight === 'yellow'
                                ? 'var(--status-amber)'
                                : 'var(--status-green)',
                              fontFamily: 'var(--font-jetbrains-mono)',
                              fontSize: 10,
                              letterSpacing: '0.06em',
                            }}
                          >
                            {formatRelativeDate(p.nextExpected)}
                          </span>
                        )}
                      </div>
                      {p.pendingPhoto && (
                        <Badge variant="secondary" className="text-xs shrink-0">📷 Foto</Badge>
                      )}
                      <ChevronRight className="h-4 w-4 shrink-0" style={{ color: 'var(--ink-4)' }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
