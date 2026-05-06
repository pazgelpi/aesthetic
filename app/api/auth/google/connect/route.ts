import { createClient } from '@/lib/supabase/server'
import { createOAuth2Client, GOOGLE_SCOPES } from '@/lib/google/client'
import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const oauth2 = createOAuth2Client()

  // Store a random state to prevent CSRF — we embed the user id so callback can verify
  const state = Buffer.from(JSON.stringify({ userId: user.id, ts: Date.now() })).toString('base64url')

  const url = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: GOOGLE_SCOPES,
    prompt: 'consent', // force refresh_token on every connect
    state,
  })

  redirect(url)
}
