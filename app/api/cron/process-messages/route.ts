import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildClinicSystemPrompt } from '@/lib/ai/build-system-prompt'
import { ScheduledMessage } from '@/types/database'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const now = new Date()
  const windowEnd = new Date(now.getTime() + 60_000)

  const { data: messagesRaw } = await supabase
    .from('scheduled_messages')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_for', windowEnd.toISOString())
    .limit(50)

  const messages = (messagesRaw ?? []) as ScheduledMessage[]

  if (messages.length === 0) {
    return Response.json({ ok: true, processed: 0 })
  }

  let sent = 0
  let failed = 0

  for (const msg of messages) {
    try {
      await supabase.from('scheduled_messages').update({ status: 'generated' }).eq('id', msg.id)

      const { data: patient } = await supabase
        .from('patients')
        .select('id, first_name, phone_e164')
        .eq('id', msg.patient_id)
        .single()

      const { data: treatment } = await supabase
        .from('treatments')
        .select('id, treatment_type, areas_treated, treated_at')
        .eq('id', msg.treatment_id ?? '')
        .maybeSingle()

      const systemPrompt = await buildClinicSystemPrompt(msg.clinic_id)

      const { data: template } = await supabase
        .from('message_templates')
        .select('prompt_instructions')
        .eq('template_type', msg.template_type)
        .eq('is_active', true)
        .maybeSingle()

      const userPrompt = buildUserPrompt({
        firstName: patient?.first_name ?? 'la paciente',
        treatmentType: treatment?.treatment_type,
        areasTreated: treatment?.areas_treated,
        treatedAt: treatment?.treated_at,
        templateType: msg.template_type,
        templateInstructions: template?.prompt_instructions,
      })

      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      })

      const rawText = response.content[0].type === 'text' ? response.content[0].text : ''
      const shouldEscalate = rawText.startsWith('ESCALAR')
      const messageText = shouldEscalate ? rawText.replace(/^ESCALAR\s*\n?/, '') : rawText

      if (patient?.phone_e164) {
        await sendWhatsApp(patient.phone_e164, messageText)
      }

      await supabase
        .from('scheduled_messages')
        .update({
          status: 'sent',
          generated_message: messageText,
          generated_at: new Date().toISOString(),
          sent_at: new Date().toISOString(),
          escalated_to_clinic: shouldEscalate,
          escalated_at: shouldEscalate ? new Date().toISOString() : null,
        })
        .eq('id', msg.id)

      sent++
    } catch (err: unknown) {
      await supabase
        .from('scheduled_messages')
        .update({ status: 'failed' })
        .eq('id', msg.id)
      console.error(`Failed to process message ${msg.id}:`, err)
      failed++
    }
  }

  return Response.json({ ok: true, processed: messages.length, sent, failed })
}

function buildUserPrompt(opts: {
  firstName: string
  treatmentType: string | undefined
  areasTreated: string[] | undefined
  treatedAt: string | undefined
  templateType: string
  templateInstructions: string | undefined
}): string {
  const { firstName, treatmentType, areasTreated, treatedAt, templateType, templateInstructions } = opts
  const label = treatmentType === 'toxin' ? 'Toxina Botulínica' : 'Filler Facial'
  const areas = areasTreated?.join(', ') ?? ''
  const context = `Paciente: ${firstName}\nTratamiento: ${label}${areas ? ` en ${areas}` : ''}\nFecha: ${treatedAt ? new Date(treatedAt).toLocaleDateString('es-AR') : 'reciente'}\nTipo de mensaje: ${templateType}`
  const instructions = templateInstructions ?? getDefaultInstructions(templateType)
  return `${context}\n\n${instructions}\n\nEscribí el mensaje de WhatsApp:`
}

function getDefaultInstructions(templateType: string): string {
  const map: Record<string, string> = {
    day0_welcome: 'Enviá un mensaje de bienvenida cálido post-tratamiento. Recordá los cuidados inmediatos más importantes. Deseale buena recuperación.',
    day3_checkin: 'Hacé un check-in a los 3 días. Preguntá cómo se siente y si tiene alguna duda.',
    day14_photo_request: 'Pedile que saque fotos de los resultados a los 14 días para documentar el progreso.',
    day30_progress: 'Celebrá los resultados al mes. Preguntá cómo se siente y si está pensando en el próximo tratamiento.',
    day90_reactivation: 'Recordá a la paciente que se aproxima el momento ideal para su próximo tratamiento.',
  }
  return map[templateType] ?? 'Enviá un mensaje de seguimiento amigable sobre su tratamiento.'
}

async function sendWhatsApp(toPhone: string, message: string) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log(`[WhatsApp simulation] To: ${toPhone}\n${message}`)
    return
  }
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM
  const body = new URLSearchParams({ From: `whatsapp:${from}`, To: `whatsapp:${toPhone}`, Body: message })
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
    },
    body: body.toString(),
  })
  if (!res.ok) throw new Error(`Twilio error: ${await res.text()}`)
}
