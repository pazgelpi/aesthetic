import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { ScheduledMessage } from '@/types/database'

export const revalidate = 0

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Programado',
  generated: 'Generado',
  sent: 'Enviado',
  failed: 'Fallido',
  cancelled: 'Cancelado',
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  scheduled: 'secondary',
  generated: 'outline',
  sent: 'default',
  failed: 'destructive',
  cancelled: 'secondary',
}

const TEMPLATE_LABELS: Record<string, string> = {
  day0_welcome: 'Bienvenida (día 0)',
  day3_checkin: 'Check-in (día 3)',
  day14_photo_request: 'Solicitud de fotos (día 14)',
  day30_progress: 'Progreso (día 30)',
  day90_reactivation: 'Reactivación (día 90)',
}

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: professional } = await supabase
    .from('professionals')
    .select('clinic_id')
    .eq('user_id', user.id)
    .single()
  if (!professional) redirect('/onboarding')

  const { data: messagesRaw } = await supabase
    .from('scheduled_messages')
    .select('*')
    .eq('clinic_id', professional.clinic_id)
    .order('scheduled_for', { ascending: false })
    .limit(200)

  const messages = (messagesRaw ?? []) as ScheduledMessage[]

  const pending = messages.filter((m) => m.status === 'scheduled' || m.status === 'generated')
  const sent = messages.filter((m) => m.status === 'sent')
  const failed = messages.filter((m) => m.status === 'failed')

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">WhatsApp</h1>
        <p className="text-sm text-muted-foreground">
          {pending.length} pendientes · {sent.length} enviados · {failed.length} fallidos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pendientes', count: pending.length, color: 'text-yellow-600' },
          { label: 'Enviados', count: sent.length, color: 'text-green-600' },
          { label: 'Fallidos', count: failed.length, color: 'text-red-600' },
        ].map(({ label, count, color }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <MessageSection
        title="Próximos a enviar"
        messages={pending}
        emptyText="No hay mensajes pendientes."
      />
      <MessageSection
        title="Enviados recientemente"
        messages={sent.slice(0, 50)}
        emptyText="Aún no se envió ningún mensaje."
      />
      {failed.length > 0 && (
        <MessageSection
          title="Fallidos"
          messages={failed}
          emptyText=""
        />
      )}
    </div>
  )
}

function MessageSection({
  title,
  messages,
  emptyText,
}: {
  title: string
  messages: ScheduledMessage[]
  emptyText: string
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">{emptyText}</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Link href={`/patients/${msg.patient_id}`} className="font-medium text-sm hover:underline">
                      Ver paciente
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {TEMPLATE_LABELS[msg.template_type] ?? msg.template_type}
                    </span>
                  </div>
                  {msg.generated_message && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{msg.generated_message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {msg.status === 'sent' && msg.sent_at
                      ? `Enviado ${formatDate(msg.sent_at)}`
                      : `Programado para ${formatDate(msg.scheduled_for)}`}
                    {msg.patient_responded_at && ' · Respondió'}
                    {msg.escalated_to_clinic && ' · Escalado'}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[msg.status] ?? 'outline'} className="text-xs shrink-0">
                  {STATUS_LABELS[msg.status] ?? msg.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
