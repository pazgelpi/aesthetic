import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildClinicSystemPrompt } from '@/lib/ai/build-system-prompt'
import { PhotoSession } from '@/types/database'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { treatmentId } = await req.json()
  if (!treatmentId) return Response.json({ error: 'Missing treatmentId' }, { status: 400 })

  const supabase = createAdminClient()

  const { data: sessionsRaw } = await supabase
    .from('photo_sessions')
    .select('*')
    .eq('treatment_id', treatmentId)
    .order('captured_at')

  const sessions = (sessionsRaw ?? []) as PhotoSession[]
  if (sessions.length < 2) return Response.json({ error: 'Need at least 2 sessions' }, { status: 400 })

  const preSession = sessions.find((s) => s.session_type === 'pre')
  const postSession = sessions.filter((s) => s.session_type !== 'pre').pop()
  if (!preSession || !postSession) return Response.json({ error: 'Need pre and post sessions' }, { status: 400 })

  const { data: treatment } = await supabase
    .from('treatments')
    .select('id, clinic_id, patient_id, treatment_type, areas_treated, treated_at')
    .eq('id', treatmentId)
    .single()
  if (!treatment) return Response.json({ error: 'Treatment not found' }, { status: 404 })

  const { data: patient } = await supabase
    .from('patients')
    .select('id, first_name')
    .eq('id', treatment.patient_id)
    .single()

  const metrics = computeMetrics(preSession.landmarks_front_json, postSession.landmarks_front_json)
  const systemPrompt = await buildClinicSystemPrompt(treatment.clinic_id)

  const patientName = patient?.first_name ?? 'la paciente'
  const treatmentLabel = treatment.treatment_type === 'toxin' ? 'Toxina Botulínica' : 'Filler Facial'
  const areas = treatment.areas_treated.join(', ')
  const daysDiff = getDaysDiff(preSession.captured_at, postSession.captured_at)
  const metricsText = metrics
    ? Object.entries(metrics).map(([k, v]) => `${k}: ${Math.round((v as number) * 100) / 100}`).join(', ')
    : 'No hay métricas objetivas disponibles'

  const [patientRes, clinicRes] = await Promise.all([
    anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Escribí una síntesis de resultados cálida para la paciente ${patientName}.\nTratamiento: ${treatmentLabel} en ${areas}.\nTiempo: ${daysDiff} días.\nMétricas: ${metricsText}\n\nSé motivadora, 3-4 oraciones, sin tecnicismos.` }],
    }),
    anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Escribí una síntesis clínica objetiva.\nTratamiento: ${treatmentLabel} en ${areas}.\nTiempo: ${daysDiff} días.\nMétricas: ${metricsText}\n\n2-3 oraciones técnicas para el profesional.` }],
    }),
  ])

  const aiPatient = patientRes.content[0].type === 'text' ? patientRes.content[0].text : ''
  const aiClinic = clinicRes.content[0].type === 'text' ? clinicRes.content[0].text : ''

  await supabase.from('comparisons').delete().eq('treatment_id', treatmentId)

  const { data: comparison, error } = await supabase
    .from('comparisons')
    .insert({
      treatment_id: treatmentId,
      pre_session_id: preSession.id,
      post_session_id: postSession.id,
      metrics_json: metrics ?? {},
      ai_synthesis_patient: aiPatient,
      ai_synthesis_clinic: aiClinic,
      generated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true, comparison_id: comparison.id })
}

function getDaysDiff(from: string, to: string): number {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000)
}

function computeMetrics(preLandmarks: unknown, postLandmarks: unknown): Record<string, number> | null {
  if (!preLandmarks || !postLandmarks) return null
  try {
    const pre = preLandmarks as number[][]
    const post = postLandmarks as number[][]
    if (!Array.isArray(pre) || !Array.isArray(post)) return null

    const glabelaPre = getRegionIntensity(pre, [6, 8, 9])
    const glabelaPost = getRegionIntensity(post, [6, 8, 9])
    const frontalPre = getRegionIntensity(pre, [10, 151, 9])
    const frontalPost = getRegionIntensity(post, [10, 151, 9])
    const symPre = computeSymmetry(pre)
    const symPost = computeSymmetry(post)

    return {
      glabela_pre_intensity: glabelaPre,
      glabela_post_intensity: glabelaPost,
      glabela_change_pct: glabelaPre > 0 ? ((glabelaPost - glabelaPre) / glabelaPre) * 100 : 0,
      frontal_pre_intensity: frontalPre,
      frontal_post_intensity: frontalPost,
      frontal_change_pct: frontalPre > 0 ? ((frontalPost - frontalPre) / frontalPre) * 100 : 0,
      symmetry_score_pre: symPre,
      symmetry_score_post: symPost,
      symmetry_change: symPost - symPre,
      alignment_quality: 0.9,
    }
  } catch {
    return null
  }
}

function getRegionIntensity(landmarks: number[][], indices: number[]): number {
  const valid = indices.filter((i) => landmarks[i])
  if (!valid.length) return 0
  return valid.reduce((sum, i) => sum + Math.abs(landmarks[i][2] ?? 0), 0) / valid.length * 100
}

function computeSymmetry(landmarks: number[][]): number {
  const left = landmarks[234]
  const right = landmarks[454]
  if (!left || !right) return 0
  return Math.max(0, 100 - Math.abs((left[0] ?? 0) - (1 - (right[0] ?? 0))) * 1000)
}
