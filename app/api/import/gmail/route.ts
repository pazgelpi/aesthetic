import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getGoogleClient } from '@/lib/google/client'
import { searchThreads } from '@/lib/google/gmail'
import { parseClinicHistory } from '@/lib/ai/parse-clinic-history'
import { NextRequest } from 'next/server'

const GMAIL_QUERY =
  '(tratamiento OR toxina OR filler OR botox OR consulta OR paciente OR "medicina estética") newer_than:2y'

/**
 * GET /api/import/gmail
 * Searches Gmail for clinical threads, parses them with AI,
 * returns same shape as /api/import/parse
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: professional } = await admin
    .from('professionals')
    .select('id, clinic_id')
    .eq('user_id', user.id)
    .single()
  if (!professional) return Response.json({ error: 'Professional not found' }, { status: 404 })

  try {
    const auth = await getGoogleClient(professional.id)

    const maxResults = Number(req.nextUrl.searchParams.get('max') ?? '20')
    const threads = await searchThreads(auth, GMAIL_QUERY, Math.min(maxResults, 50))

    if (threads.length === 0) {
      return Response.json({ patients: [], treatments: [], source: 'gmail', threadsScanned: 0 })
    }

    // Combine all thread bodies into one text blob for the AI parser
    const combinedText = threads
      .map((t, i) => `--- Email ${i + 1} ---\n${t.snippet}\n${t.body}`)
      .join('\n\n')

    const { patients, treatments } = await parseClinicHistory(combinedText, 'Gmail')

    // Re-index temp IDs (same approach as /api/import/parse)
    const offset = 0
    const indexedPatients = patients.map((p, i) => ({ ...p, temp_id: `g_${offset + i}` }))
    const idMap = new Map(patients.map((p, i) => [p.temp_id, `g_${offset + i}`]))
    const indexedTreatments = treatments.map((t) => ({
      ...t,
      patient_temp_id: idMap.get(t.patient_temp_id) ?? t.patient_temp_id,
    }))

    return Response.json({
      patients: indexedPatients,
      treatments: indexedTreatments,
      source: 'gmail',
      threadsScanned: threads.length,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('not connected')) {
      return Response.json({ error: 'Google account not connected' }, { status: 400 })
    }
    console.error('Gmail import error:', err)
    return Response.json({ error: 'Gmail import failed' }, { status: 500 })
  }
}
