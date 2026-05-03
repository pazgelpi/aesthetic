'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, formatRelativeDate } from '@/lib/utils'
import { Patient, Treatment, ScheduledMessage, Recommendation } from '@/types/database'
import { ArrowLeft, Plus, Star, Phone, Mail, Calendar, MessageSquare, Syringe } from 'lucide-react'
import { toast } from 'sonner'

const STATUS_LABEL: Record<string, string> = {
  scheduled: 'Programado',
  generated: 'Generado',
  sent: 'Enviado',
  failed: 'Falló',
  cancelled: 'Cancelado',
}

const TEMPLATE_LABEL: Record<string, string> = {
  check_in_day_5: 'Check-in día 5',
  photo_request_day_14: 'Foto día 14',
  check_in_day_30: 'Check-in día 30',
  retreatment_reminder: 'Recordatorio retratamiento',
  seasonal_tip: 'Tip estacional',
}

interface Props {
  patient: Patient
  treatments: Treatment[]
  messages: ScheduledMessage[]
  recommendations: Recommendation[]
}

export function PatientDetail({ patient, treatments, messages, recommendations }: Props) {
  const router = useRouter()
  const supabase = createClient()

  async function archivePatient() {
    if (!confirm('¿Archivar esta paciente?')) return
    const { error } = await supabase
      .from('patients')
      .update({ status: 'archived' })
      .eq('id', patient.id)
    if (error) { toast.error('Error al archivar'); return }
    toast.success('Paciente archivada')
    router.push('/patients')
  }

  const lastTreatment = treatments[0]

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold truncate">{patient.full_name}</h1>
            {treatments.length > 3 && (
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{patient.phone_e164}</span>
            {patient.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{patient.email}</span>}
            {patient.date_of_birth && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(patient.date_of_birth, 'dd/MM/yyyy')}</span>}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href={`/treatments/new?patient=${patient.id}`}>
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              Nuevo tratamiento
            </Button>
          </Link>
          <Button size="sm" variant="outline" onClick={archivePatient}>
            Archivar
          </Button>
        </div>
      </div>

      {/* Next treatment card */}
      {lastTreatment?.expected_re_treatment_at && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">Próximo retratamiento sugerido</p>
              <p className="text-lg font-bold">
                {formatDate(lastTreatment.expected_re_treatment_at)}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({formatRelativeDate(lastTreatment.expected_re_treatment_at)})
                </span>
              </p>
            </div>
            <Badge variant="outline">
              {lastTreatment.treatment_type === 'toxin' ? 'Toxina' : 'Filler'}
            </Badge>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="treatments">
        <TabsList>
          <TabsTrigger value="treatments">
            <Syringe className="mr-1.5 h-4 w-4" />
            Tratamientos ({treatments.length})
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="mr-1.5 h-4 w-4" />
            Mensajes ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            Recomendaciones ({recommendations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="treatments" className="space-y-3 mt-4">
          {treatments.length === 0 ? (
            <EmptyState label="Sin tratamientos" action={<Link href={`/treatments/new?patient=${patient.id}`}><Button size="sm">Registrar primer tratamiento</Button></Link>} />
          ) : treatments.map((t) => (
            <Link key={t.id} href={`/treatments/${t.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t.treatment_type === 'toxin' ? 'Toxina Botulínica' : 'Filler Facial'}</span>
                      {t.product_brand && <Badge variant="outline" className="text-xs">{t.product_brand}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {t.areas_treated.join(', ')}
                      {t.units_total ? ` · ${t.units_total} U` : ''}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{formatDate(t.treated_at, 'd MMM yyyy')}</p>
                    {t.expected_re_treatment_at && (
                      <p className="text-xs text-muted-foreground">
                        Próximo: {formatDate(t.expected_re_treatment_at, 'd MMM yyyy')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="messages" className="space-y-3 mt-4">
          {messages.length === 0 ? (
            <EmptyState label="Sin mensajes programados" />
          ) : messages.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{TEMPLATE_LABEL[m.template_type] ?? m.template_type}</span>
                      <Badge variant={m.status === 'sent' ? 'default' : m.status === 'failed' ? 'destructive' : 'secondary'} className="text-xs">
                        {STATUS_LABEL[m.status]}
                      </Badge>
                    </div>
                    {m.generated_message && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{m.generated_message}</p>
                    )}
                    {m.patient_response && (
                      <div className="mt-2 pl-3 border-l-2 border-primary/30">
                        <p className="text-xs text-muted-foreground">Respuesta: {m.patient_response}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground text-right shrink-0">
                    {m.sent_at ? formatDate(m.sent_at, 'd MMM HH:mm') : formatDate(m.scheduled_for, 'd MMM HH:mm')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-3 mt-4">
          {recommendations.length === 0 ? (
            <EmptyState label="Sin recomendaciones activas" />
          ) : recommendations.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="text-xs shrink-0 mt-0.5">
                    {r.recommendation_type === 'next_treatment' ? 'Tratamiento' : r.recommendation_type === 'product' ? 'Producto' : r.recommendation_type === 'home_care' ? 'Home care' : 'Estilo de vida'}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{r.description}</p>
                    {r.rationale && <p className="text-xs text-muted-foreground/70 mt-1 italic">{r.rationale}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-10 text-sm text-muted-foreground space-y-3">
      <p>{label}</p>
      {action}
    </div>
  )
}
