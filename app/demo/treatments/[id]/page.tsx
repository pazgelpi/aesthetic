'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { use, useState } from 'react'
import { DEMO_TREATMENTS, DEMO_PATIENTS, DEMO_PHOTO_SESSIONS, DEMO_COMPARISONS } from '@/lib/demo/data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import {
  Camera, Calendar, HardDrive, Package, Layers, StickyNote,
  CalendarCheck, CheckCircle2, ExternalLink, Globe,
} from 'lucide-react'
import { toast } from 'sonner'

export default function DemoTreatmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const treatment = DEMO_TREATMENTS.find(t => t.id === id)
  if (!treatment) notFound()

  const patient = DEMO_PATIENTS.find(p => p.id === treatment.patient_id)
  const photos = DEMO_PHOTO_SESSIONS[id as keyof typeof DEMO_PHOTO_SESSIONS]
  const comparison = DEMO_COMPARISONS[id as keyof typeof DEMO_COMPARISONS] ?? null

  const [calSynced] = useState(!!treatment.google_calendar_event_id)
  const [driveSynced, setDriveSynced] = useState(false)

  const typeLabel = treatment.treatment_type === 'toxin' ? 'Toxina Botulínica' : 'Filler Facial'

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

      {/* Google Actions — DC-109 Calendar mock */}
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
          <Button variant="outline" size="sm" onClick={() => toast.success('Eventos creados en Google Calendar ✓', { description: 'Tratamiento + recordatorio de retratamiento agregados' })}>
            <Calendar className="mr-2 h-4 w-4" />
            Agregar a Calendar
          </Button>
        )}
        {photos && (
          <Button
            variant="outline"
            size="sm"
            disabled={driveSynced}
            onClick={() => { setDriveSynced(true); toast.success('Fotos exportadas a Google Drive ✓', { description: 'Carpeta: Aesthetic IQ / Sofía Ramírez' }) }}
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

      {/* Tabs */}
      <Tabs defaultValue="photos">
        <TabsList>
          <TabsTrigger value="photos">Fotos ({photos ? Object.values(photos).filter(Boolean).length : 0})</TabsTrigger>
          <TabsTrigger value="comparison" disabled={!comparison}>
            Comparativa{comparison ? '' : ' (pendiente)'}
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
          {comparison && (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Síntesis para la paciente</CardTitle></CardHeader>
                <CardContent><p className="text-sm leading-relaxed">{comparison.ai_synthesis_patient}</p></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Síntesis clínica</CardTitle></CardHeader>
                <CardContent><p className="text-sm leading-relaxed">{comparison.ai_synthesis_clinic}</p></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Métricas objetivas</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { key: 'glabela_change_pct', label: 'Glabela' },
                      { key: 'frontal_change_pct', label: 'Frontal' },
                      { key: 'patas_gallo_left_change_pct', label: 'Patas de gallo izq.' },
                      { key: 'patas_gallo_right_change_pct', label: 'Patas de gallo der.' },
                    ].map(({ key, label }) => {
                      const val = (comparison.metrics_json as Record<string, number>)[key]
                      if (val == null) return null
                      const improved = val < 0
                      return (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <Badge variant={improved ? 'default' : 'secondary'} className="text-xs">
                            {improved ? '↓' : '↑'} {Math.abs(Math.round(val))}% {improved ? 'mejora' : 'cambio'}
                          </Badge>
                        </div>
                      )
                    })}
                    {(comparison.metrics_json as Record<string, number>).symmetry_change != null && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Simetría</span>
                          <Badge variant="outline" className="text-xs">
                            +{Math.round((comparison.metrics_json as Record<string, number>).symmetry_change * 100) / 100} pts
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
