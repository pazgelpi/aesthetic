'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Camera, CheckCircle2, RotateCcw, Loader2, AlertCircle } from 'lucide-react'

interface PhotoSet {
  front: File | null
  contracted: File | null
  deg45: File | null
  landmarksFront: number[][] | null
  landmarksContracted: number[][] | null
  landmarks45: number[][] | null
  qualityScore: number
}

interface Props {
  token: string
  sessionType: 'pre' | 'post_14d' | 'post_30d'
  patientFirstName: string
  onComplete: () => void
}

const STEPS = [
  { key: 'front', label: 'Foto frontal', instruction: 'Mirá directo a la cámara, expresión neutra.' },
  { key: 'contracted', label: 'Foto contraída', instruction: 'Fruncí el ceño levemente.' },
  { key: 'deg45', label: 'Foto 45°', instruction: 'Girá la cabeza 45° hacia la derecha.' },
] as const

type StepKey = typeof STEPS[number]['key']

export function PhotoCapture({ token, sessionType, patientFirstName, onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [currentStep, setCurrentStep] = useState<number>(0)
  const [photos, setPhotos] = useState<PhotoSet>({
    front: null, contracted: null, deg45: null,
    landmarksFront: null, landmarksContracted: null, landmarks45: null,
    qualityScore: 0,
  })
  const [cameraActive, setCameraActive] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [mediapipeReady, setMediapipeReady] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faceMeshRef = useRef<any>(null)
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    loadMediaPipe()
    return () => {
      stopCamera()
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  async function loadMediaPipe() {
    try {
      
      const { FaceMesh } = await import('@mediapipe/face_mesh')
      const mesh = new FaceMesh({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      })
      mesh.setOptions({ maxNumFaces: 1, refineLandmarks: false, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 })
      mesh.onResults((results: { multiFaceLandmarks?: Array<Array<{ x: number; y: number; z: number }>> }) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          setFaceDetected(true)
          const landmarks = results.multiFaceLandmarks[0].map((lm) => [lm.x, lm.y, lm.z])
          faceMeshRef.current = { landmarks }
        } else {
          setFaceDetected(false)
          faceMeshRef.current = null
        }
      })
      await mesh.initialize()
      faceMeshRef.current = mesh
      setMediapipeReady(true)
    } catch {
      setMediapipeReady(true) // Degrade gracefully
    }
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraActive(true)
      runFaceDetection()
    } catch (err) {
      toast.error('No se pudo acceder a la cámara. Verificá los permisos.')
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraActive(false)
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
  }

  function runFaceDetection() {
    
    const mesh = faceMeshRef.current
    if (!mesh || typeof mesh.send !== 'function') return

    async function detect() {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        try {
          
          await faceMeshRef.current?.send({ image: videoRef.current })
        } catch {}
      }
      animFrameRef.current = requestAnimationFrame(detect)
    }
    detect()
  }

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return
    setCapturing(true)

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0)

    canvas.toBlob(async (blob) => {
      if (!blob) { setCapturing(false); return }
      const file = new File([blob], `photo_${STEPS[currentStep].key}.jpg`, { type: 'image/jpeg' })

      
      const currentLandmarks = faceMeshRef.current?.landmarks ?? null

      const stepKey = STEPS[currentStep].key as StepKey
      const landmarkKey = (`landmarks${stepKey.charAt(0).toUpperCase() + stepKey.slice(1)}`) as keyof PhotoSet

      setPhotos((prev) => ({
        ...prev,
        [stepKey]: file,
        [landmarkKey]: currentLandmarks,
        qualityScore: faceDetected ? 0.85 : 0.5,
      }))

      setCapturing(false)
      stopCamera()
    }, 'image/jpeg', 0.9)
  }, [currentStep, faceDetected])

  function retakePhoto() {
    const stepKey = STEPS[currentStep].key as StepKey
    setPhotos((prev) => ({ ...prev, [stepKey]: null }))
    startCamera()
  }

  function nextStep() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      startCamera()
    }
  }

  async function submitPhotos() {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('token', token)
      formData.append('session_type', sessionType)
      formData.append('alignment_quality_score', photos.qualityScore.toString())

      if (photos.front) formData.append('photo_front', photos.front)
      if (photos.contracted) formData.append('photo_contracted', photos.contracted)
      if (photos.deg45) formData.append('photo_45', photos.deg45)
      if (photos.landmarksFront) formData.append('landmarks_front', JSON.stringify(photos.landmarksFront))
      if (photos.landmarksContracted) formData.append('landmarks_contracted', JSON.stringify(photos.landmarksContracted))
      if (photos.landmarks45) formData.append('landmarks_45', JSON.stringify(photos.landmarks45))

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

  const currentStepData = STEPS[currentStep]
  const currentPhoto = photos[currentStepData.key as StepKey] as File | null
  const allDone = STEPS.every((s) => photos[s.key as StepKey])
  const progress = (STEPS.filter((s) => photos[s.key as StepKey]).length / STEPS.length) * 100

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Paso {currentStep + 1} de {STEPS.length}</span>
          <span>{STEPS.filter((s) => photos[s.key as StepKey]).length} de {STEPS.length} fotos</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Step indicators */}
      <div className="flex gap-2">
        {STEPS.map((step, i) => (
          <div
            key={step.key}
            className={`flex-1 text-center text-xs py-1.5 rounded-md border transition-colors ${
              i === currentStep ? 'border-primary bg-primary/5 font-medium' :
              photos[step.key as StepKey] ? 'border-green-300 bg-green-50 text-green-700' :
              'border-border text-muted-foreground'
            }`}
          >
            {photos[step.key as StepKey] ? <CheckCircle2 className="h-3 w-3 mx-auto text-green-600" /> : step.label}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{currentStepData.label}</CardTitle>
          <CardDescription>{currentStepData.instruction}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!currentPhoto ? (
            <>
              {/* Camera preview */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Face detection indicator */}
                {cameraActive && (
                  <div className={`absolute top-3 right-3 rounded-full px-2 py-1 text-xs font-medium ${faceDetected ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                    {faceDetected ? 'Rostro detectado' : 'Buscando rostro...'}
                  </div>
                )}

                {/* Face alignment guide */}
                {cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-48 h-64 rounded-full border-2 ${faceDetected ? 'border-green-400' : 'border-white/40'}`} />
                  </div>
                )}
              </div>

              {!cameraActive ? (
                <Button onClick={startCamera} className="w-full" disabled={!mediapipeReady}>
                  {mediapipeReady
                    ? <><Camera className="mr-2 h-4 w-4" />Abrir cámara</>
                    : <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Cargando...</>}
                </Button>
              ) : (
                <Button
                  onClick={capturePhoto}
                  className="w-full"
                  disabled={capturing || !faceDetected}
                >
                  {capturing
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Capturando...</>
                    : !faceDetected
                    ? <><AlertCircle className="mr-2 h-4 w-4" />Necesito ver tu rostro</>
                    : <><Camera className="mr-2 h-4 w-4" />Capturar foto</>}
                </Button>
              )}
            </>
          ) : (
            <>
              {/* Preview captured photo */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                <img
                  src={URL.createObjectURL(currentPhoto)}
                  alt="Foto capturada"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-green-500 text-white gap-1">
                    <CheckCircle2 className="h-3 w-3" /> OK
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={retakePhoto} className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" /> Repetir
                </Button>
                {currentStep < STEPS.length - 1 ? (
                  <Button onClick={nextStep} className="flex-1">
                    Siguiente →
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {allDone && (
        <Button onClick={submitPhotos} disabled={uploading} className="w-full" size="lg">
          {uploading
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Subiendo fotos...</>
            : <><CheckCircle2 className="mr-2 h-4 w-4" />Guardar las 3 fotos</>}
        </Button>
      )}
    </div>
  )
}
