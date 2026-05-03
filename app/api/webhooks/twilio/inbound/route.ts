import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildClinicSystemPrompt } from '@/lib/ai/build-system-prompt'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const from = (formData.get('From') as string | null)?.replace('whatsapp:', '') ?? ''
  const body = (formData.get('Body') as string) ?? ''

  if (!from || !body) {
    return new Response('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
  }

  const supabase = createAdminClient()

  // Find patient by phone
  const { data: patient } = await supabase
    .from('patients')
    .select('id, clinic_id, first_name')
    .eq('phone_e164', from)
    .single()

  if (!patient) {
    return new Response('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
  }

  // Log the response on the most recent sent message for this patient
  const { data: lastMessage } = await supabase
    .from('scheduled_messages')
    .select('id')
    .eq('patient_id', patient.id)
    .eq('status', 'sent')
    .is('patient_response', null)
    .order('sent_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (lastMessage) {
    await supabase
      .from('scheduled_messages')
      .update({
        patient_response: body,
        patient_responded_at: new Date().toISOString(),
      })
      .eq('id', lastMessage.id)
  }

  // Log adherence
  await supabase.from('adherence_logs').insert({
    patient_id: patient.id,
    clinic_id: patient.clinic_id,
    logged_at: new Date().toISOString(),
  })

  // Generate AI reply
  const systemPrompt = await buildClinicSystemPrompt(patient.clinic_id)

  const replyPrompt = `La paciente ${patient.first_name} respondió al mensaje de WhatsApp de la clínica:

"${body}"

Respondé su mensaje de forma apropiada. Si hay alguna queja médica o síntoma inusual, comenzá con "ESCALAR" en la primera línea.`

  let replyText = ''
  let shouldEscalate = false

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: replyPrompt }],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    shouldEscalate = raw.startsWith('ESCALAR')
    replyText = shouldEscalate ? raw.replace(/^ESCALAR\s*\n?/, '') : raw

    if (shouldEscalate) {
      await supabase.from('scheduled_messages').insert({
        clinic_id: patient.clinic_id,
        patient_id: patient.id,
        treatment_id: null,
        template_type: 'escalation',
        scheduled_for: new Date().toISOString(),
        generated_message: `Escalación automática — ${patient.first_name} respondió: "${body}"`,
        generated_at: new Date().toISOString(),
        status: 'sent',
        sent_at: new Date().toISOString(),
        escalated_to_clinic: true,
        escalated_at: new Date().toISOString(),
      })
    }
  } catch {
    replyText = `Gracias por tu mensaje, ${patient.first_name}. Lo hemos recibido y nos pondremos en contacto contigo a la brevedad.`
  }

  // Respond via TwiML
  const twiml = `<Response><Message>${escapeXml(replyText)}</Message></Response>`
  return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } })
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
