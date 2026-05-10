'use client'

import { useState } from 'react'
import {
  DEMO_STOCK, DEMO_CI_PROVIDERS, DEMO_QUOTE_RESPONSES,
  TREATMENT_TYPE_LABELS, type StockItem, type CIProvider,
} from '@/lib/demo/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle, CheckCircle2, Clock, Package, X,
  Sparkles, Mail, ChevronDown, Loader2, ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Helpers ────────────────────────────────────────────────────────────────

function daysRemaining(item: StockItem): number {
  return Math.round((item.stock / item.monthlyUsage) * 30)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.round(diff / 3600000)
  return `hace ${hrs}h`
}

const STATUS_CONFIG = {
  critical: { label: 'Crítico',  color: 'var(--status-rose)',  tint: 'var(--status-rose-tint)',  dot: 'var(--status-rose)',  icon: AlertTriangle },
  warn:     { label: 'Reponer',  color: 'var(--status-amber)', tint: 'var(--status-amber-tint)', dot: 'var(--status-amber)', icon: Clock },
  ok:       { label: 'OK',       color: 'var(--status-green)', tint: 'var(--status-green-tint)', dot: 'var(--status-green)', icon: CheckCircle2 },
}

const CATEGORY_LABELS: Record<string, string> = {
  ...TREATMENT_TYPE_LABELS,
  general: 'General',
}

const CI_CATEGORIES = [
  { key: 'toxin',       label: 'Toxina Botulínica' },
  { key: 'filler',      label: 'Ácido Hialurónico' },
  { key: 'peel',        label: 'Peeling' },
  { key: 'prp',         label: 'PRP / Plasma' },
  { key: 'mesotherapy', label: 'Mesoterapia' },
  { key: 'general',     label: 'General / Descartables' },
]

// ─── KPI strip ───────────────────────────────────────────────────────────────

function StockKpis() {
  const critical   = DEMO_STOCK.filter(i => i.status === 'critical').length
  const warn       = DEMO_STOCK.filter(i => i.status === 'warn').length
  const total      = DEMO_STOCK.length
  const valorTotal = DEMO_STOCK.reduce((acc, i) => acc + i.stock * i.costPerUnit, 0)

  const items = [
    { value: total,    label: 'Insumos activos',  sub: 'en inventario',    dot: null },
    { value: critical, label: 'Stock crítico',     sub: 'menos de 15 días', dot: 'rose' as const },
    { value: warn,     label: 'Reponer pronto',    sub: '15 a 30 días',     dot: 'amber' as const },
    { value: `$${valorTotal.toLocaleString('es-AR')}`, label: 'Valor estimado', sub: 'stock actual', dot: null },
  ]
  const DOT_COLOR = { rose: 'var(--status-rose)', amber: 'var(--status-amber)', green: 'var(--status-green)' }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--hairline-strong)', background: 'var(--card)' }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {items.map(({ value, label, sub, dot }, i) => (
          <div key={i} className="px-6 py-5 relative">
            {dot && (
              <div className="absolute top-5 right-5 w-2 h-2 rounded-full" style={{ background: DOT_COLOR[dot] }} />
            )}
            <div className="text-5xl leading-none tracking-tight mb-1.5" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
              {value}
            </div>
            <div className="text-sm font-medium">{label}</div>
            <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              {sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Product Detail Drawer ────────────────────────────────────────────────────

function ProductDrawer({ item, onClose }: { item: StockItem; onClose: () => void }) {
  const days = daysRemaining(item)
  const cfg  = STATUS_CONFIG[item.status]

  const fields = [
    { label: 'Marca / Fabricante', value: item.marca },
    { label: 'Proveedor',          value: item.proveedor },
    { label: 'Número de lote',     value: item.lote },
    { label: 'Vencimiento',        value: formatDate(item.vencimiento) },
    { label: 'Tratamiento',        value: CATEGORY_LABELS[item.tratamiento] ?? item.tratamiento },
    { label: 'Categoría',          value: CATEGORY_LABELS[item.category] ?? item.category },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.35)' }}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col overflow-y-auto"
        style={{
          width: 380,
          background: 'var(--card)',
          borderLeft: '1px solid var(--hairline-strong)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex-1 pr-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.dot }} />
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: cfg.tint, color: cfg.color, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}
              >
                {cfg.label}
              </span>
            </div>
            <h2 className="leading-tight" style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22 }}>
              {item.name}
            </h2>
          </div>
          <button onClick={onClose} className="shrink-0 p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4" style={{ color: 'var(--ink-3)' }} />
          </button>
        </div>

        {/* Stock metrics */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          {[
            { label: 'Stock actual', value: item.stock, unit: item.unit },
            { label: 'Uso / mes',    value: item.monthlyUsage, unit: item.unit },
            { label: 'Días rest.',   value: days, unit: 'días', color: cfg.color },
          ].map(({ label, value, unit, color }, i) => (
            <div key={i} className="px-4 py-4 text-center">
              <div
                className="text-3xl leading-none mb-0.5"
                style={{ fontFamily: 'var(--font-instrument-serif)', color: color ?? 'inherit' }}
              >
                {value}
              </div>
              <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
                {unit}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Detail fields */}
        <div className="p-6 space-y-4 flex-1">
          <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            Ficha del producto
          </p>
          <div className="space-y-3">
            {fields.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                  {label}
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Cost */}
          <div
            className="rounded-lg p-4 mt-2"
            style={{ background: 'var(--cream-2)', border: '1px solid var(--hairline-strong)' }}
          >
            <div className="flex items-baseline justify-between">
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                Costo unitario
              </span>
              <span style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 24, color: 'var(--ink)' }}>
                ${item.costPerUnit.toLocaleString('es-AR')}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                Valor stock total
              </span>
              <span style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 18, color: 'var(--ink-2)' }}>
                ${(item.costPerUnit * item.stock).toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Competitive Intelligence ─────────────────────────────────────────────────

function ProviderCard({ provider, sentIds, onSend }: {
  provider: CIProvider
  sentIds: Set<string>
  onSend: (p: CIProvider) => void
}) {
  const sent = sentIds.has(provider.id)
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm" style={{ color: 'var(--paper)' }}>{provider.empresa}</p>
          <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {provider.zona}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22, color: 'var(--paper)' }}>
            ${provider.precio}
          </p>
          <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>
            {provider.moneda} / {provider.unidad}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9 }}
        >
          Entrega {provider.entregaDias}d
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9 }}
        >
          Stock: {provider.stockDisponible} u.
        </span>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {provider.observaciones}
      </p>

      <div className="flex items-center justify-between gap-2 pt-1">
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
          {provider.contacto} · {provider.email}
        </span>
        <button
          onClick={() => onSend(provider)}
          disabled={sent}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
          style={{
            background: sent ? 'rgba(34,197,94,0.2)' : 'var(--terracota)',
            color: sent ? 'rgb(134,239,172)' : 'white',
            border: sent ? '1px solid rgba(34,197,94,0.3)' : 'none',
            cursor: sent ? 'default' : 'pointer',
          }}
        >
          {sent ? <><CheckCircle2 className="h-3 w-3" />Enviado</> : <><Mail className="h-3 w-3" />Pedir presupuesto</>}
        </button>
      </div>
    </div>
  )
}

