'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { use, useState } from 'react'
import { DEMO_PATIENTS, DEMO_TREATMENTS, DEMO_PHOTO_SESSIONS, DEMO_COMPARISONS, DEMO_MESSAGES } from '@/lib/demo/data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Camera, ExternalLink, Globe, MessageSquare, Syringe, CalendarCheck, Sparkles, Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

const TEMPLATES = [
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

export default function DemoPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const patient = DEMO_PATIENTS.find(p => p.id === id)
  if (!patient) notFound()

  const treatment = DEMO_TREATMENTS.find(t => t.patient_id === id) ?? null
  const photos = treatment ? DEMO_PHOTO_SESSIONS[treatment.id as keyof typeof DEMO_PHOTO_SESSIONS] : null
  const comparison = treatment ? DEMO_COMPARISONS[treatment.id as keyof typeof DEMO_COMPARISONS] ?? null : null
  const messages = DEMO_MESSAGES

  const typeLabel = treatment?.treatment_type === 'toxin' ? 'Toxina Botulínica' : 'Filler Facial'

  // WhatsApp generation state
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].key)
  const [generating, setGenerating] = useState(false)
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null)
  const [messageSent, setMessageSent] = useState(false)

  function handleGenerate() {
    setGenerating(true)
    setGeneratedMessage(null)
    setMessageSent(false)
    setTimeout(() => {
      const tpl = TEMPLATES.find(t => t.key === selectedTemplate)!
      setGeneratedMessage(tpl.message(patient!.first_name))
      setGenerating(false)
    }, 2000)
  }

  function handleSend() {
    setMessageSent(true)
    toast.success(`Mensaje enviado a ${patient!.first_name} ✓`, {
      description: 'Aparecerá en el historial de seguimiento.',
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/demo/patients" className="hover:underline">Pacientes</Link>
            <span>/</span>
            <span>{patient.full_name}</span>
          </div>
          <h1 className="text-2xl font-bold">{patient.full_name}</h1>
          <p className="text-muted-foreground text-sm">{patient.phone_e164}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/demo/portal">
            <Button variant="outline" size="sm">
              <Globe className="mr-2 h-4 w-4" />
              Ver portal del paciente
            </Button>
          </Link>
        </div>
      </div>

      {/* Treatment summary */}
      {treatment && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Syringe className="h-4 w-4" />
                Último tratamiento — {typeLabel}
              </CardTitle>
              <Link href={`/demo/treatments/${treatment.id}`}>
                <Button variant="outline" size="sm">Ver detalle →</Button>
              </Link>
            </div>
            <CardDescription>{formatDate(treatment.treated_at)}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Producto</p>
              <p className="text-sm font-medium">{treatment.product_brand}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Áreas</p>
              <p className="text-sm font-medium">{treatment.areas_treated.join(', ')}</p>
            </div>
            {treatment.units_total && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Unidades</p>
                <p className="text-sm font-medium">{treatment.units_total} U</p>
              </div>
            )}
          </CardContent>
          {/* Calendar mock */}
          {treatment.google_calendar_event_id && (
            <div className="mx-6 mb-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
              <CalendarCheck className="h-4 w-4 text-green-600 shrink-0" />
              <span className="text-xs font-medium text-green-700">Sincronizado con tu Google Calendar · retratamiento agendado</span>
              <Button variant="outline" size="sm" className="ml-auto text-xs h-7 border-green-300 text-green-700 hover:bg-green-100" disabled>
                Ver en Calendar <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Photos */}
      {photos && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Fotos del tratamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(['pre', 'post'] as const).filter(type => photos[type]).map(type => (
              <div key={type}>
                <p className="text-sm font-medium mb-2 capitalize">{type === 'pre' ? 'Pre-tratamiento' : 'Post-tratamiento'}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[photos[type]?.photo_front_url, photos[type]?.photo_45_url, photos[type]?.photo_contracted_url].map((url, i) =>
                    url ? (
                      <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                        <img src={url} alt={`${type} ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div key={i} className="aspect-[3/4] rounded-lg bg-muted flex items-center justify-center">
                        <Camera className="h-5 w-5 text-muted-foreground/40" />
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Comparison */}
      {comparison && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Análisis IA — Síntesis clínica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{comparison.ai_synthesis_clinic}</p>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp — generation + thread — DC-105 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              Seguimiento por WhatsApp
            </CardTitle>
            <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
              {messages.length} mensajes enviados
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Generados con tu voz · enviados automáticamente · en los días clave
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Message generator */}
          <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <p className="text-sm font-medium">Generar nuevo mensaje</p>
            </div>

            {/* Template chips */}
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.key}
                  onClick={() => { setSelectedTemplate(t.key); setGeneratedMessage(null); setMessageSent(false) }}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    selectedTemplate === t.key
                      ? 'bg-violet-100 border-violet-300 text-violet-700'
                      : 'bg-background border-border text-muted-foreground hover:border-violet-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <Button size="sm" onClick={handleGenerate} disabled={generating} className="w-full">
              {generating
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Escribiendo en tu voz...</>
                : <><Sparkles className="mr-2 h-4 w-4" />Generar con IA</>
              }
            </Button>

            {/* Generated message preview */}
            {generatedMessage && (
              <div className="space-y-2">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-3 py-2 text-xs leading-relaxed shadow-sm" style={{ background: '#DCF8C6', color: '#111' }}>
                    {generatedMessage}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <Badge className="text-[10px] bg-violet-100 text-violet-700 border-violet-200">
                      <Sparkles className="mr-1 h-2.5 w-2.5" />
                      En tu voz
                    </Badge>
                    {!messageSent && (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        Pendiente de envío
                      </Badge>
                    )}
                    {messageSent && (
                      <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200">
                        ✓✓ Enviado
                      </Badge>
                    )}
                  </div>
                  {!messageSent && (
                    <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50" onClick={handleSend}>
                      <Send className="mr-1.5 h-3 w-3" />
                      Enviar por WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp thread */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
            {/* WA header bar */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#075E54' }}>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">{patient.first_name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white">{patient.full_name}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.65)' }}>historial de mensajes</p>
              </div>
              <MessageSquare className="h-4 w-4 text-white/60" />
            </div>
            {/* Messages feed */}
            <div className="p-4 space-y-4" style={{ background: '#ECE5DD' }}>
              {messages.map(msg => {
                const templateLabels: Record<string, string> = {
                  day0_welcome: 'Día 0 — Bienvenida',
                  day3_check: 'Día 3 — Control',
                  day14_photo_request: 'Día 14 — Solicitud de foto',
                }
                return (
                  <div key={msg.id} className="space-y-1.5">
                    <div className="flex justify-center">
                      <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.5)' }}>
                        {templateLabels[msg.template_type] ?? msg.template_type} · {formatDate(msg.scheduled_for)}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-tr-sm px-3 py-2 text-xs leading-relaxed shadow-sm" style={{ background: '#DCF8C6', color: '#111' }}>
                        {msg.generated_message}
                        <span className="block text-[9px] text-right mt-1" style={{ color: 'rgba(0,0,0,0.4)' }}>✓✓</span>
                      </div>
                    </div>
                    {msg.patient_response && (
                      <div className="flex justify-start">
                        <div className="max-w-[75%] rounded-2xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed shadow-sm" style={{ background: '#fff', color: '#111' }}>
                          {msg.patient_response}
                          <span className="block text-[9px] text-right mt-1" style={{ color: 'rgba(0,0,0,0.35)' }}>leído</span>
                        </div>
                      </div>
                    )}
                    {!msg.patient_response && (
                      <div className="flex justify-start">
                        <span className="text-[10px] italic" style={{ color: 'rgba(0,0,0,0.4)' }}>sin respuesta aún</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
