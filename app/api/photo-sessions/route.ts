import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'
import sharp from 'sharp'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const token = formData.get('token') as string | null
  const sessionType = formData.get('session_type') as 'pre' | 'post_14d' | 'post_30d' | null
  const photoFront = formData.get('photo_front') as File | null
  const photoContracted = formData.get('photo_contracted') as File | null
  const photo45 = formData.get('photo_45') as File | null
  const landmarksFrontRaw = formData.get('landmarks_front') as string | null
  const landmarksContractedRaw = formData.get('landmarks_contracted') as string | null
  const landmarks45Raw = formData.get('landmarks_45') as string | null
  const qualityScore = parseFloat((formData.get('alignment_quality_score') as string) ?? '0')

  if (!token || !sessionType) {
    return Response.json({ error: 'Missing token or session_type' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: captureToken } = await supabase
    .from('capture_tokens')
    .select('*')
    .eq('token', token)
    .eq('purpose', 'post_photo')
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!captureToken) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 403 })
  }

  async function uploadPhoto(file: File, suffix: string): Promise<string | null> {
    if (!file) return null
    try {
      const buffer = Buffer.from(await file.arrayBuffer())
      const normalized = await sharp(buffer)
        .rotate()
        .resize(1200, 1600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 88 })
        .toBuffer()

      const path = `${captureToken!.treatment_id}/${sessionType}/${suffix}-${Date.now()}.jpg`
      const { error } = await supabase.storage
        .from('treatment-photos')
        .upload(path, normalized, { contentType: 'image/jpeg', upsert: true })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage.from('treatment-photos').getPublicUrl(path)
      return publicUrl
    } catch {
      return null
    }
  }

  const [frontUrl, contractedUrl, url45] = await Promise.all([
    photoFront ? uploadPhoto(photoFront, 'front') : Promise.resolve(null),
    photoContracted ? uploadPhoto(photoContracted, 'contracted') : Promise.resolve(null),
    photo45 ? uploadPhoto(photo45, '45deg') : Promise.resolve(null),
  ])

  const { data: session, error } = await supabase
    .from('photo_sessions')
    .insert({
      treatment_id: captureToken.treatment_id,
      session_type: sessionType,
      photo_front_url: frontUrl,
      photo_contracted_url: contractedUrl,
      photo_45_url: url45,
      landmarks_front_json: landmarksFrontRaw ? JSON.parse(landmarksFrontRaw) : null,
      landmarks_contracted_json: landmarksContractedRaw ? JSON.parse(landmarksContractedRaw) : null,
      landmarks_45_json: landmarks45Raw ? JSON.parse(landmarks45Raw) : null,
      alignment_quality_score: qualityScore || null,
      captured_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Mark token as used if post session
  if (sessionType !== 'pre') {
    await supabase
      .from('capture_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', captureToken.id)
  }

  // Trigger comparison generation if we now have pre + any post
  const { data: allSessions } = await supabase
    .from('photo_sessions')
    .select('id, session_type')
    .eq('treatment_id', captureToken.treatment_id)

  const hasPreSession = allSessions?.some((s) => s.session_type === 'pre')
  const hasPostSession = allSessions?.some((s) => s.session_type !== 'pre')

  if (hasPreSession && hasPostSession) {
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/comparisons/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ treatmentId: captureToken.treatment_id }),
    }).catch(() => {})
  }

  return Response.json({ ok: true, session_id: session.id })
}
