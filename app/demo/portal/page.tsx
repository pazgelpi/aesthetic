'use client'

import { useState } from 'react'
import { DEMO_PATIENTS, DEMO_TREATMENTS, DEMO_COMPARISONS, DEMO_STORY, DEMO_CLINIC } from '@/lib/demo/data'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Calendar, MessageCircle, Clock, CheckCircle2, Camera, Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'

const PHOTO_SLOTS = [
  { key: 'front', label: 'Frontal' },
  { key: '45', label: '45°' },
  { key: 'contracted', label: 'Contraída' },
] as const

const ROADMAP = [
  { date: '25 MAR', label: 'Tratamiento · toxina', status: 'done' },
  { date: '8 ABR',  label: 'Foto día 14 · enviada', status: 'done' },
  { date: '9 MAY',  label: 'Día 45 · informe listo', status: 'now' },
  { date: '23 JUN', label: 'Retratamiento', status: 'next' },
  { date: 'AGO',    label: 'Tu Historia · 6 meses', status: 'later' },
] as const

const RUTINA = [
  { name: 'SPF 50+ La Roche', track: '✓✓✓✓✓✓✓', status: 'done' },
  { name: 'Vitamina C',       track: '✓✓✓ · ·✓✓', status: 'partial' },
  { name: 'Hidratante',       track: '✓✓✓✓✓✓·', status: 'done' },
]

type TabKey = 'plan' | 'evol' | 'rut'

