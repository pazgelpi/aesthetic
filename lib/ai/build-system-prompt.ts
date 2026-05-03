import { createAdminClient } from '@/lib/supabase/admin'

export async function buildClinicSystemPrompt(clinicId: string): Promise<string> {
  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('clinic_profiles')
    .select('*')
    .eq('clinic_id', clinicId)
    .single()

  const { data: clinic } = await supabase
    .from('clinics')
    .select('name, city')
    .eq('id', clinicId)
    .single()

  if (!profile || !clinic) return defaultPrompt()

  const pronoun = profile.pronoun_usage === 'voseo' ? 'voseo (vos/tenés/podés)' :
    profile.pronoun_usage === 'tuteo' ? 'tuteo (tú/tienes/puedes)' : 'usted'

  const formality = profile.formality_level === 'formal' ? 'formal y profesional' :
    profile.formality_level === 'casual' ? 'casual y cercano' : 'amigable y cálido'

  const emoji = profile.emoji_usage === 'none' ? 'No uses emojis.' :
    profile.emoji_usage === 'minimal' ? 'Usá 1-2 emojis por mensaje, solo si es natural.' :
    'Podés usar emojis con moderación para dar calidez.'

  const voiceSamples = [profile.voice_sample_1, profile.voice_sample_2, profile.voice_sample_3]
    .filter(Boolean)
    .map((s, i) => `Ejemplo ${i + 1}: "${s}"`)
    .join('\n')

  const signature = profile.signature_template
    ? `\nFirmá los mensajes con esta plantilla: ${profile.signature_template}`
    : ''

  const knowledge = profile.knowledge_base_text
    ? `\n\n## Base de conocimiento de la clínica\n${profile.knowledge_base_text.slice(0, 8000)}`
    : ''

  return `Sos el asistente de WhatsApp de ${clinic.name}${clinic.city ? `, en ${clinic.city}` : ''}, especializada en medicina estética premium.

## Tono y voz
- Usá ${pronoun} para dirigirte a la paciente
- Tu estilo es ${formality}
- ${emoji}

## Ejemplos de voz de la clínica
${voiceSamples || 'Sé cálida, empática y profesional.'}
${signature}

## Instrucciones generales
- Respondé siempre en español argentino
- Si la paciente tiene una queja médica, síntoma inusual o pregunta compleja, escalá inmediatamente: responde con "ESCALAR" en la primera línea, luego el mensaje para la paciente
- No inventes información médica que no tenés
- Los mensajes deben ser cortos (máx 5 oraciones) a menos que se pida explícitamente algo más largo
- Nunca prometás resultados específicos${knowledge}`
}

function defaultPrompt(): string {
  return `Sos el asistente de WhatsApp de una clínica de medicina estética premium.
Respondé siempre en español argentino, con tono cálido y profesional.
Si hay una queja médica o síntoma inusual, respondé con "ESCALAR" en la primera línea.`
}
