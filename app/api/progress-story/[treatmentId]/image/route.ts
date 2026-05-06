import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import { generateProgressStory } from '@/lib/ai/generate-progress-story'
import { differenceInDays } from 'date-fns'
import { createElement as h } from 'react'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ treatmentId: string }> }
) {
  const { treatmentId } = await params
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return new Response('Missing token', { status: 401 })

  const supabase = createAdminClient()

  const { data: captureToken } = await supabase
    .from('capture_tokens')
    .select('treatment_id, patient_id')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!captureToken || captureToken.treatment_id !== treatmentId) {
    return new Response('Invalid or expired token', { status: 403 })
  }

  const [treatmentRes, comparisonRes, patientRes] = await Promise.all([
    supabase.from('treatments').select('treatment_type, areas_treated, treated_at, clinic_id').eq('id', treatmentId).single(),
    supabase.from('comparisons').select('metrics_json, ai_synthesis_clinic').eq('treatment_id', treatmentId).order('generated_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('patients').select('first_name').eq('id', captureToken.patient_id).single(),
  ])

  if (!treatmentRes.data || !comparisonRes.data) {
    return new Response('No comparison available', { status: 404 })
  }

  const clinicId = treatmentRes.data.clinic_id
  const [clinicRes, profileRes] = await Promise.all([
    supabase.from('clinics').select('name').eq('id', clinicId).single(),
    supabase.from('clinic_profiles').select('pronoun_usage, formality_level, signature_template').eq('clinic_id', clinicId).maybeSingle(),
  ])

  const story = await generateProgressStory({
    patientFirstName: patientRes.data?.first_name ?? 'Paciente',
    treatmentType: treatmentRes.data.treatment_type as 'toxin' | 'filler',
    areasText: treatmentRes.data.areas_treated.join(', '),
    daysSinceTreatment: differenceInDays(new Date(), new Date(treatmentRes.data.treated_at)),
    metricsJson: comparisonRes.data.metrics_json as Record<string, unknown>,
    aiSynthesisClinic: comparisonRes.data.ai_synthesis_clinic,
    clinicName: clinicRes.data?.name ?? 'Tu clínica',
    pronoun: profileRes.data?.pronoun_usage ?? 'tuteo',
    formality: profileRes.data?.formality_level ?? 'friendly',
    signature: profileRes.data?.signature_template ?? null,
  })

  const clinicName = clinicRes.data?.name ?? 'Aesthetic IQ'

  const image = h(
    'div',
    {
      style: {
        width: '1080px',
        height: '1350px',
        background: 'linear-gradient(160deg, #18142a 0%, #2d1b4e 60%, #1a0e2e 100%)',
        display: 'flex',
        flexDirection: 'column' as const,
        padding: '72px',
        fontFamily: 'sans-serif',
      },
    },
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '80px',
        },
      },
      h('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '28px', letterSpacing: '0.05em', textTransform: 'uppercase' as const } }, clinicName),
      h('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '24px' } }, '✶')
    ),
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '56px' } },
      h('span', { style: { fontSize: '44px' } }, '✨'),
      h('span', { style: { color: '#ffffff', fontSize: '52px', fontWeight: 700, lineHeight: 1.2 } }, story.title)
    ),
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '64px' } },
      h(
        'div',
        {
          style: {
            background: '#7c3aed',
            borderRadius: '20px',
            padding: '20px 36px',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
          },
        },
        h('span', { style: { color: '#ffffff', fontSize: '64px', fontWeight: 800, lineHeight: 1 } }, story.highlightValue)
      ),
      h('span', { style: { color: 'rgba(255,255,255,0.7)', fontSize: '32px', maxWidth: '300px', lineHeight: 1.3 } }, story.highlightLabel)
    ),
    h(
      'div',
      { style: { color: 'rgba(255,255,255,0.85)', fontSize: '34px', lineHeight: 1.7, flex: 1, display: 'flex', alignItems: 'flex-start' } },
      story.narrative
    ),
    h('div', { style: { height: '1px', background: 'rgba(255,255,255,0.15)', margin: '48px 0' } }),
    h('div', { style: { color: 'rgba(255,255,255,0.55)', fontSize: '30px', fontStyle: 'italic', marginBottom: '48px' } }, `"${story.ctaText}"`),
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
      h('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '24px' } }, `Aesthetic IQ · ${clinicName}`),
      h(
        'div',
        {
          style: {
            background: 'rgba(124,58,237,0.3)',
            border: '1px solid rgba(124,58,237,0.5)',
            borderRadius: '40px',
            padding: '10px 28px',
          },
        },
        h('span', { style: { color: 'rgba(255,255,255,0.6)', fontSize: '22px' } }, 'aesthetic-iq.vercel.app')
      )
    )
  )

  return new ImageResponse(image, { width: 1080, height: 1350 })
}
