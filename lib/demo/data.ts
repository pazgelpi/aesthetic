/**
 * Demo data for /demo route — realistic seed, no auth required
 * Sofía (verde · journey completo), Camila (amarillo · próxima), Lucía (rojo · foto pendiente)
 */

export const DEMO_CLINIC = {
  id: 'demo-clinic',
  name: 'Clínica Demo · Aesthetic IQ',
}

export const DEMO_PROFESSIONAL = {
  full_name: 'Dra. Valentina Ruiz',
  role: 'owner' as const,
}

// ─── Patients ─────────────────────────────────────────────────────────────────

export const DEMO_PATIENTS = [
  {
    id: 'demo-sofia',
    full_name: 'Sofía Ramírez',
    first_name: 'Sofía',
    phone_e164: '+5491144556677',
    email: 'sofia@demo.com',
    trafficLight: 'green' as const,
    isVip: true,
    nextExpected: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    pendingPhoto: false,
    treatmentId: 'demo-t1',
  },
  {
    id: 'demo-camila',
    full_name: 'Camila Torres',
    first_name: 'Camila',
    phone_e164: '+5491133445566',
    email: 'camila@demo.com',
    trafficLight: 'yellow' as const,
    isVip: false,
    nextExpected: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    pendingPhoto: false,
    treatmentId: 'demo-t2',
  },
  {
    id: 'demo-lucia',
    full_name: 'Lucía Méndez',
    first_name: 'Lucía',
    phone_e164: '+5491122334455',
    email: null,
    trafficLight: 'red' as const,
    isVip: false,
    nextExpected: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    pendingPhoto: true,
    treatmentId: 'demo-t3',
  },
]

// ─── Treatments ───────────────────────────────────────────────────────────────

const now = new Date()
const d = (days: number) => new Date(now.getTime() + days * 864e5).toISOString()

export const DEMO_TREATMENTS = [
  {
    id: 'demo-t1',
    patient_id: 'demo-sofia',
    treatment_type: 'toxin' as const,
    areas_treated: ['Glabela', 'Frontal', 'Patas de gallo'],
    product_brand: 'Botox® (Allergan)',
    units_total: 32,
    treated_at: d(-45),
    expected_re_treatment_at: d(45),
    notes: 'Paciente con buena respuesta. Dosis habitual. Próximo control en 3 meses.',
    google_calendar_event_id: 'demo-cal-event-1',
  },
  {
    id: 'demo-t2',
    patient_id: 'demo-camila',
    treatment_type: 'filler' as const,
    areas_treated: ['Surcos nasogenianos', 'Labios'],
    product_brand: 'Juvederm® Ultra',
    units_total: null,
    treated_at: d(-90),
    expected_re_treatment_at: d(14),
    notes: 'Resultado natural. Seguimiento a los 30 días sin novedad.',
    google_calendar_event_id: null,
  },
  {
    id: 'demo-t3',
    patient_id: 'demo-lucia',
    treatment_type: 'toxin' as const,
    areas_treated: ['Glabela', 'Entrecejo'],
    product_brand: 'Dysport®',
    units_total: 45,
    treated_at: d(-120),
    expected_re_treatment_at: d(-15),
    notes: 'Primera vez con toxina. Esperando fotos post.',
    google_calendar_event_id: null,
  },
]

// ─── Photo sessions ───────────────────────────────────────────────────────────

export const DEMO_PHOTO_SESSIONS = {
  'demo-t1': {
    pre: {
      photo_front_url: 'https://placehold.co/400x533/e8d5c4/8b5e3c?text=Pre+Frontal',
      photo_45_url: 'https://placehold.co/400x533/e8d5c4/8b5e3c?text=Pre+45%C2%B0',
      photo_contracted_url: 'https://placehold.co/400x533/e8d5c4/8b5e3c?text=Pre+Contraída',
    },
    post: {
      photo_front_url: 'https://placehold.co/400x533/d4e8d4/3c6b3c?text=Post+Frontal',
      photo_45_url: 'https://placehold.co/400x533/d4e8d4/3c6b3c?text=Post+45%C2%B0',
      photo_contracted_url: 'https://placehold.co/400x533/d4e8d4/3c6b3c?text=Post+Contraída',
    },
  },
  'demo-t2': {
    pre: {
      photo_front_url: 'https://placehold.co/400x533/e8d5c4/8b5e3c?text=Pre+Frontal',
      photo_45_url: 'https://placehold.co/400x533/e8d5c4/8b5e3c?text=Pre+45%C2%B0',
      photo_contracted_url: null,
    },
    post: {
      photo_front_url: 'https://placehold.co/400x533/d4e8d4/3c6b3c?text=Post+Frontal',
      photo_45_url: 'https://placehold.co/400x533/d4e8d4/3c6b3c?text=Post+45%C2%B0',
      photo_contracted_url: null,
    },
  },
  'demo-t3': {
    pre: {
      photo_front_url: 'https://placehold.co/400x533/e8d5c4/8b5e3c?text=Pre+Frontal',
      photo_45_url: 'https://placehold.co/400x533/e8d5c4/8b5e3c?text=Pre+45%C2%B0',
      photo_contracted_url: null,
    },
    post: null,
  },
}

