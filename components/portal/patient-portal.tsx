'use client'

import { useState } from 'react'
import { Treatment, PhotoSession, Comparison, Recommendation, ClinicProtocol, CaptureToken } from '@/types/database'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PhotoCapture } from '@/components/capture/photo-capture'
import { Calendar, Camera, CheckCircle2, Sparkles, BookOpen } from 'lucide-react'

interface Props {
  token: string
  captureToken: CaptureToken
  treatment: Treatment
  patient: { id: string; first_name: string; full_name: string }
  photoSessions: PhotoSession[]
  comparison: Comparison | null
  recommendations: Recommendation[]
  protocol: ClinicProtocol | null
  initialTab: string
}

export function PatientPortal({
  token,
  captureToken,
  treatment,
  patient,
  photoSessions,
  comparison,
  recommendations,
  protocol,
  initialTab,
}: Props) {
  const [tab, setTab] = useState(initialTab)
  const [photoDone, setPhotoDone] = useState(false)

  const preSession = photoSessions.find((s) => s.session_type === 'pre')
  const postSession = photoSessions.filter((s) => s.session_type !== 'pre').pop()

  const treatmentLabel = treatment.treatment_type === 'toxin' ? 'Toxina Botulínica' : 'Filler Facial'
  const sessionType = captureToken.purpose === 'post_photo'
    ? (getDaysElapsed(treatment.treated_at) <= 20 ? 'post_14d' : 'post_30d')
    : 'pre'

  function getDaysElapsed(from: string): number {
    return Math.round((Date.now() - new Date(from).getTime()) / 86_400_000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <p className="text-xs text-muted-foreground">Tu portal de seguimiento</p>
        <h1 className="font-semibold text-sm">Hola, {patient.first_name} 👋</h1>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {/* Treatment badge */}
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="text-sm font-medium">{treatmentLabel}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(treatment.treated_at)} · {treatment.areas_treated.join(', ')}
            </p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="plan" className="flex-1 text-xs">
              <Calendar className="h-3.5 w-3.5 mr-1" />Mi plan
            </TabsTrigger>
            <TabsTrigger value="routine" className="flex-1 text-xs">
              <BookOpen className="h-3.5 w-3.5 mr-1" />Mi rutina
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex-1 text-xs">
              <Camera className="h-3.5 w-3.5 mr-1" />Mis fotos
            </TabsTrigger>
          </TabsList>

          {/* Mi plan */}
          <TabsContent value="plan" className="space-y-4 pt-4">
            {treatment.expected_re_treatment_at && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Próximo tratamiento recomendado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatDate(treatment.expected_re_treatment_at)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Contactá a tu profesional para agendar tu próxima sesión.
                  </p>
                </CardContent>
              </Card>
            )}

            {comparison && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Tus resultados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{comparison.ai_synthesis_patient}</p>
                </CardContent>
              </Card>
            )}

            {recommendations.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Recomendaciones para vos</p>
                {recommendations.map((rec) => (
                  <Card key={rec.id}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="text-xs shrink-0 mt-0.5">
                          {REC_LABELS[rec.recommendation_type] ?? rec.recommendation_type}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">{rec.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Mi rutina */}
          <TabsContent value="routine" className="space-y-4 pt-4">
            {protocol ? (
              <>
                {protocol.post_treatment_immediate && (
                  <InstructionsCard
                    title="Primeras 24 horas"
                    text={protocol.post_treatment_immediate}
                    icon="🕐"
                  />
                )}
                {protocol.post_treatment_week && (
                  <InstructionsCard
                    title="Primera semana"
                    text={protocol.post_treatment_week}
                    icon="📅"
                  />
                )}
                {protocol.post_treatment_long_term && (
                  <InstructionsCard
                    title="Cuidados a largo plazo"
                    text={protocol.post_treatment_long_term}
                    icon="✨"
                  />
                )}
                {protocol.recommended_products && (
                  <InstructionsCard
                    title="Productos recomendados"
                    text={protocol.recommended_products}
                    icon="🧴"
                  />
                )}
                {protocol.patient_education_text && (
                  <InstructionsCard
                    title="Información sobre tu tratamiento"
                    text={protocol.patient_education_text}
                    icon="📖"
                  />
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Tu profesional compartirá las instrucciones de cuidado pronto.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Mis fotos */}
          <TabsContent value="photos" className="pt-4">
            {photoDone ? (
              <Card>
                <CardContent className="py-12 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="font-medium">¡Fotos guardadas!</p>
                  <p className="text-sm text-muted-foreground">
                    Tu profesional podrá ver el progreso de tu tratamiento.
                  </p>
                </CardContent>
              </Card>
            ) : preSession && postSession ? (
              <Card>
                <CardContent className="py-8 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto" />
                  <p className="text-sm font-medium">Ya tenemos tus fotos registradas.</p>
                  <p className="text-xs text-muted-foreground">
                    Fotos pre ({formatDate(preSession.captured_at)}) y post ({formatDate(postSession.captured_at)}) guardadas.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <PhotoCapture
                token={token}
                sessionType={sessionType}
                patientFirstName={patient.first_name}
                onComplete={() => setPhotoDone(true)}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function InstructionsCard({ title, text, icon }: { title: string; text: string; icon: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed whitespace-pre-line">{text}</p>
      </CardContent>
    </Card>
  )
}

const REC_LABELS: Record<string, string> = {
  next_treatment: 'Próximo tratamiento',
  product: 'Producto',
  home_care: 'Cuidado en casa',
  lifestyle: 'Estilo de vida',
}
