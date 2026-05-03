import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildClinicSystemPrompt } from '@/lib/ai/build-system-prompt'
import { addMonths } from 'date-fns'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { patientId, clinicId } = await req.json()
  if (!patientId || !clinicId) return Response.json({ error: 'Missing params' }, { status: 400 })

  const supabase = createAdminClient()

  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single()

  if (!patient) return Response.json({ error: 'Patient not found' }, { status: 404 })

  const { data: treatments } = await supabase
    .from('treatments')
    .select('*')
    .eq('patient_id', patientId)
    .order('treated_at', { ascending: false })
    .limit(10)

  const systemPrompt = await buildClinicSystemPrompt(clinicId)

  const treatmentSummary = (treatments ?? [])
    .map((t) => `- ${new Date(t.treated_at).toLocaleDateString('es-AR')}: ${t.treatment_type === 'toxin' ? 'Toxina' : 'Filler'} en ${t.areas_treated.join(', ')}${t.product_brand ? ` (${t.product_brand})` : ''}`)
    .join('\n')

  const prompt = `Generá 3 recomendaciones personalizadas para la paciente ${patient.first_name}.

Historial de tratamientos:
${treatmentSummary || 'Sin tratamientos previos'}

Notas sobre la paciente: ${patient.notes ?? 'Ninguna'}

Generá exactamente 3 recomendaciones en formato JSON array:
[
  {
    "recommendation_type": "next_treatment" | "product" | "home_care" | "lifestyle",
    "title": "Título corto",
    "description": "Descripción de 1-2 oraciones para la paciente",
    "rationale": "Razón clínica interna (solo para el profesional)"
  }
]

Devolvé SOLO el JSON, sin texto adicional.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : '[]'
    const parsed = JSON.parse(raw) as Array<{
      recommendation_type: string
      title: string
      description: string
      rationale: string
    }>

    if (!Array.isArray(parsed)) throw new Error('Invalid response format')

    const lastTreatment = treatments?.[0]
    const expiresAt = addMonths(new Date(), 3).toISOString()

    const rows = parsed.map((r) => ({
      patient_id: patientId,
      clinic_id: clinicId,
      treatment_id: lastTreatment?.id ?? null,
      recommendation_type: r.recommendation_type as 'next_treatment' | 'product' | 'home_care' | 'lifestyle',
      title: r.title,
      description: r.description,
      rationale: r.rationale ?? null,
      suggested_at: new Date().toISOString(),
      expires_at: expiresAt,
      status: 'active' as const,
    }))

    await supabase
      .from('recommendations')
      .update({ status: 'dismissed' })
      .eq('patient_id', patientId)
      .eq('status', 'active')

    const { error } = await supabase.from('recommendations').insert(rows)
    if (error) throw error

    return Response.json({ ok: true, count: rows.length })
  } catch (err: unknown) {
    return Response.json({ error: (err as Error).message }, { status: 500 })
  }
}
