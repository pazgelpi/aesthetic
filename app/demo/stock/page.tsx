'use client'

import { useState } from 'react'
import { DEMO_STOCK, TREATMENT_TYPE_LABELS, type StockItem } from '@/lib/demo/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle2, Clock, Package, ShoppingCart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// ─── Helpers ────────────────────────────────────────────────────────────────

function daysRemaining(item: StockItem): number {
  return Math.round((item.stock / item.monthlyUsage) * 30)
}

const STATUS_CONFIG = {
  critical: { label: 'Crítico',      color: 'var(--status-rose)',  tint: 'var(--status-rose-tint)',  dot: 'var(--status-rose)',  icon: AlertTriangle },
  warn:     { label: 'Reponer',      color: 'var(--status-amber)', tint: 'var(--status-amber-tint)', dot: 'var(--status-amber)', icon: Clock },
  ok:       { label: 'OK',           color: 'var(--status-green)', tint: 'var(--status-green-tint)', dot: 'var(--status-green)', icon: CheckCircle2 },
}

const CATEGORY_LABELS: Record<string, string> = {
  ...TREATMENT_TYPE_LABELS,
  general: 'General',
}

function suggestedOrder(item: StockItem): number {
  return Math.max(0, item.monthlyUsage * 2 - item.stock)
}

// ─── KPI strip ───────────────────────────────────────────────────────────────

