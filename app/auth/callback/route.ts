import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if clinic + professional records exist
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: professional } = await supabase
          .from('professionals')
          .select('id, clinic_id')
          .eq('user_id', user.id)
          .single()

        if (!professional) {
          // New user — send to onboarding
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        // Check if wizard was completed
        const { data: profile } = await supabase
          .from('clinic_profiles')
          .select('wizard_completed_at')
          .eq('clinic_id', professional.clinic_id)
          .single()

        if (!profile?.wizard_completed_at) {
          return NextResponse.redirect(`${origin}/settings/clinic`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}
