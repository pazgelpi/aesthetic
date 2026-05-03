'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Treatment, Patient, PhotoSession, Comparison } from '@/types/database'
import { formatDate, formatRelativeDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Camera, Share2, Calendar, Package, Layers, StickyNote, Loader2, ExternalLink, Copy, Check } from 'lucide-react'

interface Props {
  treatment: Treatment
  patient: Patient
  photoSessions: PhotoSession[]
  comparison: Comparison | null
  captureToken: string | null
}

export function TreatmentDetail({ treatment, patient, photoSessions, comparison, captureToken }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [generatingToken, setGeneratingToken] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeToken, setActiveToken] = useState(captureToken)

  const preSession = photoSessions.find((s) => s.session_type === 'pre')
  const post14Session = photoSessions.find((s) => s.session_type === 'post_14d')
  const post30Session = photoSessions.find((s) => s.session_type === 'post_30d')

  const portalUrl = activeToken
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/portal/${activeToken}?purpose=photo`
    : null

  async function generateCaptureToken() {
    setGeneratingToken(true)
    try {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      const { data, error } = await supabase
        .from('capture_tokens')
        .insert({
          treatment_id: treatment.id,
          patient_id: treatment.patient_id,
          purpose: 'post_photo',
          expires_at: expiresAt.toISOString(),
        })
        .select('token')
        .single()

      if (error) throw error
      setActiveToken(data.token)
      toast.success('Link de captura generado (válido 7 días)')
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setGeneratingToken(false)
    }
  }

  async function copyLink() {
    if (!portalUrl) return
    await navigator.clipboard.writeText(portalUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const typeLabel = treatment.treatment_type === 'toxin' ? 'Toxina Botulínica' : 'Filler Facial'

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/treatments" className="hover:underline">Tratamientos</Link>
            <span>/</span>
            <span>{patient.full_name}</span>
          </div>
          <h1 className="text-2xl font-bold">{typeLabel}</h1>
          <p className="text-muted-foreground">
            {formatDate(treatment.treated_at)} ·{' '}
            <Link href={`/patients/${patient.id}`} className="hover:underline text-primary">
              {patient.full_name}
            </Link>
          </p>
        </div>
        <Badge variant={treatment.treatment_type === 'toxin' ? 'default' : 'secondary'}>
          {typeLabel}
        </Badge>
      </div>

      {/* Details row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {treatment.product_brand && (
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Package className="h-4 w-4" />
                <span className="text-xs">Producto</span>
              </div>
              <p className="font-medium text-sm">{treatment.product_brand}</p>
            </CardContent>
          </Card>
        )}
        {treatment.units_total && (
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Layers className="h-4 w-4" />
                <span className="text-xs">Unidades</span>
              </div>
              <p className="font-medium text-sm">{treatment.units_total} U</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Layers className="h-4 w-4" />
              <span className="text-xs">Áreas</span>
            </div>
            <p className="font-medium text-sm">{treatment.areas_treated.join(', ')}</p>
          </CardContent>
        </Card>
        {treatment.expected_re_treatment_at && (
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Próximo</span>
              </div>
              <p className="font-medium text-sm">{formatRelativeDate(treatment.expected_re_treatment_at)}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {treatment.notes && (
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <StickyNote className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Notas clínicas</span>
            </div>
            <p className="text-sm">{treatment.notes}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="photos">
        <TabsList>
          <TabsTrigger value="photos">Fotos ({photoSessions.length})</TabsTrigger>
          <TabsTrigger value="comparison" disabled={!comparison}>
            Comparativa{comparison ? '' : ' (pendiente)'}
          </TabsTrigger>
          <TabsTrigger value="capture">Captura remota</TabsTrigger>
        </TabsList>

        {/* Photos tab */}
        <TabsContent value="photos" className="space-y-4 pt-4">
          {[
            { session: preSession, label: 'Pre-tratamiento', type: 'pre' },
            { session: post14Session, label: 'Post 14 días', type: 'post_14d' },
            { session: post30Session, label: 'Post 30 días', type: 'post_30d' },
          ].map(({ session, label }) => (
            <Card key={label}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{label}</CardTitle>
                {session && (
                  <CardDescription>{formatDate(session.captured_at)}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {session ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[session.photo_front_url, session.photo_contracted_url, session.photo_45_url].map((url, i) => (
                      url ? (
                        <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                          <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div key={i} className="aspect-[3/4] rounded-lg bg-muted flex items-center justify-center">
                          <Camera className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )
                    ))}
                    <div className="col-span-3 flex justify-between text-xs text-muted-foreground">
                      <span>Frontal</span><span>Contraída</span><span>45°</span>
                    </div>
                    {session.alignment_quality_score != null && (
                      <div className="col-span-3">
                        <Badge variant="outline" className="text-xs">
                          Calidad de alineación: {Math.round(session.alignment_quality_score * 100)}%
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Camera className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Sin fotos aún</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Comparison tab */}
        <TabsContent value="comparison" className="pt-4">
          {comparison ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Síntesis para la paciente</CardTitle>
                  <CardDescription>Generado {formatRelativeDate(comparison.generated_at)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{comparison.ai_synthesis_patient}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Síntesis clínica</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{comparison.ai_synthesis_clinic}</p>
                </CardContent>
              </Card>
              {comparison.metrics_json && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Métricas objetivas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MetricsGrid metrics={comparison.metrics_json as Record<string, number>} />
                  </CardContent>
                </Card>
              )}
              {(comparison.diff_overlay_url || comparison.shareable_image_url) && (
                <div className="flex gap-3">
                  {comparison.diff_overlay_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={comparison.diff_overlay_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> Ver diferencia visual
                      </a>
                    </Button>
                  )}
                  {comparison.shareable_image_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={comparison.shareable_image_url} target="_blank" rel="noopener noreferrer">
                        <Share2 className="mr-2 h-4 w-4" /> Imagen compartible
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-sm">La comparativa se genera automáticamente cuando existen fotos pre y post.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Remote capture tab */}
        <TabsContent value="capture" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Captura remota de fotos
              </CardTitle>
              <CardDescription>
                Enviá este link a {patient.first_name} para que capture sus fotos post-tratamiento desde su celular.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeToken && portalUrl ? (
                <>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted text-sm font-mono break-all">
                    {portalUrl}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={copyLink} className="flex-1">
                      {copied ? <><Check className="mr-2 h-4 w-4" />Copiado</> : <><Copy className="mr-2 h-4 w-4" />Copiar link</>}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        const text = `Hola ${patient.first_name}! Capturá tus fotos post-tratamiento aquí: ${portalUrl}`
                        window.open(`https://wa.me/${patient.phone_e164.replace('+', '')}?text=${encodeURIComponent(text)}`)
                      }}
                    >
                      Enviar por WhatsApp
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">El link expira en 7 días.</p>
                </>
              ) : (
                <Button onClick={generateCaptureToken} disabled={generatingToken}>
                  {generatingToken
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generando...</>
                    : <><Camera className="mr-2 h-4 w-4" />Generar link de captura</>}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricsGrid({ metrics }: { metrics: Record<string, number> }) {
  const pairs = [
    { key: 'glabela', label: 'Glabela' },
    { key: 'frontal', label: 'Frontal' },
    { key: 'patas_gallo_left', label: 'Patas de gallo izq.' },
    { key: 'patas_gallo_right', label: 'Patas de gallo der.' },
  ]

  return (
    <div className="space-y-3">
      {pairs.map(({ key, label }) => {
        const changePct = metrics[`${key}_change_pct`]
        if (changePct == null) return null
        const improved = changePct < 0
        return (
          <div key={key} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <Badge variant={improved ? 'default' : 'secondary'} className="text-xs">
              {improved ? '↓' : '↑'} {Math.abs(Math.round(changePct))}% {improved ? 'mejora' : 'cambio'}
            </Badge>
          </div>
        )
      })}
      {metrics.symmetry_change != null && (
        <>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Simetría</span>
            <Badge variant="outline" className="text-xs">
              {metrics.symmetry_change > 0 ? '+' : ''}{Math.round(metrics.symmetry_change * 100) / 100} pts
            </Badge>
          </div>
        </>
      )}
    </div>
  )
}
