'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CalendarEvent {
  id: string
  date: Date
  patientId: string
  patientName: string
  type: 'toxin' | 'filler'
  label: string
  href: string
}

// ─── Color palette (one per patient/slot) ────────────────────────────────────

const COLORS: Record<string, { pill: string; dot: string; text: string }> = {
  'demo-p1': { pill: 'bg-violet-50 border-violet-200',  dot: 'bg-violet-500',  text: 'text-violet-700'  },
  'demo-p2': { pill: 'bg-amber-50 border-amber-200',    dot: 'bg-amber-400',   text: 'text-amber-700'   },
  'demo-p3': { pill: 'bg-rose-50 border-rose-200',      dot: 'bg-rose-400',    text: 'text-rose-700'    },
  'extra-1': { pill: 'bg-sky-50 border-sky-200',        dot: 'bg-sky-500',     text: 'text-sky-700'     },
  'extra-2': { pill: 'bg-emerald-50 border-emerald-200',dot: 'bg-emerald-500', text: 'text-emerald-700' },
  'extra-3': { pill: 'bg-pink-50 border-pink-200',      dot: 'bg-pink-400',    text: 'text-pink-700'    },
  'extra-4': { pill: 'bg-indigo-50 border-indigo-200',  dot: 'bg-indigo-400',  text: 'text-indigo-700'  },
  'extra-5': { pill: 'bg-teal-50 border-teal-200',      dot: 'bg-teal-500',    text: 'text-teal-700'    },
}

const LEGEND = [
  { id: 'demo-p1', name: 'Sofía R.'    },
  { id: 'demo-p2', name: 'Camila L.'   },
  { id: 'demo-p3', name: 'Lucía G.'    },
  { id: 'extra-1', name: 'Valentina M.'},
  { id: 'extra-2', name: 'Martina S.'  },
  { id: 'extra-3', name: 'Isabella R.' },
  { id: 'extra-4', name: 'Carolina P.' },
  { id: 'extra-5', name: 'Renata F.'   },
]

// ─── Event builder (relative to today so always current) ─────────────────────