export default function DemoPortalPage() {
  const patient = DEMO_PATIENTS[0]
  const treatment = DEMO_TREATMENTS[0]
  const comparison = DEMO_COMPARISONS['demo-t1']
  const story = DEMO_STORY

  const nextAppointment = new Date(treatment.expected_re_treatment_at!)
  const daysUntil = Math.round((nextAppointment.getTime() - Date.now()) / 864e5)

  const [tab, setTab] = useState<TabKey>('plan')

  // Photo capture state
  const [photos, setPhotos] = useState<Partial<Record<'front' | '45' | 'contracted', string>>>({})
  const [uploading, setUploading] = useState(false)
  const [photosSent, setPhotosSent] = useState(false)
  const [activeSlot, setActiveSlot] = useState<'front' | '45' | 'contracted' | null>(null)
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null)

  const allSlotsFilled = PHOTO_SLOTS.every(s => photos[s.key])

  function handleSlotClick(key: 'front' | '45' | 'contracted') {
    if (photosSent) return
    setActiveSlot(key)
    fileInputRef?.click()
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

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'plan', label: 'Mi plan' },
    { key: 'evol', label: 'Mi evolución' },
    { key: 'rut', label: 'Mi rutina' },
  ]

  return (
    <div className="p-6 max-w-md mx-auto space-y-5">
      {/* Hidden file input */}
      <input
        ref={el => setFileInputRef(el)}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Portal header */}
      <div className="pt-4">
        <p
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: 9.5,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
          }}
        >
          {DEMO_CLINIC.name} · Tu espacio
        </p>
        <h1
          className="leading-none tracking-tight mt-2"
          style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 42, letterSpacing: '-0.01em' }}
        >
          {patient.first_name},<br />
          <em>tu piel sigue trabajando.</em>
        </h1>
        <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--ink-2)', maxWidth: 300 }}>
          Hace 45 días empezamos juntas. La doctora te dejó este resumen y te avisa cuando necesite algo.
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-3"
        style={{ borderBottom: '1px solid var(--hairline-strong)' }}
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px 0',
              cursor: 'pointer',
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: tab === key ? 'italic' : 'normal',
              fontSize: 18,
              color: tab === key ? 'var(--ink)' : 'var(--ink-3)',
              borderBottom: tab === key ? '1px solid var(--ink)' : '1px solid transparent',
              marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Mi plan ── */}
      {tab === 'plan' && (
        <div className="space-y-5">
          {/* Próximo turno */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--hairline)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 9.5,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--terracota-deep)',
              }}
            >
              Mi próximo turno
            </p>
            <p
              className="mt-2 leading-none"
              style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 34, letterSpacing: '-0.01em' }}
            >
              23 de <em>junio</em>
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-3)' }}>
              Retratamiento · toxina botulínica
              {daysUntil > 0 && ` · en ${daysUntil} días`}
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="flex-1 rounded-xl font-medium"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
                disabled
              >
                Confirmar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl"
                disabled
              >
                Reagendar
              </Button>
            </div>
            <button
              className="mt-3 text-sm w-full text-left"
              style={{ background: 'none', border: 'none', color: 'var(--ink-3)', cursor: 'default' }}
            >
              Hablar con la Dra. Valentina →
            </button>
          </div>

          {/* Photo capture */}
          <div
            className="rounded-2xl p-5"
            style={{ background: 'var(--paper)', border: '1px solid var(--hairline)' }}
          >
            <p
              className="flex items-center gap-2 mb-1"
              style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 9.5,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
              }}
            >
              <Camera className="h-3 w-3" />
              Subir fotos de seguimiento
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--ink-4)' }}>
              {photosSent
                ? 'La doctora recibió tus fotos. Te contactará pronto.'
                : 'Sacate una foto en cada ángulo con buena luz natural.'}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {PHOTO_SLOTS.map(({ key, label }) => {
                const preview = photos[key]
                return (
                  <button
                    key={key}
                    onClick={() => handleSlotClick(key)}
                    disabled={photosSent || uploading}
                    className="aspect-[3/4] rounded-xl overflow-hidden transition-all relative focus:outline-none"
                    style={{
                      border: `2px solid ${photosSent ? 'var(--status-green)' : preview ? 'var(--terracota)' : 'var(--border)'}`,
                      background: preview ? 'transparent' : 'var(--muted)',
                    }}
                  >
                    {photosSent ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'var(--status-green-tint)' }}>
                        <CheckCircle2 className="h-6 w-6" style={{ color: 'var(--status-green)' }} />
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
            <div className="flex justify-between px-1 mt-1.5" style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9.5, color: 'var(--ink-4)', letterSpacing: '0.08em' }}>
              <span>FRONTAL</span><span>45°</span><span>CONTRAÍDA</span>
            </div>

            {!photosSent && (
              <Button
                className="w-full rounded-xl mt-4"
                size="sm"
                disabled={!allSlotsFilled || uploading}
                onClick={handleSendPhotos}
                style={{ background: allSlotsFilled ? 'var(--terracota)' : undefined, color: allSlotsFilled ? 'white' : undefined }}
              >
                {uploading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando fotos...</>
                  : <><Upload className="mr-2 h-4 w-4" />Enviar fotos a la doctora</>
                }
              </Button>
            )}

            {photosSent && (
              <div
                className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 mt-4"
                style={{ color: 'var(--status-green)', background: 'var(--status-green-tint)' }}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Fotos enviadas correctamente
              </div>
            )}
          </div>

          {/* Roadmap — Tu camino */}
          <div>
            <p
              className="mb-3"
              style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 9.5,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
              }}
            >
              Tu camino
            </p>
            <div className="space-y-0">
              {ROADMAP.map((step, i) => (
                <div key={i} className="flex gap-3.5 items-stretch" style={{ minHeight: 44 }}>
                  {/* Timeline column */}
                  <div className="flex flex-col items-center" style={{ width: 16 }}>
                    <div
                      className="shrink-0 rounded-full mt-1"
                      style={{
                        width: 10,
                        height: 10,
                        background:
                          step.status === 'done' ? 'var(--ink)'
                          : step.status === 'now' ? 'var(--terracota)'
                          : 'transparent',
                        border: '1px solid var(--ink)',
                      }}
                    />
                    {i < ROADMAP.length - 1 && (
                      <div
                        className="flex-1"
                        style={{ width: 1, background: 'var(--hairline-strong)', minHeight: 20, marginTop: 2 }}
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-4 flex-1">
                    <p
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono)',
                        fontSize: 10,
                        letterSpacing: '0.10em',
                        color: 'var(--ink-3)',
                      }}
                    >
                      {step.date}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-instrument-serif)',
                        fontSize: step.status === 'now' ? 20 : 17,
                        fontStyle: step.status === 'now' ? 'italic' : 'normal',
                        color: step.status === 'later' ? 'var(--ink-4)' : 'var(--ink)',
                        lineHeight: 1.2,
                      }}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Mi evolución ── */}
      {tab === 'evol' && (
        <div className="space-y-5">
          {/* Dark ink card */}
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: 'var(--ink)',
              color: 'var(--paper)',
              border: '1px solid rgba(181,112,79,0.3)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 9.5,
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              MI INFORME · DÍA 45
            </p>
            {/* Big metric */}
            <div
              className="mt-3 leading-none"
              style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 64, letterSpacing: '-0.02em' }}
            >
              67<em style={{ fontSize: 36 }}>%</em>
            </div>
            <p
              style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', fontSize: 18, color: 'rgba(255,255,255,0.85)' }}
            >
              de mejora en glabela
            </p>
            <p
              className="mt-4 leading-relaxed"
              style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)' }}
            >
              A 45 días de tu tratamiento, la zona del entrecejo muestra una suavización notable.
              Tu simetría facial mejoró un 12 %.
            </p>
            {comparison && (
              <p
                className="mt-2 leading-relaxed"
                style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)' }}
              >
                {comparison.ai_synthesis_patient}
              </p>
            )}
            <Button
              className="mt-4 w-full rounded-xl font-medium"
              size="sm"
              style={{ background: 'var(--terracota)', color: 'white' }}
              disabled
            >
              Compartir mi historia ✦
            </Button>
          </div>

          {/* Photo strip */}
          <div>
            <p
              className="mb-2.5"
              style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 9.5,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
              }}
            >
              Fotos del camino
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'DÍA 0', color: '#d9c4a8', colorEnd: '#c8ad8a' },
                { label: 'DÍA 14', color: '#cfc09e', colorEnd: '#b8a882' },
                { label: 'DÍA 45', color: '#c8d4b0', colorEnd: '#a8b88a' },
              ].map(({ label, color, colorEnd }) => (
                <div
                  key={label}
                  className="aspect-[3/4] rounded-xl flex items-end justify-center pb-2 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${colorEnd})`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono)',
                      fontSize: 8.5,
                      letterSpacing: '0.14em',
                      color: 'rgba(31,26,20,0.6)',
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Mi rutina ── */}
      {tab === 'rut' && (
        <div className="space-y-0">
          <p
            className="mb-3"
            style={{
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: 9.5,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
            }}
          >
            Mañana · 7 días de adherencia
          </p>
          {RUTINA.map(({ name, track }) => (
            <div
              key={name}
              className="flex items-center justify-between py-4"
              style={{ borderBottom: '1px solid var(--hairline)' }}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 18 }}>{name}</p>
                <p
                  className="mt-0.5"
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: 11,
                    color: 'var(--ink-3)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {track}
                </p>
              </div>
              <button
                className="rounded-full px-3 py-1.5 text-xs font-medium shrink-0"
                style={{
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 11,
                  background: 'var(--cream-2)',
                  color: 'var(--ink)',
                  border: '1px solid var(--hairline-strong)',
                  cursor: 'default',
                  letterSpacing: '0.06em',
                }}
              >
                Marcar hoy
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <p
        className="text-center pb-4"
        style={{
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: 9.5,
          letterSpacing: '0.08em',
          color: 'var(--ink-4)',
          textTransform: 'uppercase',
        }}
      >
        Privado · solo vos y tu médica · Powered by Aesthetic IQ
      </p>
    </div>
  )
}
