'use client'

import { useRef, useState } from 'react'
import { DEMO_PATIENTS, DEMO_TREATMENTS, DEMO_COMPARISONS, DEMO_STORY, DEMO_CLINIC } from '@/lib/demo/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { Calendar, MessageCircle, Clock, CheckCircle2, Download, Camera, Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'

const PHOTO_SLOTS = [
  { key: 'front', label: 'Frontal' },
  { key: '45', label: '45°' },
  { key: 'contracted', label: 'Contraída' },
] as const

export default function DemoPortalPage() {
  const patient = DEMO_PATIENTS[0] // Sofía
  const treatment = DEMO_TREATMENTS[0]
  const comparison = DEMO_COMPARISONS['demo-t1']
  const story = DEMO_STORY

  const nextAppointment = new Date(treatment.expected_re_treatment_at!)
  const daysUntil = Math.round((nextAppointment.getTime() - Date.now()) / 864e5)

  // Photo capture state
  const [photos, setPhotos] = useState<Partial<Record<'front' | '45' | 'contracted', string>>>({})
  const [uploading, setUploading] = useState(false)
  const [photosSent, setPhotosSent] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeSlot, setActiveSlot] = useState<'front' | '45' | 'contracted' | null>(null)

  const allSlotsFilled = PHOTO_SLOTS.every(s => photos[s.key])

  function handleSlotClick(key: 'front' | '45' | 'contracted') {
    if (photosSent) return
    setActiveSlot(key)
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !activeSlot) return
    const url = URL.createObjectURL(file)
    setPhotos(prev => ({ ...prev, [activeSlot]: url }))
    setActiveSlot(null)
    e.target.value = ''
  }

  function handleSendPhotos() {
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setPhotosSent(true)
      toast.success('Fotos recibidas ✓', {
        description: 'La Dra. Ruiz las revisará en las próximas 24hs.',
      })
    }, 2000)
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-5">
      {/* Portal header */}
      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{DEMO_CLINIC.name}</p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
          Hola, {patient.first_name} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Tu espacio de seguimiento post-tratamiento</p>
      </div>

      {/* Mi próximo turno — DC-111 */}
      <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-violet-700">
            <Calendar className="h-4 w-4" />
            Mi próximo turno
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-2xl font-bold tracking-tight">{formatDate(treatment.expected_re_treatment_at!)}</p>
            <p className="text-sm text-muted-foreground">Retratamiento · {treatment.treatment_type === 'toxin' ? 'Toxina Botulínica' : 'Filler'}</p>
          </div>
          {daysUntil > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-violet-500" />
              <span className="text-xs text-violet-700 font-medium">En {daysUntil} días</span>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="flex-1 rounded-xl" disabled>
              Confirmar turno
            </Button>
            <Button variant="outline" size="sm" className="flex-1 rounded-xl" disabled>
              Reagendar
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" disabled>
            <MessageCircle className="mr-2 h-3.5 w-3.5" />
            Hablar con la doctora
          </Button>
        </CardContent>
      </Card>

      {/* Photo capture card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Subir fotos de seguimiento
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {photosSent
              ? 'La doctora recibió tus fotos. Te contactará pronto.'
              : 'Sacate una foto en cada ángulo con buena luz natural.'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Photo slots */}
          <div className="grid grid-cols-3 gap-2">
            {PHOTO_SLOTS.map(({ key, label }) => {
              const preview = photos[key]
              const sent = photosSent
              return (
                <button
                  key={key}
                  onClick={() => handleSlotClick(key)}
                  disabled={sent || uploading}
                  className="aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all relative focus:outline-none"
                  style={{
                    borderColor: sent ? '#22c55e' : preview ? 'oklch(0.55 0.18 290)' : 'var(--border)',
                    background: preview ? 'transparent' : 'var(--muted)',
                  }}
                >
                  {sent ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                  ) : preview ? (
                    <img src={preview} alt={label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <Camera className="h-5 w-5 text-muted-foreground/50" />
                      <span className="text-[10px] text-muted-foreground">{label}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground px-1">
            <span>Frontal</span><span>45°</span><span>Contraída</span>
          </div>

          {/* Send button */}
          {!photosSent && (
            <Button
              className="w-full rounded-xl"
              size="sm"
              disabled={!allSlotsFilled || uploading}
              onClick={handleSendPhotos}
            >
              {uploading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando fotos...</>
                : <><Upload className="mr-2 h-4 w-4" />Enviar fotos a la doctora</>
              }
            </Button>
          )}

          {photosSent && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Fotos enviadas correctamente
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mi Informe de Evolución — DC-112 */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{ background: 'linear-gradient(160deg, #18142a 0%, #2d1b4e 100%)', border: '1px solid rgba(124,58,237,0.3)' }}
      >
        <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Mi Informe de Evolución
        </p>
        <p className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
          {story.title}
        </p>
        <div className="flex items-center gap-3">
          <div className="bg-violet-600 rounded-xl px-4 py-2">
            <span className="text-2xl font-extrabold text-white">{story.highlightValue}</span>
          </div>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{story.highlightLabel}</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {story.narrative}
        </p>
        <Separator style={{ background: 'rgba(255,255,255,0.1)' }} />
        <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.45)' }}>
          &ldquo;{story.ctaText}&rdquo;
        </p>
        <div className="flex gap-2 pt-1">
          <Button size="sm" className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs" disabled>
            Coordinar próximo paso
          </Button>
          <Button variant="ghost" size="sm" className="text-xs px-3" style={{ color: 'rgba(255,255,255,0.45)' }} disabled>
            <Download className="h-3.5 w-3.5 mr-1" />
            Guardar
          </Button>
        </div>
      </div>

      {/* AI Synthesis */}
      {comparison && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Lo que dice la IA sobre tu evolución</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{comparison.ai_synthesis_patient}</p>
          </CardContent>
        </Card>
      )}

      {/* Treatment status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Mi tratamiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tipo</span>
            <span className="font-medium">Toxina Botulínica</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Áreas</span>
            <span className="font-medium text-right">{treatment.areas_treated.join(', ')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fecha</span>
            <span className="font-medium">{formatDate(treatment.treated_at)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estado</span>
            <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Completo
            </Badge>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground pb-4">
        {DEMO_CLINIC.name} · Powered by Aesthetic IQ
      </p>
    </div>
  )
}
