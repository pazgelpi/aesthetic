import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data: captureToken } = await supabase
    .from('capture_tokens')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!captureToken) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 403 })
  }

  const [treatmentRes, patientRes, sessionsRes, comparisonRes, recommendationsRes, protocolRes] =
    await Promise.all([
      supabase.from('treatments').select('*').eq('id', captureToken.treatment_id).single(),
      supabase.from('patients').select('id, first_name, full_name').eq('id', captureToken.patient_id).single(),
      supabase.from('photo_sessions').select('*').eq('treatment_id', captureToken.treatment_id).order('captured_at'),
      supabase
        .from('comparisons')
        .select('*')
        .eq('treatment_id', captureToken.treatment_id)
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('recommendations')
        .select('*')
        .eq('patient_id', captureToken.patient_id)
        .eq('status', 'active')
        .order('suggested_at', { ascending: false })
        .limit(5),
      supabase
        .from('clinic_protocols')
        .select('*')
        .eq('clinic_id', (await supabase.from('treatments').select('clinic_id').eq('id', captureToken.treatment_id).single()).data?.clinic_id ?? '')
        .maybeSingle(),
    ])

  return Response.json({
    token: captureToken,
    treatment: treatmentRes.data,
    patient: patientRes.data,
    photoSessions: sessionsRes.data ?? [],
    comparison: comparisonRes.data,
    recommendations: recommendationsRes.data ?? [],
    protocol: protocolRes.data,
  })
}
