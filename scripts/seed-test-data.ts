/**
 * Seed 5 test patients with full history for mpazgelpi@gmail.com
 * Run: npx tsx scripts/seed-test-data.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vzzjylmsdjeuxwymwkuy.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6emp5bG1zZGpldXh3eW13a3V5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc3MDcwNSwiZXhwIjoyMDkzMzQ2NzA1fQ.iwiSwNNAi99OuH0F9RP2QBiO6tI9inv-04iZZu7zcXc'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

async function main() {
  // 1. Find user
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const user = users.find((u) => u.email === 'mpazgelpi@gmail.com')
  if (!user) throw new Error('User mpazgelpi@gmail.com not found')
  console.log('✓ User found:', user.id)

  // 2. Get professional + clinic
  const { data: professional } = await supabase
    .from('professionals')
    .select('id, clinic_id')
    .eq('user_id', user.id)
    .single()
  if (!professional) throw new Error('No professional record for this user')
  console.log('✓ Professional:', professional.id, '| Clinic:', professional.clinic_id)

  const clinicId = professional.clinic_id
  const professionalId = professional.id

  // 3. Define 5 patients
  const patientsData = [
    {
      full_name: 'Valentina Moreno',
      first_name: 'Valentina',
      phone_e164: '+5491122334455',
      status: 'active' as const,
    },
    {
      full_name: 'Camila Ríos',
      first_name: 'Camila',
      phone_e164: '+5491133445566',
      status: 'active' as const,
    },
    {
      full_name: 'Lucía Fernández',
      first_name: 'Lucía',
      phone_e164: '+5491144556677',
      status: 'active' as const,
    },
    {
      full_name: 'Martina Sosa',
      first_name: 'Martina',
      phone_e164: '+5491155667788',
      status: 'active' as const,
    },
    {
      full_name: 'Sofía Paredes',
      first_name: 'Sofía',
      phone_e164: '+5491166778899',
      status: 'active' as const,
    },
  ]

  // 4. Insert patients
  const { data: insertedPatients, error: pErr } = await supabase
    .from('patients')
    .insert(patientsData.map((p) => ({ ...p, clinic_id: clinicId })))
    .select('id, first_name, full_name')
  if (pErr) throw new Error('Patients insert failed: ' + pErr.message)
  console.log('✓ Inserted 5 patients')

  const [valentina, camila, lucia, martina, sofia] = insertedPatients!

  // 5. Treatments
  const treatmentsData = [
    // Valentina — toxina 90 días atrás (verde, retratamiento próximo)
    {
      clinic_id: clinicId, patient_id: valentina.id, professional_id: professionalId,
      treatment_type: 'toxin' as const,
      areas_treated: ['frente', 'entrecejo', 'patas de gallo'],
      treated_at: daysAgo(90),
      expected_re_treatment_at: daysFromNow(15),
    },
    // Valentina — filler previo (hace 8 meses)
    {
      clinic_id: clinicId, patient_id: valentina.id, professional_id: professionalId,
      treatment_type: 'filler' as const,
      areas_treated: ['labios', 'surco nasogeniano'],
      treated_at: daysAgo(240),
      expected_re_treatment_at: daysFromNow(-120),
    },
    // Camila — toxina reciente (30 días, amarillo)
    {
      clinic_id: clinicId, patient_id: camila.id, professional_id: professionalId,
      treatment_type: 'toxin' as const,
      areas_treated: ['entrecejo', 'frente'],
      treated_at: daysAgo(30),
      expected_re_treatment_at: daysFromNow(60),
    },
    // Lucía — filler hace 2 semanas (foto pendiente)
    {
      clinic_id: clinicId, patient_id: lucia.id, professional_id: professionalId,
      treatment_type: 'filler' as const,
      areas_treated: ['labios', 'pómulos'],
      treated_at: daysAgo(14),
      expected_re_treatment_at: daysFromNow(170),
    },
    // Martina — toxina hace 4 meses, riesgo churn (rojo)
    {
      clinic_id: clinicId, patient_id: martina.id, professional_id: professionalId,
      treatment_type: 'toxin' as const,
      areas_treated: ['frente', 'cuello'],
      treated_at: daysAgo(120),
      expected_re_treatment_at: daysFromNow(-30),
    },
    // Sofía — filler hace 7 días (verde, nuevo)
    {
      clinic_id: clinicId, patient_id: sofia.id, professional_id: professionalId,
      treatment_type: 'filler' as const,
      areas_treated: ['pómulos', 'ojeras'],
      treated_at: daysAgo(7),
      expected_re_treatment_at: daysFromNow(177),
    },
  ]

  const { data: insertedTreatments, error: tErr } = await supabase
    .from('treatments')
    .insert(treatmentsData)
    .select('id, patient_id, treatment_type, treated_at')
  if (tErr) throw new Error('Treatments insert failed: ' + tErr.message)
  console.log('✓ Inserted', insertedTreatments!.length, 'treatments')

  // Treatment shortcuts
  const valentinaLastTx = insertedTreatments!.find(
    (t) => t.patient_id === valentina.id && t.treatment_type === 'toxin'
  )!
  const camilaTx = insertedTreatments!.find((t) => t.patient_id === camila.id)!
  const luciaTx = insertedTreatments!.find((t) => t.patient_id === lucia.id)!

  // 6. Photo sessions — Valentina (pre + post, comparison ready)
  const valPreSession = {
    treatment_id: valentinaLastTx.id,
    session_type: 'pre' as const,
    captured_at: daysAgo(90),
    photo_front_url: 'https://placehold.co/600x800/e9d5ff/7c3aed?text=Pre+Valentina',
    landmarks_front_json: generateFakeLandmarks(0.8),
  }
  const valPostSession = {
    treatment_id: valentinaLastTx.id,
    session_type: 'post_30d' as const,
    captured_at: daysAgo(60),
    photo_front_url: 'https://placehold.co/600x800/ddd6fe/6d28d9?text=Post+Valentina',
    landmarks_front_json: generateFakeLandmarks(0.4),
  }

  const { data: valSessions, error: vsErr } = await supabase
    .from('photo_sessions')
    .insert([valPreSession, valPostSession])
    .select('id, session_type')
  if (vsErr) throw new Error('Photo sessions error: ' + vsErr.message)
  console.log('✓ Inserted photo sessions for Valentina')

  const valPreId = valSessions!.find((s) => s.session_type === 'pre')!.id
  const valPostId = valSessions!.find((s) => s.session_type === 'post_30d')!.id

  // Camila — solo pre
  await supabase.from('photo_sessions').insert({
    treatment_id: camilaTx.id,
    session_type: 'pre' as const,
    captured_at: daysAgo(30),
    photo_front_url: 'https://placehold.co/600x800/fce7f3/be185d?text=Pre+Camila',
    landmarks_front_json: generateFakeLandmarks(0.7),
  })
  console.log('✓ Inserted pre-photo for Camila')

  // Lucía — foto post pendiente (mensaje enviado hace 14 días)
  await supabase.from('photo_sessions').insert({
    treatment_id: luciaTx.id,
    session_type: 'pre' as const,
    captured_at: daysAgo(14),
    photo_front_url: 'https://placehold.co/600x800/ecfdf5/059669?text=Pre+Lucía',
    landmarks_front_json: generateFakeLandmarks(0.6),
  })
  console.log('✓ Inserted pre-photo for Lucía')

  // 7. Comparison for Valentina
  const comparison = {
    treatment_id: valentinaLastTx.id,
    pre_session_id: valPreId,
    post_session_id: valPostId,
    metrics_json: {
      overall_improvement_percent: 67,
      glabela_pre_intensity: 4.2,
      glabela_post_intensity: 1.4,
      glabela_change_pct: -66.7,
      frontal_pre_intensity: 3.8,
      frontal_post_intensity: 1.2,
      frontal_change_pct: -68.4,
      symmetry_score_pre: 82,
      symmetry_score_post: 94,
      symmetry_change: 12,
      alignment_quality: 0.93,
    },
    ai_synthesis_patient: 'Valentina, tus resultados son increíbles — la zona del entrecejo y la frente muestran una suavización notable a 30 días del tratamiento. Tu simetría facial mejoró un 12%, lo que se refleja en una expresión más descansada y armónica. ¡Estás en tu mejor momento!',
    ai_synthesis_clinic: 'Reducción significativa del tono muscular en región glabelar (66.7%) y frontal (68.4%) a los 30 días post-toxina. Simetría facial mejorada de 82 a 94 puntos. Resultado dentro de parámetros esperados para dosis estándar en estas áreas.',
    generated_at: daysAgo(60),
  }

  const { error: compErr } = await supabase.from('comparisons').insert(comparison)
  if (compErr) throw new Error('Comparison error: ' + compErr.message)
  console.log('✓ Inserted comparison for Valentina')

  // 8. Scheduled messages
  const messagesData = [
    // Valentina — ciclo completo enviado
    { clinic_id: clinicId, patient_id: valentina.id, treatment_id: valentinaLastTx.id, template_type: 'day0_welcome', scheduled_for: daysAgo(90), status: 'sent', sent_at: daysAgo(90) },
    { clinic_id: clinicId, patient_id: valentina.id, treatment_id: valentinaLastTx.id, template_type: 'day3_checkin', scheduled_for: daysAgo(87), status: 'sent', sent_at: daysAgo(87) },
    { clinic_id: clinicId, patient_id: valentina.id, treatment_id: valentinaLastTx.id, template_type: 'day14_photo_request', scheduled_for: daysAgo(76), status: 'sent', sent_at: daysAgo(76), patient_response: 'Ahí van las fotos! me encantó el resultado 🥰' },
    { clinic_id: clinicId, patient_id: valentina.id, treatment_id: valentinaLastTx.id, template_type: 'day30_progress', scheduled_for: daysAgo(60), status: 'sent', sent_at: daysAgo(60) },
    { clinic_id: clinicId, patient_id: valentina.id, treatment_id: valentinaLastTx.id, template_type: 'day90_reactivation', scheduled_for: daysAgo(0), status: 'scheduled' },
    // Camila — mensajes iniciales
    { clinic_id: clinicId, patient_id: camila.id, treatment_id: camilaTx.id, template_type: 'day0_welcome', scheduled_for: daysAgo(30), status: 'sent', sent_at: daysAgo(30) },
    { clinic_id: clinicId, patient_id: camila.id, treatment_id: camilaTx.id, template_type: 'day3_checkin', scheduled_for: daysAgo(27), status: 'sent', sent_at: daysAgo(27), patient_response: 'Todo muy bien! Un poco de moretón pero me dijeron que es normal' },
    { clinic_id: clinicId, patient_id: camila.id, treatment_id: camilaTx.id, template_type: 'day14_photo_request', scheduled_for: daysAgo(16), status: 'sent', sent_at: daysAgo(16) },
    // Lucía — bienvenida + foto pendiente sin respuesta
    { clinic_id: clinicId, patient_id: lucia.id, treatment_id: luciaTx.id, template_type: 'day0_welcome', scheduled_for: daysAgo(14), status: 'sent', sent_at: daysAgo(14) },
    { clinic_id: clinicId, patient_id: lucia.id, treatment_id: luciaTx.id, template_type: 'day3_checkin', scheduled_for: daysAgo(11), status: 'sent', sent_at: daysAgo(11), patient_response: 'Gracias! muy feliz con el resultado ✨' },
    { clinic_id: clinicId, patient_id: lucia.id, treatment_id: luciaTx.id, template_type: 'day14_photo_request', scheduled_for: daysAgo(0), status: 'scheduled' },
    // Sofía — solo bienvenida
    { clinic_id: clinicId, patient_id: sofia.id, treatment_id: insertedTreatments!.find((t) => t.patient_id === sofia.id)!.id, template_type: 'day0_welcome', scheduled_for: daysAgo(7), status: 'sent', sent_at: daysAgo(7) },
    { clinic_id: clinicId, patient_id: sofia.id, treatment_id: insertedTreatments!.find((t) => t.patient_id === sofia.id)!.id, template_type: 'day3_checkin', scheduled_for: daysAgo(4), status: 'sent', sent_at: daysAgo(4), patient_response: 'Todo perfecto dra! me encantaron los pómulos 😍' },
  ]

  const { error: mErr } = await supabase.from('scheduled_messages').insert(messagesData)
  if (mErr) throw new Error('Messages error: ' + mErr.message)
  console.log('✓ Inserted', messagesData.length, 'scheduled messages')

  // 9. Capture token for Valentina (for portal demo)
  const tokenExpiry = new Date()
  tokenExpiry.setFullYear(tokenExpiry.getFullYear() + 1)
  const { data: captureToken } = await supabase
    .from('capture_tokens')
    .insert({
      treatment_id: valentinaLastTx.id,
      patient_id: valentina.id,
      purpose: 'patient_portal',
      expires_at: tokenExpiry.toISOString(),
    })
    .select('token')
    .single()

  console.log('\n✅ Seed completado exitosamente!')
  console.log('\nResumen:')
  console.log('  5 pacientes creadas: Valentina, Camila, Lucía, Martina, Sofía')
  console.log('  6 tratamientos (toxina + filler, varios estados)')
  console.log('  3 sesiones de fotos (Valentina: pre+post, Camila: pre, Lucía: pre)')
  console.log('  1 comparación IA completa (Valentina, 67% mejora)')
  console.log('  13 mensajes programados (varios estados y respuestas)')
  console.log('\nPortal de demo Valentina:')
  console.log(`  https://aesthetic-iq.vercel.app/portal/${captureToken?.token}`)
}

function generateFakeLandmarks(intensity: number): number[][] {
  // 478 landmarks, each [x, y, z]
  return Array.from({ length: 478 }, (_, i) => [
    0.3 + Math.random() * 0.4,
    0.3 + Math.random() * 0.4,
    (intensity + Math.random() * 0.1) * (i % 3 === 0 ? 1 : -1),
  ])
}

main().catch((e) => { console.error('❌', e.message); process.exit(1) })
