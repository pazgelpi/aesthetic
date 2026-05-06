/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getGoogleClient } from '@/lib/google/client'
import { createTreatmentEvents, deleteTreatmentEvents } from '@/lib/google/calendar'
import { NextRequest } from 'next/server'

// google_calendar_* columns added by migration — not in generated types yet
interface TreatmentRow {
  id: string
  treatment_type: string
  areas_treated: string[] | null
  treated_at: string
  expected_re_treatment_at: string | null
  notes: string | null
  patient_id: string
  google_calendar_event_id: string | null
  google_calendar_retreatment_event_id: string | null
}

// POST — create or update calendar events
export async function POST(req: NextRequest, { params }: { params: Promise<{ treatmentId: string }> }) {
  const { treatmentId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const db = admin as any // bypass outdated type snapshot

  const { data: professional } = await admin
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!professional) return Response.json({ error: 'Professional not found' }, { status: 404 })

  const { data: treatment }: { data: TreatmentRow | null } = await db
    .from('treatments')
    .select('id, treatment_type, areas_treated, treated_at, expected_re_treatment_at, notes, patient_id, google_calendar_event_id, google_calendar_retreatment_event_id')
    .eq('id', treatmentId)
    .single()
  if (!treatment) return Response.json({ error: 'Treatment not found' }, { status: 404 })

  const { data: patient } = await admin
    .from('patients')
    .select('first_name, full_name')
    .eq('id', treatment.patient_id)
    .single()

  try {
    const auth = await getGoogleClient(professional.id)

    if (treatment.google_calendar_event_id || treatment.google_calendar_retreatment_event_id) {
      await deleteTreatmentEvents(auth, treatment.google_calendar_event_id, treatment.google_calendar_retreatment_event_id)
    }

    const { eventId, retreatmentEventId } = await createTreatmentEvents(auth, {
      patientFirstName: patient?.first_name ?? patient?.full_name ?? 'Paciente',
      treatmentType: treatment.treatment_type,
      areasTreated: treatment.areas_treated ?? [],
      treatedAt: treatment.treated_at,
      expectedReTreatmentAt: treatment.expected_re_treatment_at,
      notes: treatment.notes,
    })

    await db.from('treatments')
      .update({ google_calendar_event_id: eventId, google_calendar_retreatment_event_id: retreatmentEventId })
      .eq('id', treatmentId)

    return Response.json({ ok: true, eventId, retreatmentEventId })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('not connected')) return Response.json({ error: 'Google account not connected' }, { status: 400 })
    console.error('Calendar sync error:', err)
    return Response.json({ error: 'Calendar sync failed' }, { status: 500 })
  }
}

// DELETE — remove calendar events
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ treatmentId: string }> }) {
  const { treatmentId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const db = admin as any

  const { data: professional } = await admin
    .from('professionals').select('id').eq('user_id', user.id).single()

  const { data: treatment }: { data: Pick<TreatmentRow, 'google_calendar_event_id' | 'google_calendar_retreatment_event_id'> | null } = await db
    .from('treatments')
    .select('google_calendar_event_id, google_calendar_retreatment_event_id')
    .eq('id', treatmentId)
    .single()

  if (!treatment || !professional) return Response.json({ ok: true })

  try {
    const auth = await getGoogleClient(professional.id)
    await deleteTreatmentEvents(auth, treatment.google_calendar_event_id, treatment.google_calendar_retreatment_event_id)
  } catch { /* best effort */ }

  await db.from('treatments')
    .update({ google_calendar_event_id: null, google_calendar_retreatment_event_id: null })
    .eq('id', treatmentId)

  return Response.json({ ok: true })
}
