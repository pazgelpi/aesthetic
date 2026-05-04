'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { Camera, Upload, CheckCircle2, RotateCcw, Loader2 } from 'lucide-react'

const STEPS = [
  { key: 'front' as const, label: 'Foto frontal', instruction: 'Mirá directo a la cámara, expresión neutra' },
  { key: 'contracted' as const, label: 'Foto contraída', instruction: 'Fruncí el ceño levemente' },
  { key: 'deg45' as const, label: 'Perfil 45°', instruction: 'Girá la cabeza 45° hacia la derecha' },
]

interface Props {
  token: string
  sessionType: 'pre' | 'post_14d' | 'post_30d'
  patientFirstName: string
  onComplete: () => void
}

export function PhotoCapture({ token, sessionType, patientFirstName, onComplete }: Props) {
  const [photos, setPhotos] = useState<{ front: File | null; contracted: File | null; deg45: File | null }>({
    front: null, contracted: null, deg45: null,
  })
  const [uploading, setUploading] = useState(false)

  function handleFile(key: keyof typeof photos, file: File | null) {
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Solo se permiten imágenes'); return }
    setPhotos(prev => ({ ...prev, [key]: file }))
  }

  const completed = Object.values(photos).filter(Boolean).length
  const allDone = completed === STEPS.length

  async function submitPhotos() {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('token', token)
      formData.append('session_type', sessionType)
      formData.append('alignment_quality_score', '0.8')
      if (photos.front) formData.append('photo_front', photos.front)
      if (photos.contracted) formData.append('photo_contracted', photos.contracted)
      if (photos.deg45) formData.append('photo_45', photos.deg45)

      const res = await fetch('/api/photo-sessions', { method: 'POST', body: formData })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Fotos guardadas correctamente')
      onComplete()
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Error al subir las fotos')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{completed} de {STEPS.length} fotos listas</span>
          <span>{Math.round((completed / STEPS.length) * 100)}%</span>
        </div>
        <Progress value={(completed / STEPS.length) * 100} className="h-1.5" />
      </div>

      <div className="space-y-3">
        {STEPS.map(({ key, label, instruction }) => {
          const photo = photos[key]
          return (
            <div
              key={key}
              className={`rounded-2xl border-2 transition-all ${
                photo ? 'border-green-300 bg-green-50/60' : 'border-dashed border-border bg-card'
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail / placeholder */}
                <div className="w-14 h-[72px] rounded-xl overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                  {photo ? (
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-5 w-5 text-muted-foreground/50" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {photo ? (
                    <>
                      <p className="font-medium text-sm text-green-700 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{photo.name}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{instruction}</p>
                    </>
                  )}
                </div>

                {/* Actions */}
                {photo ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-muted-foreground"
                    onClick={() => setPhotos(prev => ({ ...prev, [key]: null }))}
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Cambiar
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2 shrink-0">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="hidden"
                        onChange={e => handleFile(key, e.target.files?.[0] ?? null)}
                      />
                      <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                        <Camera className="h-3.5 w-3.5" />
                        Cámara
                      </span>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFile(key, e.target.files?.[0] ?? null)}
                      />
                      <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border font-medium hover:bg-muted transition-colors cursor-pointer">
                        <Upload className="h-3.5 w-3.5" />
                        Galería
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {allDone && (
        <Button onClick={submitPhotos} disabled={uploading} className="w-full" size="lg">
          {uploading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Subiendo fotos...</>
          ) : (
            <><CheckCircle2 className="mr-2 h-4 w-4" />Guardar las 3 fotos</>
          )}
        </Button>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Hola {patientFirstName}, podés tomar las fotos o subirlas desde tu galería.
      </p>
    </div>
  )
}
