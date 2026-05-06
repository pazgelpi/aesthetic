import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import { ExtractedPatient, ExtractedTreatment } from '@/lib/ai/parse-clinic-history'

interface ConfirmBody {
  clinicId: string
  patients: (ExtractedPatient & { include: boolean })[]
  treatments: ExtractedTreatment[]
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { clinicId, patients, treatments }: ConfirmBody = await req.json()

  // Verify user belongs to this clinic
  const { data: professional } = await supabase
    .from('professionals')
    .select('id, clinic_id')
    .eq('user_id', user.id)
    .single()
  if (!professional || professional.clinic_id !== clinicId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  const professionalId = professional.id

  // Fetch existing patients for deduplication
  const { data: existingPatients } = await supabase
    .from('patients')
    .select('id, full_name')
    .eq('clinic_id', clinicId)

  const existingByName = new Map<string, string>(
    (existingPatients ?? []).map((p) => [normalizeNameKey(p.full_name), p.id])
  )

  // Map temp_id → actual patient_id
  const patientIdMap = new Map<string, string>()
  let patientsCreated = 0

  const included = patients.filter((p) => p.include)
  for (const p of included) {
    const key = normalizeNameKey(p.full_name)
    const existingId = existingByName.get(key)
    if (existingId) {
      patientIdMap.set(p.temp_id, existingId)
      continue
    }

    const { data: inserted } = await supabase
      .from('patients')
      .insert({
        clinic_id: clinicId,
        full_name: p.full_name,
        first_name: p.first_name,
        phone_e164: p.phone ?? '',
        status: 'active',
      })
      .select('id')
      .single()

    if (inserted) {
      patientIdMap.set(p.temp_id, inserted.id)
      existingByName.set(key, inserted.id)
      patientsCreated++
    }
  }

  // Insert treatments for included patients, skip unknowns and bad dates
  let treatmentsCreated = 0
  const includedTempIds = new Set(included.map((p) => p.temp_id))

  for (const t of treatments) {
    if (!includedTempIds.has(t.patient_temp_id)) continue
    if (t.treatment_type === 'unknown') continue

    const patientId = patientIdMap.get(t.patient_temp_id)
    if (!patientId) continue

    const treatedAt = parseDate(t.treated_at)
    if (!treatedAt) continue

    await supabase.from('treatments').insert({
      clinic_id: clinicId,
      patient_id: patientId,
      professional_id: professionalId,
      treatment_type: t.treatment_type,
      areas_treated: t.areas_treated,
      treated_at: treatedAt,
      notes: t.notes ?? undefined,
    })
    treatmentsCreated++
  }

  return Response.json({ ok: true, patients_created: patientsCreated, treatments_created: treatmentsCreated })
}

function normalizeNameKey(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ')
}

function parseDate(raw: string): string | null {
  if (!raw) return null
  // Full date YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  // Year-month YYYY-MM → use first of month
  if (/^\d{4}-\d{2}$/.test(raw)) return `${raw}-01`
  // Year only
  if (/^\d{4}$/.test(raw)) return `${raw}-01-01`
  // Try native parse as fallback
  const d = new Date(raw)
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
  return null
}