function StockKpis() {
  const critical   = DEMO_STOCK.filter(i => i.status === 'critical').length
  const warn       = DEMO_STOCK.filter(i => i.status === 'warn').length
  const total      = DEMO_STOCK.length
  const valorTotal = DEMO_STOCK.reduce((acc, i) => acc + i.stock * i.costPerUnit, 0)

  const items = [
    { value: total,    label: 'Insumos activos',     sub: 'en inventario',       dot: null },
    { value: critical, label: 'Stock crítico',        sub: 'menos de 15 días',    dot: 'rose' as const },
    { value: warn,     label: 'Reponer pronto',       sub: '15 a 30 días',        dot: 'amber' as const },
    { value: `$${valorTotal.toLocaleString('es-AR')}`, label: 'Valor estimado', sub: 'stock actual', dot: null },
  ]

  const DOT_COLOR = { rose: 'var(--status-rose)', amber: 'var(--status-amber)', green: 'var(--status-green)' }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--hairline-strong)', background: 'var(--card)' }}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {items.map(({ value, label, sub, dot }, i) => (
          <div key={i} className="px-6 py-5 relative">
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
              {value}
            </div>
            <div className="text-sm font-medium">{label}</div>
            <div
              style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 10,
                color: 'var(--ink-4)',
                textTransform: 'uppercase',
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DemoStockPage() {
  const [generatingOrder, setGeneratingOrder] = useState(false)
  const [orderGenerated, setOrderGenerated] = useState(false)

  // Sort: critical first, then warn, then ok; within each group by days remaining asc
  const sorted = [...DEMO_STOCK].sort((a, b) => {
    const order = { critical: 0, warn: 1, ok: 2 }
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status]
    return daysRemaining(a) - daysRemaining(b)
  })

  const toReorder = DEMO_STOCK.filter(i => i.status === 'critical' || i.status === 'warn')
    .sort((a, b) => daysRemaining(a) - daysRemaining(b))

  function handleGenerateOrder() {
    setGeneratingOrder(true)
    setTimeout(() => {
      setGeneratingOrder(false)
      setOrderGenerated(true)
      toast.success('Orden de compra generada ✓', {
        description: `${toReorder.length} productos · valor estimado $${toReorder.reduce((acc, i) => acc + suggestedOrder(i) * i.costPerUnit, 0).toLocaleString('es-AR')}`,
      })
    }, 1800)
  }

  return (
    <div className="p-7 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p
            style={{
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
            }}
          >
            Gestión de insumos
          </p>
          <h1
            className="text-4xl leading-none tracking-tight mt-1"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Stock <em>& reposición.</em>
          </h1>
        </div>
        <Button
          className="rounded-lg font-medium"
          style={{ background: 'var(--terracota)', color: 'white' }}
          disabled
        >
          <Package className="mr-2 h-4 w-4" />
          Agregar insumo
        </Button>
      </div>

      {/* KPI strip */}
      <StockKpis />

      {/* Inventory table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle
            className="text-xl"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Inventario <em>actual</em>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column headers */}
          <div
            className="grid px-6 py-2.5 border-b border-border"
            style={{ gridTemplateColumns: '8px 1fr 80px 80px 80px 90px' }}
          >
            {['', 'Insumo', 'Stock', 'Uso/mes', 'Días', 'Acción'].map((h, i) => (
              <span
                key={i}
                className={i > 1 ? 'text-right' : ''}
                style={{
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 9.5,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-4)',
                }}
              >
                {h}
              </span>
            ))}
          </div>

          <div className="divide-y divide-border">
            {sorted.map((item) => {
              const days = daysRemaining(item)
              const cfg  = STATUS_CONFIG[item.status]
              const needsOrder = item.status !== 'ok'
              return (
                <div
                  key={item.id}
                  className="grid items-center px-6 py-3.5"
                  style={{ gridTemplateColumns: '8px 1fr 80px 80px 80px 90px' }}
                >
                  {/* Status dot */}
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: cfg.dot }}
                  />

                  {/* Name + category */}
                  <div className="min-w-0 pr-4">
                    <p
                      className="leading-tight truncate"
                      style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 16 }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono)',
                        fontSize: 9,
                        color: 'var(--ink-4)',
                        letterSpacing: '0.10em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {CATEGORY_LABELS[item.category] ?? item.category}
                    </p>
                  </div>

                  {/* Stock */}
                  <div className="text-right">
                    <span style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22 }}>
                      {item.stock}
                    </span>
                    <span
                      className="block"
                      style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'var(--ink-4)', letterSpacing: '0.08em' }}
                    >
                      {item.unit}
                    </span>
                  </div>

                  {/* Monthly usage */}
                  <div className="text-right">
                    <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 13, color: 'var(--ink-3)' }}>
                      {item.monthlyUsage}
                    </span>
                    <span
                      className="block"
                      style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'var(--ink-4)', letterSpacing: '0.08em' }}
                    >
                      / mes
                    </span>
                  </div>

                  {/* Days remaining */}
                  <div className="text-right">
                    <span
                      style={{
                        fontFamily: 'var(--font-instrument-serif)',
                        fontSize: 22,
                        color: cfg.color,
                      }}
                    >
                      {days}
                    </span>
                    <span
                      className="block"
                      style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'var(--ink-4)', letterSpacing: '0.08em' }}
                    >
                      días
                    </span>
                  </div>

                  {/* Action */}
                  <div className="text-right">
                    {needsOrder ? (
                      <span
                        className="inline-block rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{
                          background: cfg.tint,
                          color: cfg.color,
                          fontFamily: 'var(--font-jetbrains-mono)',
                          fontSize: 9.5,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {cfg.label}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono)',
                          fontSize: 9.5,
                          color: 'var(--ink-4)',
                          letterSpacing: '0.08em',
                        }}
                      >
                        OK
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Optimizar pedido — dark ink card ── */}
      {toReorder.length > 0 && (
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'linear-gradient(160deg, var(--ink) 0%, var(--ink-2) 100%)',
            border: '1px solid rgba(181,112,79,0.3)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 9.5,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                Reposición inteligente
              </p>
              <h2
                className="mt-1"
                style={{
                  fontFamily: 'var(--font-instrument-serif)',
                  fontSize: 28,
                  color: 'var(--paper)',
                  lineHeight: 1.1,
                }}
              >
                Optimizar <em>pedido.</em>
              </h2>
              <p
                className="mt-1 text-sm"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {toReorder.length} productos a reponer · 2 meses de reserva sugerido
              </p>
            </div>
            <Button
              className="shrink-0 rounded-xl font-medium"
              style={{
                background: orderGenerated ? 'var(--status-green)' : 'var(--terracota)',
                color: 'white',
              }}
              onClick={handleGenerateOrder}
              disabled={generatingOrder || orderGenerated}
            >
              {generatingOrder
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generando...</>
                : orderGenerated
                ? <><CheckCircle2 className="mr-2 h-4 w-4" />Orden enviada</>
                : <><ShoppingCart className="mr-2 h-4 w-4" />Generar orden de compra</>
              }
            </Button>
          </div>

          {/* Items list */}
          <div className="space-y-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
            {toReorder.map((item, i) => {
              const qty  = suggestedOrder(item)
              const cfg  = STATUS_CONFIG[item.status]
              const cost = qty * item.costPerUnit
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2.5"
                  style={{ borderBottom: i < toReorder.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--paper)' }}>{item.name}</p>
                      <p
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono)',
                          fontSize: 9.5,
                          color: 'rgba(255,255,255,0.35)',
                          letterSpacing: '0.10em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {daysRemaining(item)} días restantes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      style={{
                        fontFamily: 'var(--font-instrument-serif)',
                        fontSize: 18,
                        color: 'var(--paper)',
                      }}
                    >
                      {qty} {item.unit}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono)',
                        fontSize: 9.5,
                        color: 'rgba(255,255,255,0.4)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      ${cost.toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Total */}
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
          >
            <p
              style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              Total estimado del pedido
            </p>
            <p
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontSize: 28,
                color: 'var(--paper)',
              }}
            >
              ${toReorder.reduce((acc, i) => acc + suggestedOrder(i) * i.costPerUnit, 0).toLocaleString('es-AR')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