// ─── Comparisons ──────────────────────────────────────────────────────────────

export const DEMO_COMPARISONS = {
  'demo-t1': {
    metrics_json: {
      glabela_change_pct: -67,
      frontal_change_pct: -54,
      patas_gallo_left_change_pct: -61,
      patas_gallo_right_change_pct: -58,
      symmetry_change: 0.12,
    },
    ai_synthesis_patient: 'Sofía, a 45 días de tu tratamiento con toxina botulínica, los resultados hablan solos. La zona del entrecejo muestra una suavización notable, y las líneas de expresión en la frente han reducido significativamente. Tu piel luce más descansada y natural.',
    ai_synthesis_clinic: 'Respuesta excelente a toxina. Reducción de arrugas dinámicas en región glabelar: -67%. Frontal: -54%. Región periorbital bilateral: -60% promedio. Simetría mejorada +0.12 pts. Próximo control en 45 días para evaluar duración del efecto.',
    shareable_image_url: 'https://placehold.co/1080x1350/18142a/7c3aed?text=Informe+de+Evolución',
    generated_at: d(-14),
  },
  'demo-t2': {
    metrics_json: {
      frontal_change_pct: -32,
      symmetry_change: 0.08,
    },
    ai_synthesis_patient: 'Camila, tu tratamiento de filler está dando resultados muy naturales. Los surcos nasogenianos se ven visiblemente suavizados y el volumen labial está integrado de manera armónica.',
    ai_synthesis_clinic: 'Resultado de filler HA en NLF y labios dentro de parámetros esperados. Simetría labial mejorada. Sin eventos adversos reportados.',
    shareable_image_url: null,
    generated_at: d(-30),
  },
}

// ─── KPIs (precalculados para el dashboard demo) ──────────────────────────────

export const DEMO_KPIS = {
  totalActive: 3,
  pendingThisWeek: 1,
  atRisk: 1,
  nearBaseline: 1,
  pendingPhoto: 1,
}

// ─── WhatsApp messages simulados (Sofía) ──────────────────────────────────────

export const DEMO_MESSAGES = [
  {
    id: 'msg-1',
    template_type: 'day0_welcome',
    scheduled_for: d(-45),
    generated_message: '¡Hola Sofía! Soy la Dra. Ruiz. Fue un placer atenderte hoy. Acordate de no hacer actividad física intensa las próximas 24hs y evitá recostarte por 4 horas. Cualquier consulta, escribime.',
    status: 'sent',
    patient_response: '¡Gracias doctora! Todo bien 😊',
  },
  {
    id: 'msg-2',
    template_type: 'day3_check',
    scheduled_for: d(-42),
    generated_message: '¿Cómo te sentís, Sofía? Ya deberías notar los primeros resultados. Es normal sentir algo de firmeza en la zona tratada, va a ir cediendo. ¿Alguna consulta?',
    status: 'sent',
    patient_response: 'Sí! Se nota re bien ya. Gracias ❤️',
  },
  {
    id: 'msg-3',
    template_type: 'day14_photo_request',
    scheduled_for: d(-31),
    generated_message: '¡Sofía! Ya pasaron 14 días del tratamiento, momento ideal para ver cómo está evolucionando. ¿Me podés mandar una foto frontal y otra de 45° con buena luz? Así actualizamos tu historia de progreso.',
    status: 'sent',
    patient_response: null,
  },
]

// ─── Progress story (Sofía) ───────────────────────────────────────────────────

export const DEMO_STORY = {
  title: '✨ Tu piel lo dice todo, Sofía',
  narrative: 'A 45 días de tu tratamiento con toxina botulínica, los resultados hablan solos. La zona del entrecejo muestra una suavización del 67% y las líneas de expresión en la frente se redujeron notablemente. Tu piel luce más descansada y natural, sin perder expresividad.',
  highlightValue: '67%',
  highlightLabel: 'de mejora en glabela',
  ctaText: 'En 45 días coordinamos tu próximo paso para mantener estos resultados.',
}
