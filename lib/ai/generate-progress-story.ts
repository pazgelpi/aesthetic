import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export interface StoryInput {
  patientFirstName: string
  treatmentType: 'toxin' | 'filler'
  areasText: string
  daysSinceTreatment: number
  metricsJson: Record<string, unknown>
  aiSynthesisClinic: string
  clinicName: string
  pronoun: 'voseo' | 'tuteo' | 'usted'
  formality: 'formal' | 'casual' | 'friendly'
  signature?: string | null
}

export interface StoryOutput {
  title: string
  narrative: string
  highlightValue: string
  highlightLabel: string
  ctaText: string
}

export async function generateProgressStory(input: StoryInput): Promise<StoryOutput> {
  const {
    patientFirstName, treatmentType, areasText, daysSinceTreatment,
    metricsJson, aiSynthesisClinic, clinicName, pronoun, formality,
  } = input

  const pronStr = pronoun === 'voseo' ? 'vos/tenés' : pronoun === 'tuteo' ? 'tú/tienes' : 'usted/tiene'
  const formalStr = formality === 'formal' ? 'formal y profesional' : formality === 'casual' ? 'casual y cercano' : 'cálido y cercano como una amiga experta'

  // Extract best metric to highlight
  const overall = (metricsJson as Record<string, number>).overall_improvement_percent
  const highlight = overall ? { value: `${Math.round(overall)}%`, label: 'de mejora general' }
    : { value: `${daysSinceTreatment}`, label: 'días de evolución registrados' }

  const prompt = `Sos el asistente de ${clinicName}, una clínica de medicina estética premium. Tu tono es ${formalStr}, usando ${pronStr}.

Generá el contenido para la "Historia de Progreso" de ${patientFirstName}, una tarjeta visual que celebra su evolución post-tratamiento.

Datos del tratamiento:
- Tipo: ${treatmentType === 'toxin' ? 'Toxina Botulínica' : 'Filler Facial'}
- Áreas: ${areasText}
- Días desde el tratamiento: ${daysSinceTreatment}
- Evaluación clínica: ${aiSynthesisClinic}

Respondé SOLO con JSON válido, sin texto adicional:
{
  "title": "Título corto y poético (máx 6 palabras, puede usar el nombre)",
  "narrative": "3 oraciones emotivas y personales celebrando su transformación. Específicas sobre las áreas y el tiempo. Que la haga sentir vista y especial.",
  "ctaText": "Frase corta de cierre motivacional para volver (máx 8 palabras)"
}`

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (response.content[0] as { type: string; text: string }).text.trim()
    const json = JSON.parse(text.replace(/^```json?\n?/, '').replace(/\n?```$/, ''))

    return {
      title: json.title ?? `Tu historia, ${patientFirstName}`,
      narrative: json.narrative ?? aiSynthesisClinic,
      highlightValue: highlight.value,
      highlightLabel: highlight.label,
      ctaText: json.ctaText ?? 'Tu próximo tratamiento te espera.',
    }
  } catch {
    return {
      title: `Tu evolución, ${patientFirstName}`,
      narrative: aiSynthesisClinic,
      highlightValue: highlight.value,
      highlightLabel: highlight.label,
      ctaText: 'Cada sesión es una inversión en vos.',
    }
  }
}
