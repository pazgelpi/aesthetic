'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { use, useState } from 'react'
import {
  DEMO_PATIENTS, DEMO_TREATMENTS, DEMO_PHOTO_SESSIONS,
  DEMO_COMPARISONS, DEMO_MESSAGE_SCHEDULE,
} from '@/lib/demo/data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import {
  Camera, ExternalLink, Globe, MessageSquare, CalendarCheck,
  Sparkles, Loader2, Send, CheckCircle2, Clock, Package,
  Layers, Calendar, StickyNote, HardDrive, Brain,
} from 'lucide-react'
import { toast } from 'sonner'

// ─── WhatsApp message generator ───────────────────────────────────────────────

const WA_TEMPLATES = [
  {
    key: 'day0',
    label: 'Día 0 · Bienvenida',
    message: (name: string) =>
      `¡Hola ${name}! Que bueno haberte tenido hoy. Acordate de no acostarte las próximas 4hs y evitá ejercicio intenso. Estoy para cualquier consulta 💜`,
  },
  {
    key: 'day14',
    label: 'Día 14 · Foto',
    message: (name: string) =>
      `${name}, ¡ya pasaron 14 días! ¿Me mandás una foto frontal con buena luz? Así vemos juntas cómo está evolucionando 📸`,
  },
  {
    key: 'day30',
    label: 'Día 30 · Progreso',
    message: (name: string) =>
      `¿Cómo estás, ${name}? A 30 días es el momento ideal para revisar tu evolución. ¡Los resultados son muy buenos! ¿Coordinamos el próximo paso?`,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMonth(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })
}

const TYPE_LABEL: Record<string, string> = {
  toxin:           'Toxina Botulínica',
  filler:          'Ácido Hialurónico',
  peel:            'Peeling Químico',
  prp:             'PRP / Plasma',
  bioestimulation: 'Bioestimulación',
  mesotherapy:     'Mesoterapia',
  laser:           'Láser / IPL',
}
const TYPE_BADGE: Record<string, string> = {
  toxin:           'bg-violet-100 text-violet-700 border-violet-200',
  filler:          'bg-amber-100 text-amber-700 border-amber-200',
  peel:            'bg-orange-100 text-orange-700 border-orange-200',
  prp:             'bg-red-100 text-red-700 border-red-200',
  bioestimulation: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  mesotherapy:     'bg-sky-100 text-sky-700 border-sky-200',
  laser:           'bg-pink-100 text-pink-700 border-pink-200',
}
const TYPE_ABBR: Record<string, string> = {
  toxin:           'TOX',
  filler:          'FIL',
  peel:            'PEEL',
  prp:             'PRP',
  bioestimulation: 'BIO',
  mesotherapy:     'MESO',
  laser:           'LSR',
}

// ─── Message schedule timeline ────────────────────────────────────────────────