function buildEvents(): CalendarEvent[] {
  const base = new Date()
  const d = (offset: number) => {
    const date = new Date(base)
    date.setDate(base.getDate() + offset)
    date.setHours(10, 0, 0, 0)
    return date
  }
  return [
    { id: 'ev-1', date: d(-15), patientId: 'demo-p3', patientName: 'Lucía G.',      type: 'filler', label: 'Retratamiento',    href: '/demo/treatments/demo-t3' },
    { id: 'ev-2', date: d(3),   patientId: 'extra-1', patientName: 'Valentina M.',  type: 'toxin',  label: 'Retratamiento',    href: '/demo/treatments'         },
    { id: 'ev-3', date: d(7),   patientId: 'extra-2', patientName: 'Martina S.',    type: 'filler', label: 'Primera consulta', href: '/demo/treatments'         },
    { id: 'ev-4', date: d(12),  patientId: 'extra-3', patientName: 'Isabella R.',   type: 'filler', label: 'Filler facial',    href: '/demo/treatments'         },
    { id: 'ev-5', date: d(14),  patientId: 'demo-p2', patientName: 'Camila L.',     type: 'toxin',  label: 'Retratamiento',    href: '/demo/treatments/demo-t2' },
    { id: 'ev-6', date: d(20),  patientId: 'extra-4', patientName: 'Carolina P.',   type: 'toxin',  label: 'Retratamiento',    href: '/demo/treatments'         },
    { id: 'ev-7', date: d(25),  patientId: 'extra-5', patientName: 'Renata F.',     type: 'toxin',  label: 'Toxina botulínica',href: '/demo/treatments'         },
    { id: 'ev-8', date: d(45),  patientId: 'demo-p1', patientName: 'Sofía R.',      type: 'toxin',  label: 'Retratamiento',    href: '/demo/treatments/demo-t1' },
  ]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTH_ES  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS_ES   = ['Lu','Ma','Mi','Ju','Vi','Sa','Do']

function sameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MonthCalendar() {
  const today   = new Date()
  const events  = buildEvents()

  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const year  = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDow    = (new Date(year, month, 1).getDay() + 6) % 7   // Mon = 0
  const totalCells  = Math.ceil((startDow + daysInMonth) / 7) * 7

  const cells = Array.from({ length: totalCells }, (_, i) =>
    new Date(year, month, 1 + (i - startDow))
  )

  const upcoming = events
    .filter(e => e.date > today || sameDay(e.date, today))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 8)

  return (
    <Card className="overflow-hidden shadow-sm">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <CardHeader className="px-6 pt-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
              Planner de citas
            </p>
            <h2 className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              {MONTH_ES[month]} {year}
            </h2>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
              className="text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              Hoy
            </button>
            <button
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid lg:grid-cols-[1fr_264px] divide-y lg:divide-y-0 lg:divide-x divide-border">

          {/* ── Calendar grid ───────────────────────────────────────── */}
          <div className="p-5">
            {/* Day-of-week labels */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS_ES.map(d => (
                <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground py-1.5">
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-px bg-border rounded-2xl overflow-hidden ring-1 ring-border">
              {cells.map((date, i) => {
                const inMonth  = date.getMonth() === month
                const isToday  = sameDay(date, today)
                const isPast   = date < today && !isToday
                const dayEvs   = events.filter(e => sameDay(e.date, date))

                return (
                  <div
                    key={i}
                    className={`bg-card min-h-[76px] p-1.5 flex flex-col transition-colors ${
                      !inMonth ? 'opacity-30' : ''
                    } ${isToday ? 'bg-violet-50/60' : ''}`}
                  >
                    {/* Day number */}
                    <div className="flex justify-end mb-1">
                      <span
                        className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium transition-colors ${
                          isToday
                            ? 'bg-[var(--primary)] text-white font-bold'
                            : isPast && inMonth
                            ? 'text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {date.getDate()}
                      </span>
                    </div>

                    {/* Event pills */}
                    <div className="flex flex-col gap-0.5">
                      {dayEvs.slice(0, 2).map(ev => {
                        const c = COLORS[ev.patientId] ?? COLORS['extra-1']
                        return (
                          <Link key={ev.id} href={ev.href}>
                            <div
                              className={`flex items-center gap-1 rounded-md px-1 py-0.5 border text-[10px] font-medium truncate hover:opacity-75 transition-opacity ${c.pill} ${c.text}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                              <span className="truncate leading-tight">
                                {ev.patientName.split(' ')[0]}
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                      {dayEvs.length > 2 && (
                        <span className="text-[9px] text-muted-foreground pl-1 leading-tight">
                          +{dayEvs.length - 2} más
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Sidebar: upcoming + legend ──────────────────────────── */}
          <div className="flex flex-col p-5 gap-5">
            {/* Upcoming list */}
            <div className="flex-1 space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Próximas citas
              </p>
              {upcoming.length === 0 && (
                <p className="text-sm text-muted-foreground">Sin citas próximas.</p>
              )}
              {upcoming.map(ev => {
                const c = COLORS[ev.patientId] ?? COLORS['extra-1']
                const msUntil  = ev.date.getTime() - today.getTime()
                const daysUntil = Math.round(msUntil / 864e5)
                const urgency  = daysUntil === 0 ? 'text-rose-600 font-bold' : daysUntil <= 7 ? 'text-rose-500 font-semibold' : daysUntil <= 14 ? 'text-amber-500' : 'text-muted-foreground'

                return (
                  <Link key={ev.id} href={ev.href}>
                    <div className="flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer group">
                      {/* Date badge */}
                      <div className={`shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center border ${c.pill} ${c.text}`}>
                        <span className="text-sm font-bold leading-none">{ev.date.getDate()}</span>
                        <span className="text-[9px] uppercase leading-none mt-0.5 opacity-60">
                          {MONTH_ES[ev.date.getMonth()].slice(0, 3)}
                        </span>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-[var(--primary)] transition-colors">
                          {ev.patientName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {ev.label} · {ev.type === 'toxin' ? 'Toxina' : 'Filler'}
                        </p>
                      </div>
                      {/* Days until */}
                      <span className={`text-[11px] shrink-0 ${urgency}`}>
                        {daysUntil === 0 ? 'Hoy' : `${daysUntil}d`}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Legend */}
            <div className="border-t border-border pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Pacientes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {LEGEND.map(({ id, name }) => {
                  const c = COLORS[id]
                  return (
                    <div
                      key={id}
                      className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${c.pill} ${c.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                      {name}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
