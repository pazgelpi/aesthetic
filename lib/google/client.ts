import { google } from 'googleapis'
import { createAdminClient } from '@/lib/supabase/admin'

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
]

export function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
  )
}

// oauth_credentials is not in the generated Supabase types yet.
// This helper encapsulates all access to avoid spreading type casts everywhere.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function oauthTable(supabase: ReturnType<typeof createAdminClient>): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('oauth_credentials')
}

interface OAuthCred {
  access_token: string
  refresh_token: string | null
  expires_at: string | null
  google_email?: string | null
  scopes?: string[]
}

export async function getGoogleClient(professionalId: string) {
  const supabase = createAdminClient()

  const { data: cred } = await oauthTable(supabase)
    .select('access_token, refresh_token, expires_at')
    .eq('professional_id', professionalId)
    .eq('provider', 'google')
    .single() as { data: OAuthCred | null }

  if (!cred) throw new Error('Google account not connected')

  const oauth2 = createOAuth2Client()
  oauth2.setCredentials({
    access_token: cred.access_token,
    refresh_token: cred.refresh_token,
    expiry_date: cred.expires_at ? new Date(cred.expires_at).getTime() : undefined,
  })

  // Auto-refresh if token expires within 5 minutes
  const expiresAt = cred.expires_at ? new Date(cred.expires_at).getTime() : 0
  if (expiresAt < Date.now() + 5 * 60 * 1000) {
    const { credentials } = await oauth2.refreshAccessToken()
    oauth2.setCredentials(credentials)

    await oauthTable(supabase)
      .update({
        access_token: credentials.access_token!,
        expires_at: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('professional_id', professionalId)
      .eq('provider', 'google')
  }

  return oauth2
}

export async function getGoogleCredential(professionalId: string) {
  const supabase = createAdminClient()
  const { data } = await oauthTable(supabase)
    .select('google_email, scopes, created_at')
    .eq('professional_id', professionalId)
    .eq('provider', 'google')
    .maybeSingle() as { data: OAuthCred | null }
  return data
}
