import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createOAuth2Client } from '@/lib/google/client'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: professional } = await admin
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!professional) return Response.json({ error: 'Not found' }, { status: 404 })

  // oauth_credentials not in generated types yet
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const oauthTable = (admin as any).from('oauth_credentials')

  // Fetch token to revoke it with Google
  const { data: cred } = await oauthTable
    .select('access_token')
    .eq('professional_id', professional.id)
    .eq('provider', 'google')
    .maybeSingle() as { data: { access_token: string } | null }

  if (cred?.access_token) {
    try {
      const oauth2 = createOAuth2Client()
      await oauth2.revokeToken(cred.access_token)
    } catch {
      // Ignore revocation errors — token may already be expired
    }
  }

  await oauthTable
    .delete()
    .eq('professional_id', professional.id)
    .eq('provider', 'google')

  return Response.json({ ok: true })
}
