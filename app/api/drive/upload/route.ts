import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getGoogleClient } from '@/lib/google/client'
import { uploadUrlToDrive } from '@/lib/google/drive'
import { NextRequest } from 'next/server'

function treatmentLabel(type: string) {
  return type === 'toxin' ? 'Toxina Botulínica' : type === 'filler' ? 'Filler Facial' : type
}

/**
 * POST /api/drive/upload
 * Body: { treatmentId, type: 'photos' | 'story' }
 *
 * Uploads photos or the progress story image to Google Drive
 * under: Aesthetic IQ / {patient} / {treatment — date} / pre|post|historia
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: professional } = await admin
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!professional) return Response.json({ error: 'Professional not found' }, { status: 404 })

  const body = await req.json() as { treatmentId: string; type: 'photos' | 'story' }
  const { treatmentId, type } = body

  const { data: treatment } = await admin
    .from('treatments')
    .select('id, treatment_type, treated_at, patient_id')
    .eq('id', treatmentId)
    .single()
  if (!treatment) return Response.json({ error: 'Treatment not found' }, { status: 404 })

  const { data: patient } = await admin
    .from('patients')
    .select('full_name')
    .eq('id', treatment.patient_id)
    .single()

  const base = {
    patientName: patient?.full_name ?? 'Paciente',
    treatmentLabel: treatmentLabel(treatment.treatment_type),
    treatedAt: treatment.treated_at,
  }

  try {
    const auth = await getGoogleClient(professional.id)
    const results: { fileName: string; webViewLink: string }[] = []

    if (type === 'photos') {
      const { data: sessions } = await admin
        .from('photo_sessions')
        .select('session_type, photo_front_url, photo_45_url, photo_contracted_url')
        .eq('treatment_id', treatmentId)

      for (const session of sessions ?? []) {
        const subfolder = session.session_type === 'pre' ? 'pre' : 'post'
        const photoMap = [
          { url: session.photo_front_url, name: 'frente.jpg' },
          { url: session.photo_45_url, name: '45-grados.jpg' },
          { url: session.photo_contracted_url, name: 'contraido.jpg' },
        ]
        for (const { url, name } of photoMap) {
          if (!url) continue
          const { webViewLink } = await uploadUrlToDrive(auth, {
            ...base,
            fileName: name,
            sourceUrl: url,
            mimeType: 'image/jpeg',
            subfolder,
          })
          results.push({ fileName: name, webViewLink })
        }
      }
    } else if (type === 'story') {
      const { data: comparison } = await admin
        .from('comparisons')
        .select('shareable_image_url')
        .eq('treatment_id', treatmentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!comparison?.shareable_image_url) {
        return Response.json({ error: 'No story image available' }, { status: 404 })
      }
      const { webViewLink } = await uploadUrlToDrive(auth, {
        ...base,
        fileName: 'historia_de_progreso.png',
        sourceUrl: comparison.shareable_image_url,
        mimeType: 'image/png',
        subfolder: 'historia',
      })
      results.push({ fileName: 'historia_de_progreso.png', webViewLink })
    }

    return Response.json({ ok: true, uploaded: results.length, files: results })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('not connected')) {
      return Response.json({ error: 'Google account not connected' }, { status: 400 })
    }
    console.error('Drive upload error:', err)
    return Response.json({ error: 'Drive upload failed' }, { status: 500 })
  }
}
