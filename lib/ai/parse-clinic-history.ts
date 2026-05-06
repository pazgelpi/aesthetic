import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export interface ExtractedPatient {
  temp_id: string
  full_name: string
  first_name: string
  phone: string | null
  confidence: 'high' | 'medium' | 'low'
}

export interface ExtractedTreatment {
  patient_temp_id: string
  treatment_type: 'toxin' | 'filler' | 'unknown'
  areas_treated: string[]
  treated_at: string
  notes: string | null
  confidence: 'high' | 'medium' | 'low'
  date_approximate: boolean
}

export interface ParsedHistoryResult {
  patients: ExtractedPatient[]
  treatments: ExtractedTreatment[]
  source_file: string
}

export async function parseClinicHistory(text: string, sourceFile: string): Promise<ParsedHistoryResult> {
  const chunk = text.slice(0, 60000)

  const prompt = `Analizá el siguiente texto de una clínica de medicina estética y extraé toda la información de pacientes y tratamientos.

TEXTO:
---
${chunk}
---

INSTRUCCIONES:
- Extraé todos los pacientes mencionados (nombres, teléfonos si aparecen)
- Para cada paciente, extraé todos los tratamientos realizados
- Clasificá el tipo de tratamiento:
  - "toxin": toxina botulínica, bótox, botox, botulinum, neurotoxina, dysport
  - "filler": filler, ácido hialurónico, AH, relleno, volumen, labios relleno, pómulos relleno
  - "unknown": si no se puede determinar el tipo exacto
- Áreas frecuentes: frente, entrecejo, patas de gallo, labios, pómulos, ojeras, nasogeniano, mentón, cuello, masseter, nariz
- Para las fechas: usá el formato YYYY-MM-DD si hay día exacto, o YYYY-MM si solo hay mes. Si no hay fecha, usá la fecha del año más probable según el contexto.
- Asigná confidence "high" si los datos son claros y explícitos, "medium" si hay inferencia moderada, "low" si es muy incierto

Respondé SOLO con JSON válido, sin texto adicional:
{
  "patients": [
    {
      "temp_id": "p1",
      "full_name": "nombre completo",
      "first_name": "primer nombre",
      "phone": "número o null",
      "confidence": "high"
    }
  ],
  "treatments": [
    {
      "patient_temp_id": "p1",
      "treatment_type": "toxin",
      "areas_treated": ["frente", "entrecejo"],
      "treated_at": "2024-03-15",
      "notes": null,
      "confidence": "high",
      "date_approximate": false
    }
  ]
}`

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = (response.content[0] as { type: string; text: string }).text.trim()
    const json = JSON.parse(raw.replace(/^```json?\n?/, '').replace(/\n?```$/, ''))

    return {
      patients: (json.patients ?? []).map((p: ExtractedPatient, i: number) => ({
        ...p,
        temp_id: p.temp_id ?? `p${i + 1}`,
      })),
      treatments: json.treatments ?? [],
      source_file: sourceFile,
    }
  } catch {
    return { patients: [], treatments: [], source_file: sourceFile }
  }
}