function QuoteResponseCard({ qr }: { qr: typeof DEMO_QUOTE_RESPONSES[0] }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <button
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--status-green)' }} />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--paper)' }}>{qr.empresa}</p>
            <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
              {qr.asunto}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, color: 'rgba(255,255,255,0.35)' }}>
            {formatRelativeTime(qr.fechaRespuesta)}
          </span>
          <span style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 18, color: 'var(--paper)' }}>
            ${qr.precio} {qr.moneda}
          </span>
          <ChevronDown
            className="h-4 w-4 transition-transform"
            style={{ color: 'rgba(255,255,255,0.3)', transform: expanded ? 'rotate(180deg)' : 'none' }}
          />
        </div>
      </button>
      {expanded && (
        <div
          className="px-4 pb-4 space-y-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2 pt-3">
            <Mail className="h-3 w-3 shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
              De: {qr.email}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {qr.cuerpo}
          </p>
          <div className="flex items-center justify-between pt-2">
            <div>
              <p style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22, color: 'var(--paper)' }}>
                ${qr.precio} {qr.moneda} <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>/ {qr.unidad}</span>
              </p>
              <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {qr.disponibilidad}
              </p>
            </div>
            <button
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
              onClick={() => toast.info('Función disponible con Gmail conectado')}
            >
              <ExternalLink className="h-3 w-3" />
              Ver en Gmail
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DemoStockPage() {
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)

  // CI state
  const [ciCategory, setCiCategory]   = useState<string>('toxin')
  const [searching, setSearching]     = useState(false)
  const [results, setResults]         = useState<CIProvider[] | null>(null)
  const [sentIds, setSentIds]         = useState<Set<string>>(new Set())

  // Sort: critical first, then warn, then ok; within each group by days asc
  const sorted = [...DEMO_STOCK].sort((a, b) => {
    const order = { critical: 0, warn: 1, ok: 2 }
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status]
    return daysRemaining(a) - daysRemaining(b)
  })

  function handleSearch() {
    setSearching(true)
    setResults(null)
    setTimeout(() => {
      setSearching(false)
      setResults(DEMO_CI_PROVIDERS[ciCategory] ?? [])
    }, 2000)
  }

  function handleSend(provider: CIProvider) {
    toast.success(`Presupuesto solicitado a ${provider.empresa}`, {
      description: `Email enviado a ${provider.email} vía Gmail ✓`,
    })
    setSentIds(prev => new Set([...prev, provider.id]))
  }

  return (
    <div className="p-7 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            Gestión de insumos
          </p>
          <h1 className="text-4xl leading-none tracking-tight mt-1" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
            Stock <em>& reposición.</em>
          </h1>
        </div>
        <Button className="rounded-lg font-medium" style={{ background: 'var(--terracota)', color: 'white' }} disabled>
          <Package className="mr-2 h-4 w-4" />
          Agregar insumo
        </Button>
      </div>

      {/* KPI strip */}
      <StockKpis />

      {/* Inventory table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
            Inventario <em>actual</em>
          </CardTitle>
          <p className="text-xs" style={{ color: 'var(--ink-4)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, letterSpacing: '0.08em' }}>
            Hacé click en un producto para ver su ficha completa
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column headers */}
          <div className="grid px-6 py-2.5 border-b border-border" style={{ gridTemplateColumns: '8px 1fr 80px 80px 80px 90px' }}>
            {['', 'Insumo', 'Stock', 'Uso/mes', 'Días', 'Estado'].map((h, i) => (
              <span
                key={i}
                className={i > 1 ? 'text-right' : ''}
                style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-4)' }}
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
                <button
                  key={item.id}
                  className="grid items-center px-6 py-3.5 w-full text-left transition-colors hover:bg-muted/40"
                  style={{ gridTemplateColumns: '8px 1fr 80px 80px 80px 90px' }}
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Status dot */}
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.dot }} />

                  {/* Name + category */}
                  <div className="min-w-0 pr-4">
                    <p className="leading-tight truncate" style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 16 }}>
                      {item.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'var(--ink-4)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                      {item.marca} · {CATEGORY_LABELS[item.category] ?? item.category}
                    </p>
                  </div>

                  {/* Stock */}
                  <div className="text-right">
                    <span style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22 }}>{item.stock}</span>
                    <span className="block" style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'var(--ink-4)', letterSpacing: '0.08em' }}>{item.unit}</span>
                  </div>

                  {/* Monthly usage */}
                  <div className="text-right">
                    <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 13, color: 'var(--ink-3)' }}>{item.monthlyUsage}</span>
                    <span className="block" style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'var(--ink-4)', letterSpacing: '0.08em' }}>/ mes</span>
                  </div>

                  {/* Days remaining */}
                  <div className="text-right">
                    <span style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22, color: cfg.color }}>{days}</span>
                    <span className="block" style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: 'var(--ink-4)', letterSpacing: '0.08em' }}>días</span>
                  </div>

                  {/* Status badge */}
                  <div className="text-right">
                    {needsOrder ? (
                      <span
                        className="inline-block rounded-full px-2.5 py-1"
                        style={{ background: cfg.tint, color: cfg.color, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                      >
                        {cfg.label}
                      </span>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, color: 'var(--ink-4)', letterSpacing: '0.08em' }}>OK</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Competitive Intelligence ── */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{
          background: 'linear-gradient(160deg, var(--ink) 0%, var(--ink-2) 100%)',
          border: '1px solid rgba(181,112,79,0.3)',
        }}
      >
        {/* CI Header */}
        <div>
          <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
            Inteligencia competitiva
          </p>
          <h2 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 28, color: 'var(--paper)', lineHeight: 1.1, marginTop: 4 }}>
            Buscar <em>proveedores.</em>
          </h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
            La IA busca proveedores disponibles y envía solicitudes de presupuesto por Gmail automáticamente.
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="relative">
              <select
                value={ciCategory}
                onChange={e => { setCiCategory(e.target.value); setResults(null) }}
                className="w-full appearance-none rounded-xl px-4 py-3 text-sm font-medium outline-none"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--paper)',
                  fontFamily: 'var(--font-instrument-serif)',
                  fontSize: 16,
                }}
              >
                {CI_CATEGORIES.map(c => (
                  <option key={c.key} value={c.key} style={{ background: '#1f1a14', color: '#fbf8f2' }}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.4)' }} />
            </div>
          </div>
          <Button
            onClick={handleSearch}
            disabled={searching}
            className="rounded-xl px-5 font-medium shrink-0"
            style={{ background: 'var(--terracota)', color: 'white' }}
          >
            {searching
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Buscando...</>
              : <><Sparkles className="mr-2 h-4 w-4" />Buscar con IA</>
            }
          </Button>
        </div>

        {/* Loading shimmer */}
        {searching && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl h-28 animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
            ))}
          </div>
        )}

        {/* Provider results */}
        {results && results.length > 0 && (
          <div className="space-y-3">
            <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
              {results.length} proveedores encontrados — ordenados por precio
            </p>
            {[...results].sort((a, b) => a.precio - b.precio).map(p => (
              <ProviderCard key={p.id} provider={p} sentIds={sentIds} onSend={handleSend} />
            ))}
          </div>
        )}

        {/* Quote responses */}
        {(results !== null || sentIds.size > 0) && (
          <div
            className="space-y-3 pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between">
              <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                Respuestas recibidas ({DEMO_QUOTE_RESPONSES.length})
              </p>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                style={{ background: 'rgba(34,197,94,0.15)', color: 'rgb(134,239,172)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Via Gmail
              </span>
            </div>
            {DEMO_QUOTE_RESPONSES.map(qr => (
              <QuoteResponseCard key={qr.id} qr={qr} />
            ))}
          </div>
        )}

        {results?.length === 0 && (
          <p className="text-sm text-center py-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Sin proveedores encontrados para esta categoría.
          </p>
        )}
      </div>

      {/* Product detail drawer */}
      {selectedItem && (
        <ProductDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  )
}
