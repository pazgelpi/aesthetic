import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createOAuth2Client } from '@/lib/google/client'
import { google } from 'googleapis'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/clinic?google=error`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login`)

  const admin = createAdminClient()
  const { data: professional } = await admin
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!professional) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/clinic?google=error`)
  }

  try {
    const oauth2 = createOAuth2Client()
    const { tokens } = await oauth2.getToken(code)
    oauth2.setCredentials(tokens)

    // Fetch the connected Google account email
    const oauth2Api = google.oauth2({ version: 'v2', auth: oauth2 })
    const { data: userInfo } = await oauth2Api.userinfo.get()
    const googleEmail = userInfo.email ?? null

    // oauth_credentials not in generated types yet — cast to bypass until types are regenerated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any).from('oauth_credentials').upsert({
      professional_id: professional.id,
      provider: 'google',
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token ?? null,
      expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      scopes: tokens.scope?.split(' ') ?? [],
      google_email: googleEmail,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'professional_id,provider' })

    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/clinic?google=connected`)
  } catch (err) {
    console.error('Google OAuth callback error:', err)
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/clinic?google=error`)
  }
}