function MessageSchedule({ treatmentId, patientName }: { treatmentId: string; patientName: string }) {
  const schedule = DEMO_MESSAGE_SCHEDULE[treatmentId] ?? []
  const [selectedTemplate, setSelectedTemplate] = useState(WA_TEMPLATES[0].key)
  const [generating, setGenerating] = useState(false)
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null)
  const [messageSent, setMessageSent] = useState(false)

  function handleGenerate() {
    setGenerating(true)
    setGeneratedMessage(null)
    setMessageSent(false)
    setTimeout(() => {
      const tpl = WA_TEMPLATES.find(t => t.key === selectedTemplate)!
      setGeneratedMessage(tpl.message(patientName))
      setGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-5">
      {/* Message generator */}
      <Card className="border-emerald-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Generar nuevo mensaje
          </CardTitle>
          <CardDescription>Generado con la voz de tu clínica · listo para enviar por WhatsApp</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {WA_TEMPLATES.map(t => (
              <button
                key={t.key}
                onClick={() => { setSelectedTemplate(t.key); setGeneratedMessage(null); setMessageSent(false) }}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  selectedTemplate === t.key
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : 'bg-background border-border text-muted-foreground hover:border-emerald-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={handleGenerate} disabled={generating} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            {generating
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Escribiendo en tu voz...</>
              : <><Sparkles className="mr-2 h-4 w-4" />Generar con IA</>
            }
          </Button>
          {generatedMessage && (
            <div className="space-y-2">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-3 py-2.5 text-sm leading-relaxed shadow-sm" style={{ background: '#DCF8C6', color: '#111' }}>
                  {generatedMessage}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <Badge className="text-[10px] bg-violet-100 text-violet-700 border-violet-200">
                    <Sparkles className="mr-1 h-2.5 w-2.5" />En tu voz
                  </Badge>
                  {!messageSent
                    ? <Badge variant="outline" className="text-[10px] text-muted-foreground">Pendiente</Badge>
                    : <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200">✓✓ Enviado</Badge>
                  }
                </div>
                {!messageSent && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                    onClick={() => {
                      setMessageSent(true)
                      toast.success(`Mensaje enviado a ${patientName} ✓`, { description: 'Aparecerá en el historial.' })
                    }}
                  >
                    <Send className="mr-1.5 h-3 w-3" />Enviar
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule timeline */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Seguimiento automático — 5 mensajes programados
        </p>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-0">
            {schedule.map((msg, i) => {
              const isSent = msg.status === 'sent'
              const isLast = i === schedule.length - 1
              return (
                <div key={msg.id} className={`relative flex gap-4 ${!isLast ? 'pb-6' : ''}`}>
                  {/* Step icon */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                    isSent
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'bg-background border-dashed border-muted-foreground/40'
                  }`}>
                    {isSent
                      ? <CheckCircle2 className="h-4 w-4 text-white" />
                      : <Clock className="h-4 w-4 text-muted-foreground/50" />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1.5 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="text-sm font-semibold">{msg.label}</p>
                      <Badge variant="outline" className="text-[10px]">Día {msg.day}</Badge>
                      {isSent
                        ? <span className="text-[10px] text-emerald-600 font-medium">✓ Enviado · {formatDate(msg.scheduled_for)}</span>
                        : <span className="text-[10px] text-muted-foreground">Programado · {formatDate(msg.scheduled_for)}</span>
                      }
                    </div>

                    {isSent && msg.generated_message ? (
                      <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                        {/* WA mini chrome */}
                        <div className="px-3 py-1.5 flex items-center gap-2" style={{ background: '#075E54' }}>
                          <MessageSquare className="h-3 w-3 text-white/60" />
                          <span className="text-[10px] text-white/70">WhatsApp · {patientName}</span>
                        </div>
                        <div className="p-3 space-y-2" style={{ background: '#ECE5DD' }}>
                          {/* Outgoing bubble */}
                          <div className="flex justify-end">
                            <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-3 py-2 text-xs leading-relaxed shadow-sm" style={{ background: '#DCF8C6', color: '#111' }}>
                              {msg.generated_message}
                              <span className="block text-[9px] text-right mt-1" style={{ color: 'rgba(0,0,0,0.4)' }}>✓✓</span>
                            </div>
                          </div>
                          {/* Response bubble */}
                          {msg.patient_response && (
                            <div className="flex justify-start">
                              <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed shadow-sm" style={{ background: '#fff', color: '#111' }}>
                                {msg.patient_response}
                                <span className="block text-[9px] text-right mt-1" style={{ color: 'rgba(0,0,0,0.35)' }}>leído</span>
                              </div>
                            </div>
                          )}
                          {!msg.patient_response && (
                            <p className="text-[10px] italic pl-1" style={{ color: 'rgba(0,0,0,0.4)' }}>sin respuesta aún</p>
                          )}
                        </div>
                      </div>
                    ) : !isSent ? (
                      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3">
                        <p className="text-xs text-muted-foreground">
                          El mensaje se generará automáticamente con la voz de tu clínica el{' '}
                          <span className="font-medium text-foreground">{formatDate(msg.scheduled_for)}</span>
                          {' '}y se enviará por WhatsApp sin acción manual.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Treatment tab content ────────────────────────────────────────────────────

function TreatmentTabContent({
  treatment,
  patient,
}: {
  treatment: typeof DEMO_TREATMENTS[0]
  patient: typeof DEMO_PATIENTS[0]
}) {
  const photos = DEMO_PHOTO_SESSIONS[treatment.id as keyof typeof DEMO_PHOTO_SESSIONS]
  const comparison = DEMO_COMPARISONS[treatment.id as keyof typeof DEMO_COMPARISONS] ?? null

  const [calSynced, setCalSynced] = useState(!!treatment.google_calendar_event_id)
  const [calLoading, setCalLoading] = useState(false)
  const [driveSynced, setDriveSynced] = useState(false)

  const typeLabel = TYPE_LABEL[treatment.treatment_type] ?? treatment.treatment_type

  function handleAddCalendar() {
    setCalLoading(true)
    setTimeout(() => { setCalLoading(false); setCalSynced(true) }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Detail cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
          <p className="font-medium text-sm text-wrap">{treatment.areas_treated.join(', ')}</p>
        </CardContent></Card>
        {treatment.expected_re_treatment_at && (
          <Card><CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1"><Calendar className="h-4 w-4" /><span className="text-xs">Próximo</span></div>
            <p className="font-medium text-sm">{formatDate(treatment.expected_re_treatment_at)}</p>
          </CardContent></Card>
        )}
      </div>

      {/* Notes */}
      {treatment.notes && (
        <Card><CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><StickyNote className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide">Notas clínicas</span></div>
          <p className="text-sm">{treatment.notes}</p>
        </CardContent></Card>
      )}

      {/* Google actions */}
      <div className="flex flex-wrap gap-2">
        {calSynced ? (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            <CalendarCheck className="h-4 w-4 text-green-600 shrink-0" />
            <span className="text-xs font-medium text-green-700">En Google Calendar</span>
            <Button variant="outline" size="sm" className="h-6 text-[10px] border-green-300 text-green-700" disabled>
              Ver <ExternalLink className="ml-1 h-3 w-3" />
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
            onClick={() => { setDriveSynced(true); toast.success('Fotos exportadas a Google Drive ✓', { description: `Carpeta: Aesthetic IQ / ${patient.full_name}` }) }}
          >
            {driveSynced
              ? <><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />En Drive</>
              : <><HardDrive className="mr-2 h-4 w-4" />Exportar fotos a Drive</>
            }
          </Button>
        )}
        <Link href={`/demo/treatments/${treatment.id}`}>
          <Button variant="outline" size="sm">
            Ver detalle completo →
          </Button>
        </Link>
      </div>

      {/* Photos */}
      {photos && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Fotos</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {(['pre', 'post'] as const).filter(type => photos[type]).map(type => (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{type === 'pre' ? 'Pre-tratamiento' : 'Post-tratamiento'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {[photos[type]?.photo_front_url, photos[type]?.photo_45_url, photos[type]?.photo_contracted_url].map((url, i) =>
                      url ? (
                        <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                          <img src={url} alt={`${type} ${i}`} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div key={i} className="aspect-[3/4] rounded-lg bg-muted flex items-center justify-center">
                          <Camera className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-0.5">
                    <span>Frontal</span><span>45°</span><span>Contraída</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* AI Comparison */}
      {comparison && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            <Brain className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
            Análisis IA
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Síntesis para la paciente</CardTitle></CardHeader>
              <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{comparison.ai_synthesis_patient}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Síntesis clínica</CardTitle></CardHeader>
              <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{comparison.ai_synthesis_clinic}</p></CardContent>
            </Card>
          </div>
        </div>
      )}

      <Separator />

      {/* Message schedule */}
      <MessageSchedule treatmentId={treatment.id} patientName={patient.first_name} />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DemoPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const patient = DEMO_PATIENTS.find(p => p.id === id)
  if (!patient) notFound()

  const treatments = DEMO_TREATMENTS
    .filter(t => t.patient_id === id)
    .sort((a, b) => new Date(b.treated_at).getTime() - new Date(a.treated_at).getTime())

  const [activeTreatmentId, setActiveTreatmentId] = useState(treatments[0]?.id ?? '')

  const activeTreatment = treatments.find(t => t.id === activeTreatmentId) ?? treatments[0]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/demo/patients" className="hover:underline">Pacientes</Link>
            <span>/</span>
            <span>{patient.full_name}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{patient.full_name}</h1>
            {patient.isVip && (
              <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200">⭐ VIP</Badge>
            )}
            <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
              <MessageSquare className="mr-1 h-3 w-3" />
              WhatsApp activo
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">{patient.phone_e164}</p>
        </div>
        <Link href="/demo/portal">
          <Button variant="outline" size="sm">
            <Globe className="mr-2 h-4 w-4" />
            Ver portal
          </Button>
        </Link>
      </div>

      {/* Treatment tabs */}
      {treatments.length > 0 ? (
        <div className="space-y-0">
          {/* Tab bar */}
          <div className="flex gap-1 border-b border-border pb-0">
            {treatments.map(t => {
              const isActive = t.id === activeTreatmentId
              const badgeClass = TYPE_BADGE[t.treatment_type]
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTreatmentId(t.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    isActive
                      ? 'border-[var(--primary)] text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${badgeClass}`}>
                    {TYPE_ABBR[t.treatment_type] ?? t.treatment_type.toUpperCase().slice(0, 4)}
                  </span>
                  <span>{TYPE_LABEL[t.treatment_type]}</span>
                  <span className="text-muted-foreground font-normal">· {formatMonth(t.treated_at)}</span>
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="pt-6">
            {activeTreatment && (
              <TreatmentTabContent treatment={activeTreatment} patient={patient} />
            )}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground text-sm">
            Sin tratamientos registrados.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
