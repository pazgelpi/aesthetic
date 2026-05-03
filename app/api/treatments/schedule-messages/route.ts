import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'
import { addDays } from 'date-fns'

const TEMPLATES = [
  { template_type: 'day0_welcome', offset_days: 0 },
  { template_type: 'day3_checkin', offset_days: 3 },
  { template_type: 'day14_photo_request', offset_days: 14 },
  { template_type: 'day30_progress', offset_days: 30 },
  { template_type: 'day90_reactivation', offset_days: 90 },
]

export async function POST(req: NextRequest) {
  const { treatmentId } = await req.json()
  if (!treatmentId) return Response.json({ error: 'Missing treatmentId' }, { status: 400 })

  const supabase = createAdminClient()

  const { data: treatment } = await supabase
    .from('treatments')
    .select('id, clinic_id, patient_id, treated_at')
    .eq('id', treatmentId)
    .single()

  if (!treatment) return Response.json({ error: 'Treatment not found' }, { status: 404 })

  const treatedAt = new Date(treatment.treated_at)

  const rows = TEMPLATES.map(({ template_type, offset_days }) => ({
    clinic_id: treatment.clinic_id,
    patient_id: treatment.patient_id,
    treatment_id: treatmentId,
    template_type,
    scheduled_for: addDays(treatedAt, offset_days).toISOString(),
    status: 'scheduled' as const,
    escalated_to_clinic: false,
  }))

  const { error } = await supabase.from('scheduled_messages').insert(rows)
  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ ok: true, scheduled: rows.length })
}
