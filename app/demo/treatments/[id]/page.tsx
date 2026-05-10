'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { use, useState, useRef, useCallback } from 'react'
import { DEMO_TREATMENTS, DEMO_PATIENTS, DEMO_PHOTO_SESSIONS, DEMO_COMPARISONS } from '@/lib/demo/data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import {
  Camera, Calendar, HardDrive, Package, Layers, StickyNote,
  CalendarCheck, CheckCircle2, ExternalLink, Globe, Loader2,
  Sparkles, Brain,
} from 'lucide-react'
import { toast } from 'sonner'

export default function DemoTreatmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const treatment = DEMO_TREATMENTS.find(t => t.id === id)
  if (!treatment) notFound()

  const patient = DEMO_PATIENTS.find(p => p.id === treatment.patient_id)
  const photos = DEMO_PHOTO_SESSIONS[id as keyof typeof DEMO_PHOTO_SESSIONS]
  const comparison = DEMO_COMPARISONS[id as keyof typeof DEMO_COMPARISONS] ?? null

  const [calSynced, setCalSynced] = useState(!!treatment.google_calendar_event_id)
  const [calLoading, setCalLoading] = useState(false)
  const [calEvents, setCalEvents] = useState(!!treatment.google_calendar_event_id)
  const [driveSynced, setDriveSynced] = useState(false)

  // AI generation simulation
  const [generating, setGenerating] = useState(false)
  const [generatingPhase, setGeneratingPhase] = useState(0)
  const [showComparison, setShowComparison] = useState(!!comparison)

  // Pre/Post slider
  const [sliderPos, setSliderPos] = useState(56)
  const [photoAngle, setPhotoAngle] = useState(0) // 0=Frontal, 1=45°, 2=Contracción
  const sliderRef = useRef<HTMLDivElement>(null)
  const handleSliderMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100))
    setSliderPos(pct)
  }, [])

  const typeLabel = treatment.treatment_type === 'toxin' ? 'Toxina Botulínica' : 'Filler Facial'

  const retratamientoDate = treatment.expected_re_treatment_at
    ? new Date(new Date(treatment.expected_re_treatment_at).getTime() - 7 * 24 * 60 * 60 * 1000)
    : null

  function handleAddCalendar() {
    setCalLoading(true)
    setTimeout(() => {
      setCalLoading(false)
      setCalSynced(true)
      setCalEvents(true)
    }, 1500)
  }

  const generatingPhases = [
    'Analizando landmarks faciales...',
    'Computando métricas por zona...',
    'Generando síntesis con IA...',
  ]

  function handleGenerateComparison() {
    setGenerating(true)
    setGeneratingPhase(0)
    setTimeout(() => setGeneratingPhase(1), 800)
    setTimeout(() => setGeneratingPhase(2), 1600)
    setTimeout(() => {
      setGenerating(false)
      setShowComparison(true)
    }, 2500)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/demo/treatments" className="hover:underline">Tratamientos</Link>
            <span>/</span>
            <span>{patient?.full_name}</span>
          </div>
          <h1 className="text-2xl font-bold">{typeLabel}</h1>
          <p className="text-muted-foreground">{formatDate(treatment.treated_at)} · {patient?.full_name}</p>
        </div>
        <Badge variant={treatment.treatment_type === 'toxin' ? 'default' : 'secondary'}>{typeLabel}</Badge>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {treatment.product_brand && (
          <Card><CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1"><Package className="h-4 w-4" /><span className="text-xs">Producto</span></div>
            <p className="font-medium text-sm">{treatment.product_brand}</p>
          </CardContent></Card>
        )}
        {treatment.units_total && (
          <Card><CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1"><Layers className="h-4 w-4" /><span className="text-xs">Unidades</span></div>
            <p className="font-medium text-sm">{treatment.units_total} U</p>
          </CardContent></Card>
        )}
        <Card><CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Layers className="h-4 w-4" /><span className="text-xs">Áreas</span></div>
          <p className="font-medium text-sm">{treatment.areas_treated.join(', ')}</p>
        </CardContent></Card>
        {treatment.expected_re_treatment_at && (
          <Card><CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1"><Calendar className="h-4 w-4" /><span className="text-xs">Próximo</span></div>
            <p className="font-medium text-sm">{formatDate(treatment.expected_re_treatment_at)}</p>
          </CardContent></Card>
        )}
      </div>

      {treatment.notes && (
        <Card><CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><StickyNote className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide">Notas clínicas</span></div>
          <p className="text-sm">{treatment.notes}</p>
        </CardContent></Card>
      )}

      {/* Google Calendar — DC-109 */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {calSynced ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
              <CalendarCheck className="h-4 w-4 text-green-600 shrink-0" />
              <span className="text-xs font-medium text-green-700">Sincronizado con Google Calendar</span>
              <Button variant="outline" size="sm" className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-100" disabled>
                Ver evento <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleAddCalendar} disabled={calLoading}>
              {calLoading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sincronizando...</>
                : <><Calendar className="mr-2 h-4 w-4" />Agregar a Calendar</>
              }
            </Button>
          )}
          {photos && (
            <Button
              variant="outline"
              size="sm"
              disabled={driveSynced}
              onClick={() => { setDriveSynced(true); toast.success('Fotos exportadas a Google Drive ✓', { description: `Carpeta: Aesthetic IQ / ${patient?.full_name}` }) }}
            >
              {driveSynced
                ? <><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />En Drive</>
                : <><HardDrive className="mr-2 h-4 w-4" />Exportar fotos a Drive</>
              }
            </Button>
          )}
          <Link href="/demo/portal">
            <Button variant="outline" size="sm">
              <Globe className="mr-2 h-4 w-4" />
              Ver portal del paciente
            </Button>
          </Link>
        </div>

        {/* Calendar events expanded view */}
        {calEvents && treatment.expected_re_treatment_at && (
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Eventos creados en Google Calendar</p>
            <div className="space-y-2">
              {/* Event 1 — treatment */}
              <div className="flex items-center gap-3 rounded-xl bg-violet-50 border border-violet-100 px-4 py-3">
                <div className="w-3 h-3 rounded-full bg-violet-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{typeLabel} · {patient?.first_name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(treatment.treated_at)} · 1 hora</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-violet-600" disabled>
                  Ver <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
              {/* Event 2 — retreatment reminder */}
              {retratamientoDate && (
                <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                  <div className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Retratamiento · {patient?.first_name} (recordatorio)</p>
                    <p className="text-xs text-muted-foreground">{formatDate(retratamientoDate.toISOString())} · recordatorio 7 días antes</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-600" disabled>
                    Ver <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="photos">
        <TabsList>
          <TabsTrigger value="photos">Fotos ({photos ? Object.values(photos).filter(Boolean).length : 0})</TabsTrigger>
          <TabsTrigger value="comparison">
            Comparativa IA{comparison || showComparison ? '' : ' (pendiente)'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-4 pt-4">
          {photos && (['pre', 'post'] as const).filter(type => photos[type]).map(type => (
            <Card key={type}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{type === 'pre' ? 'Pre-tratamiento' : 'Post-tratamiento'}</CardTitle>
                <CardDescription>{formatDate(treatment.treated_at)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[photos[type]?.photo_front_url, photos[type]?.photo_45_url, photos[type]?.photo_contracted_url].map((url, i) =>
                    url ? (
                      <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                        <img src={url} alt={`photo ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div key={i} className="aspect-[3/4] rounded-lg bg-muted flex items-center justify-center">
                        <Camera className="h-5 w-5 text-muted-foreground/40" />
                      </div>
                    )
                  )}
                  <div className="col-span-3 flex justify-between text-xs text-muted-foreground">
                    <span>Frontal</span><span>45°</span><span>Contraída</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="comparison" className="pt-4">
          <div className="space-y-4">
            {/* Generate button */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {showComparison ? 'Análisis generado por IA sobre fotos pre y post.' : 'Generá el análisis comparativo con IA.'}
              </p>
              <Button
                size="sm"
                variant={showComparison ? 'outline' : 'default'}
                onClick={handleGenerateComparison}
                disabled={generating}
                className="shrink-0"
              >
                {generating
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{generatingPhases[generatingPhase]}</>
                  : showComparison
                  ? <><Sparkles className="mr-2 h-4 w-4" />Regenerar análisis IA</>
                  : <><Brain className="mr-2 h-4 w-4" />Generar comparativa IA</>
                }
              </Button>
            </div>

            {/* AI generation loading skeleton */}
            {generating && (
              <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-violet-600 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-violet-800">{generatingPhases[generatingPhase]}</p>
                    <div className="flex gap-1">
                      {generatingPhases.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all duration-500 ${i <= generatingPhase ? 'bg-violet-500 w-8' : 'bg-violet-200 w-4'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 bg-violet-100 rounded w-3/4" />
                  <div className="h-3 bg-violet-100 rounded w-full" />
                  <div className="h-3 bg-violet-100 rounded w-5/6" />
                </div>
              </div>
            )}

            {/* Comparison results — PrePost slider + metrics */}
            {!generating && showComparison && comparison && (
              <>
                {/* Draggable slider comparator */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid var(--hairline-strong)', background: 'var(--paper)' }}
                >
                  {/* Header */}
                  <div className="flex justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--hairline)' }}>
                    <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      Frontal · luz natural · misma hora del día
                    </span>
                    <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      Diferencia: 45 días
                    </span>
                  </div>

                  {/* Slider area */}
                  <div
                    ref={sliderRef}
                    className="relative overflow-hidden cursor-ew-resize select-none"
                    style={{ height: 360 }}
                    onMouseMove={handleSliderMove}
                  >
                    {/* PRE — tan/warm gradient */}
                    <div
                      className="absolute inset-0 flex items-end justify-center pb-3"
                      style={{ background: 'linear-gradient(135deg, #d9c4a8, #c8ad8a)' }}
                    >
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(31,26,20,0.55)', textTransform: 'uppercase' }}>
                        Pre — 25 Mar · Día 0
                      </span>
                    </div>

                    {/* POST (clipped to slider pos) — sage/green gradient */}
                    <div
                      className="absolute inset-0 flex items-end justify-center pb-3"
                      style={{
                        clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                        background: 'linear-gradient(135deg, #c8d4b0, #a8b88a)',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(31,26,20,0.55)', textTransform: 'uppercase' }}>
                        Post — 09 May · Día 45
                      </span>
                    </div>

                    {/* Handle line + circle */}
                    <div
                      className="absolute top-0 bottom-0 pointer-events-none"
                      style={{ left: `${sliderPos}%`, width: 2, background: 'var(--paper)', boxShadow: '0 0 0 1px var(--ink)' }}
                    >
                      <div
                        className="absolute flex items-center justify-center"
                        style={{
                          top: '50%', left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 36, height: 36,
                          borderRadius: '50%',
                          background: 'var(--paper)',
                          border: '1px solid var(--ink)',
                          fontSize: 14,
                          color: 'var(--ink)',
                        }}
                      >
                        ⇆
                      </div>
                    </div>

                    {/* Metric overlays */}
                    <div className="absolute" style={{ top: 50, left: '18%' }}>
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, letterSpacing: '0.12em', background: 'var(--paper)', padding: '2px 6px', display: 'inline-block', border: '1px solid var(--ink)', color: 'var(--ink-2)' }}>
                        GLABELA · −67%
                      </span>
                    </div>
                    <div className="absolute" style={{ top: 180, right: '14%' }}>
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, letterSpacing: '0.12em', background: 'var(--paper)', padding: '2px 6px', display: 'inline-block', border: '1px solid var(--ink)', color: 'var(--ink-2)' }}>
                        P. GALLO · −58%
                      </span>
                    </div>
                  </div>

                  {/* Footer: instruction + angle selector */}
                  <div className="flex justify-between items-center px-5 py-3.5" style={{ borderTop: '1px solid var(--hairline)' }}>
                    <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.10em' }}>
                      ← Arrastrá para comparar
                    </span>
                    <div className="flex gap-3.5">
                      {['Frontal', '45°', 'Contracción'].map((label, i) => (
                        <button
                          key={label}
                          onClick={() => setPhotoAngle(i)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            fontFamily: 'var(--font-jetbrains-mono)',
                            fontSize: 10.5,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: photoAngle === i ? 'var(--ink)' : 'var(--ink-3)',
                            borderBottom: photoAngle === i ? '1px solid var(--ink)' : '1px solid transparent',
                            padding: '2px 4px',
                            cursor: 'pointer',
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics + AI synthesis — 2 column grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Metrics table */}
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: 'var(--paper)', border: '1px solid var(--hairline-strong)' }}
                  >
                    <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10.5, letterSpacing: '0.12em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 14 }}>
                      Medición objetiva · MediaPipe
                    </p>
                    {[
                      { key: 'glabela_change_pct', label: 'Glabela', display: '−67%' },
                      { key: 'frontal_change_pct', label: 'Frontal', display: '−54%' },
                      { key: 'patas_gallo_left_change_pct', label: 'Patas de gallo L', display: '−61%' },
                      { key: 'patas_gallo_right_change_pct', label: 'Patas de gallo R', display: '−58%' },
                    ].map(({ key, label, display }, i) => {
                      const val = (comparison.metrics_json as Record<string, number>)[key]
                      const pct = val != null ? Math.min(95, Math.abs(val) * 1.3) : 75
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-4 py-3"
                          style={{ borderTop: i === 0 ? 'none' : '1px solid var(--hairline)' }}
                        >
                          <span className="flex-1 text-sm">{label}</span>
                          <div
                            className="rounded-full overflow-hidden"
                            style={{ width: 100, height: 5, background: 'var(--cream-2)' }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, background: 'var(--terracota)' }}
                            />
                          </div>
                          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 13, color: 'var(--ink)', minWidth: 40, textAlign: 'right' }}>
                            {display}
                          </span>
                        </div>
                      )
                    })}
                    {(comparison.metrics_json as Record<string, number>).symmetry_change != null && (
                      <div className="flex items-center gap-4 py-3" style={{ borderTop: '1px solid var(--hairline)' }}>
                        <span className="flex-1 text-sm">Simetría</span>
                        <div className="rounded-full overflow-hidden" style={{ width: 100, height: 5, background: 'var(--cream-2)' }}>
                          <div className="h-full rounded-full" style={{ width: '18%', background: 'var(--oliva)' }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 13, color: 'var(--ink)', minWidth: 40, textAlign: 'right' }}>+12%</span>
                      </div>
                    )}
                  </div>

                  {/* AI synthesis dark card */}
                  <div
                    className="rounded-2xl p-5 relative overflow-hidden"
                    style={{ background: 'var(--ink)', color: 'var(--paper)' }}
                  >
                    <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10.5, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 12 }}>
                      Síntesis IA · borrador editable
                    </p>
                    <p
                      style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', fontSize: 20, lineHeight: 1.35, letterSpacing: '-0.005em', color: 'var(--paper)' }}
                    >
                      &ldquo;{comparison.ai_synthesis_clinic || 'A 45 días, la zona del entrecejo muestra una suavización notable. La simetría facial mejoró un 12 %. Tu piel luce descansada — sin perder expresividad.'}&rdquo;
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="text-xs rounded-xl" style={{ background: 'var(--terracota)', color: 'white' }} disabled>
                        Aprobar y enviar
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs rounded-xl" style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.2)' }} disabled>
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Patient synthesis */}
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Síntesis para la paciente</CardTitle></CardHeader>
                  <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{comparison.ai_synthesis_patient}</p></CardContent>
                </Card>
              </>
            )}

            {!generating && !showComparison && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center space-y-2">
                <Brain className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="text-sm text-muted-foreground">Hacé click en "Generar comparativa IA" para analizar las fotos pre y post.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
