import { google } from 'googleapis'
import type { OAuth2Client } from 'google-auth-library'

interface TreatmentEventInput {
  patientFirstName: string
  treatmentType: string
  areasTreated: string[]
  treatedAt: string
  expectedReTreatmentAt: string | null
  notes?: string | null
}

function treatmentLabel(type: string) {
  return type === 'toxin' ? 'Toxina Botulínica' : type === 'filler' ? 'Filler Facial' : type
}

export async function createTreatmentEvents(
  auth: OAuth2Client,
  treatment: TreatmentEventInput,
): Promise<{ eventId: string | null; retreatmentEventId: string | null }> {
  const calendar = google.calendar({ version: 'v3', auth })
  const label = treatmentLabel(treatment.treatmentType)
  const areas = treatment.areasTreated?.join(', ')

  // Event 1 — treatment date
  const treatmentStart = new Date(treatment.treatedAt)
  const treatmentEnd = new Date(treatmentStart.getTime() + 60 * 60 * 1000)

  const { data: event1 } = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: `${label} · ${treatment.patientFirstName}`,
      description: [
        areas ? `Áreas: ${areas}` : null,
        treatment.notes ? `Notas: ${treatment.notes}` : null,
        'Creado automáticamente por Aesthetic IQ',
      ].filter(Boolean).join('\n'),
      start: { dateTime: treatmentStart.toISOString() },
      end: { dateTime: treatmentEnd.toISOString() },
      colorId: '3', // grape/violet
    },
  })

  // Event 2 — reminder 7 days before expected re-treatment
  let retreatmentEventId: string | null = null
  if (treatment.expectedReTreatmentAt) {
    const reminder = new Date(treatment.expectedReTreatmentAt)
    reminder.setDate(reminder.getDate() - 7)
    const reminderEnd = new Date(reminder.getTime() + 30 * 60 * 1000)

    const { data: event2 } = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `Retratamiento · ${treatment.patientFirstName} (recordatorio)`,
        description: `Recordatorio: retratamiento de ${label} en ~7 días.\nCreado automáticamente por Aesthetic IQ`,
        start: { dateTime: reminder.toISOString() },
        end: { dateTime: reminderEnd.toISOString() },
        colorId: '5', // banana/yellow
      },
    })
    retreatmentEventId = event2.id ?? null
  }

  return { eventId: event1.id ?? null, retreatmentEventId }
}

export async function deleteTreatmentEvents(
  auth: OAuth2Client,
  eventId: string | null,
  retreatmentEventId: string | null,
) {
  const calendar = google.calendar({ version: 'v3', auth })
  const deletes: Promise<unknown>[] = []
  if (eventId) deletes.push(calendar.events.delete({ calendarId: 'primary', eventId }).catch(() => {}))
  if (retreatmentEventId) deletes.push(calendar.events.delete({ calendarId: 'primary', eventId: retreatmentEventId }).catch(() => {}))
  await Promise.all(deletes)
}
