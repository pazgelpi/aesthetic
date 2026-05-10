/**
 * Demo data for /demo route — realistic seed, no auth required
 * 10 pacientes · 7 tipos de tratamiento · módulo de stock
 */

export const DEMO_CLINIC = {
  id: 'demo-clinic',
  name: 'Clínica Demo · Aesthetic IQ',
}

export const DEMO_PROFESSIONAL = {
  full_name: 'Dra. Valentina Ruiz',
  role: 'owner' as const,
}

// ─── Treatment type labels ────────────────────────────────────────────────────

export const TREATMENT_TYPE_LABELS: Record<string, string> = {
  toxin:            'Toxina Botulínica',
  filler:           'Ácido Hialurónico',
  peel:             'Peeling Químico',
  prp:              'PRP / Plasma',
  bioestimulation:  'Bioestimulación',
  mesotherapy:      'Mesoterapia',
  laser:            'Láser / IPL',
}

// ─── Patients ─────────────────────────────────────────────────────────────────

export const DEMO_PATIENTS = [
  // ── Toxina (3) ──
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
    treatmentType: 'toxin',
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
    treatmentType: 'toxin',
  },
  {
    id: 'demo-gabriela',
    full_name: 'Gabriela Fernández',
    first_name: 'Gabriela',
    phone_e164: '+5491155667788',
    email: 'gabriela@demo.com',
    trafficLight: 'red' as const,
    isVip: false,
    nextExpected: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    pendingPhoto: false,
    treatmentId: 'demo-t5',
    treatmentType: 'toxin',
  },
  // ── Filler (2) ──
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
    treatmentType: 'filler',
  },
  {
    id: 'demo-renata',
    full_name: 'Renata Silva',
    first_name: 'Renata',
    phone_e164: '+5491166778899',
    email: 'renata@demo.com',
    trafficLight: 'green' as const,
    isVip: false,
    nextExpected: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    pendingPhoto: false,
    treatmentId: 'demo-t6',
    treatmentType: 'filler',
  },
  // ── Peeling (1) ──
  {
    id: 'demo-valentina',
    full_name: 'Valentina Castro',
    first_name: 'Valentina',
    phone_e164: '+5491177889900',
    email: 'valentina@demo.com',
    trafficLight: 'green' as const,
    isVip: false,
    nextExpected: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    pendingPhoto: false,
    treatmentId: 'demo-t7',
    treatmentType: 'peel',
  },
  // ── PRP (1) ──
  {
    id: 'demo-martina',
    full_name: 'Martina López',
    first_name: 'Martina',
    phone_e164: '+5491188990011',
    email: 'martina@demo.com',
    trafficLight: 'yellow' as const,
    isVip: false,
    nextExpected: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    pendingPhoto: false,
    treatmentId: 'demo-t8',
    treatmentType: 'prp',
  },
  // ── Bioestimulación (1) ──
  {
    id: 'demo-carolina',
    full_name: 'Carolina Ruiz',
    first_name: 'Carolina',
    phone_e164: '+5491199001122',
    email: 'carolina@demo.com',
    trafficLight: 'yellow' as const,
    isVip: true,
    nextExpected: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    pendingPhoto: false,
    treatmentId: 'demo-t9',
    treatmentType: 'bioestimulation',
  },
  // ── Mesoterapia (1) ──
  {
    id: 'demo-isabella',
    full_name: 'Isabella Mora',
    first_name: 'Isabella',
    phone_e164: '+5491100112233',
    email: 'isabella@demo.com',
    trafficLight: 'green' as const,
    isVip: false,
    nextExpected: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    pendingPhoto: false,
    treatmentId: 'demo-t10',
    treatmentType: 'mesotherapy',
  },
  // ── Láser (1) ──
  {
    id: 'demo-ana',
    full_name: 'Ana García',
    first_name: 'Ana',
    phone_e164: '+5491111223344',
    email: 'ana@demo.com',
    trafficLight: 'green' as const,
    isVip: false,
    nextExpected: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    pendingPhoto: false,
    treatmentId: 'demo-t11',
    treatmentType: 'laser',
  },
]

// ─── Treatments ───────────────────────────────────────────────────────────────

const now = new Date()
const d = (days: number) => new Date(now.getTime() + days * 864e5).toISOString()

export const DEMO_TREATMENTS = [
  // Sofía — toxina actual
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
  // Sofía — filler anterior (8 meses atrás)
  {
    id: 'demo-t4',
    patient_id: 'demo-sofia',
    treatment_type: 'filler' as const,
    areas_treated: ['Surcos nasogenianos', 'Labios'],
    product_brand: 'Restylane® Kysse',
    units_total: null,
    treated_at: d(-240),
    expected_re_treatment_at: d(-60),
    notes: 'Primera sesión de filler labial. Resultado muy natural. Paciente muy conforme. Se sugiere retoque en 8 meses.',
    google_calendar_event_id: 'demo-cal-event-2',
  },
  // Camila — filler
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
  // Lucía — toxina
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
  // Gabriela — toxina (en riesgo)
  {
    id: 'demo-t5',
    patient_id: 'demo-gabriela',
    treatment_type: 'toxin' as const,
    areas_treated: ['Glabela', 'Frontal', 'Cuello'],
    product_brand: 'Xeomin® (Merz)',
    units_total: 28,
    treated_at: d(-98),
    expected_re_treatment_at: d(-8),
    notes: 'Segunda sesión. Respuesta normal. Dosis mantenida respecto a sesión anterior.',
    google_calendar_event_id: null,
  },
  // Renata — filler (próxima reciente)
  {
    id: 'demo-t6',
    patient_id: 'demo-renata',
    treatment_type: 'filler' as const,
    areas_treated: ['Pómulos', 'Ojeras'],
    product_brand: 'Teosyal® RHA 3',
    units_total: null,
    treated_at: d(-30),
    expected_re_treatment_at: d(60),
    notes: 'Primera sesión filler pómulos + ojeras. Resultado muy natural. Paciente muy satisfecha.',
    google_calendar_event_id: null,
  },
  // Valentina — peeling
  {
    id: 'demo-t7',
    patient_id: 'demo-valentina',
    treatment_type: 'peel' as const,
    areas_treated: ['Cara completa'],
    product_brand: 'Ácido glicólico 30% + Salicílico 20%',
    units_total: null,
    treated_at: d(-14),
    expected_re_treatment_at: d(28),
    notes: 'Peeling superficial. Piel sensible tipo II. Buena tolerancia. Próxima sesión en 6 semanas.',
    google_calendar_event_id: null,
  },
  // Martina — PRP
  {
    id: 'demo-t8',
    patient_id: 'demo-martina',
    treatment_type: 'prp' as const,
    areas_treated: ['Cara', 'Cuello'],
    product_brand: 'PRP autólogo — centrifugado doble',
    units_total: null,
    treated_at: d(-72),
    expected_re_treatment_at: d(18),
    notes: 'Segunda sesión de PRP. Mejora visible en calidad de piel. Sin reacciones adversas.',
    google_calendar_event_id: null,
  },
  // Carolina — bioestimulación (VIP)
  {
    id: 'demo-t9',
    patient_id: 'demo-carolina',
    treatment_type: 'bioestimulation' as const,
    areas_treated: ['Cara', 'Cuello', 'Escote'],
    product_brand: 'Radiesse® + Nuit®',
    units_total: null,
    treated_at: d(-60),
    expected_re_treatment_at: d(21),
    notes: 'Protocolo bioestimulación HAAS. Excelente respuesta. Colágeno visible. VIP — descuento fidelidad aplicado.',
    google_calendar_event_id: null,
  },
  // Isabella — mesoterapia
  {
    id: 'demo-t10',
    patient_id: 'demo-isabella',
    treatment_type: 'mesotherapy' as const,
    areas_treated: ['Cara', 'Cuero cabelludo'],
    product_brand: 'NCTF 135 HA (Filorga)',
    units_total: null,
    treated_at: d(-7),
    expected_re_treatment_at: d(35),
    notes: 'Mesoterapia facial revitalizante. Primera sesión protocolo NCTF. Tolerancia excelente.',
    google_calendar_event_id: null,
  },
  // Ana — láser
  {
    id: 'demo-t11',
    patient_id: 'demo-ana',
    treatment_type: 'laser' as const,
    areas_treated: ['Piernas', 'Zona bikini'],
    product_brand: 'Soprano Ice Platinum (Alma)',
    units_total: null,
    treated_at: d(-20),
    expected_re_treatment_at: d(50),
    notes: 'Sesión 3/8 de depilación láser. Reducción del 60% del vello. Sin efectos adversos.',
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
  'demo-t4': {
    pre: {
      photo_front_url: 'https://placehold.co/400x533/f5e6d3/9b6b43?text=Pre+Frontal',
      photo_45_url: 'https://placehold.co/400x533/f5e6d3/9b6b43?text=Pre+45%C2%B0',
      photo_contracted_url: null,
    },
    post: {
      photo_front_url: 'https://placehold.co/400x533/d8ead8/4a7a4a?text=Post+Frontal',
      photo_45_url: 'https://placehold.co/400x533/d8ead8/4a7a4a?text=Post+45%C2%B0',
      photo_contracted_url: null,
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
  'demo-t4': {
    metrics_json: {
      frontal_change_pct: -38,
      symmetry_change: 0.18,
    },
    ai_synthesis_patient: 'Sofía, tu filler labial quedó increíble. El volumen se integró de forma muy natural y los surcos nasogenianos se suavizaron sin perder expresividad. ¡Los resultados superaron las expectativas!',
    ai_synthesis_clinic: 'Filler HA (Restylane® Kysse) en NLF y labios. Resultado dentro de parámetros esperados. Simetría labial mejorada +0.18 pts. Sin eventos adversos. Retoque sugerido en 8-12 meses.',
    shareable_image_url: null,
    generated_at: d(-210),
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

// ─── Message schedule completo (5 mensajes por tratamiento) ──────────────────

export type MessageStatus = 'sent' | 'scheduled'

export interface DemoMessage {
  id: string
  day: number
  label: string
  template_type: string
  scheduled_for: string
  status: MessageStatus
  generated_message: string | null
  patient_response: string | null
}

export const DEMO_MESSAGE_SCHEDULE: Record<string, DemoMessage[]> = {
  'demo-t1': [
    {
      id: 't1-msg-1',
      day: 0,
      label: 'Bienvenida',
      template_type: 'day0_welcome',
      scheduled_for: d(-45),
      status: 'sent',
      generated_message: '¡Hola Sofía! Soy la Dra. Ruiz. Fue un placer atenderte hoy 💜 Acordate de no hacer actividad física intensa las próximas 24hs y evitá recostarte por 4 horas. Cualquier consulta, escribime.',
      patient_response: '¡Gracias doctora! Todo bien 😊',
    },
    {
      id: 't1-msg-2',
      day: 3,
      label: 'Control',
      template_type: 'day3_check',
      scheduled_for: d(-42),
      status: 'sent',
      generated_message: '¿Cómo te sentís, Sofía? Ya deberías notar los primeros resultados. Es normal sentir algo de firmeza en la zona tratada, va a ir cediendo. ¿Alguna consulta?',
      patient_response: 'Sí! Se nota re bien ya. Gracias ❤️',
    },
    {
      id: 't1-msg-3',
      day: 14,
      label: 'Solicitud de foto',
      template_type: 'day14_photo_request',
      scheduled_for: d(-31),
      status: 'sent',
      generated_message: '¡Sofía! Ya pasaron 14 días del tratamiento 📸 ¿Me podés mandar una foto frontal y otra de 45° con buena luz? Así actualizamos tu informe de evolución.',
      patient_response: null,
    },
    {
      id: 't1-msg-4',
      day: 30,
      label: 'Progreso',
      template_type: 'day30_progress',
      scheduled_for: d(-15),
      status: 'sent',
      generated_message: '¡Un mes de tu tratamiento, Sofía! 🌟 La IA analizó tus fotos y los resultados son increíbles: 67% de mejora en glabela. Te mando tu informe completo. ¡Estás radiante!',
      patient_response: '¡No puedo creer lo bien que quedó! ¿Cuándo agendamos el próximo? 🙌',
    },
    {
      id: 't1-msg-5',
      day: 90,
      label: 'Reactivación',
      template_type: 'day90_reactivation',
      scheduled_for: d(45),
      status: 'scheduled',
      generated_message: null,
      patient_response: null,
    },
  ],
  'demo-t4': [
    {
      id: 't4-msg-1',
      day: 0,
      label: 'Bienvenida',
      template_type: 'day0_welcome',
      scheduled_for: d(-240),
      status: 'sent',
      generated_message: '¡Hola Sofía! Que linda sesión hoy 💜 Acordate de no tocarte la zona las próximas 6hs y evitá calor intenso los primeros días. ¡Cualquier cosa me escribís!',
      patient_response: '¡Gracias! Quedó hermoso 😍',
    },
    {
      id: 't4-msg-2',
      day: 3,
      label: 'Control',
      template_type: 'day3_check',
      scheduled_for: d(-237),
      status: 'sent',
      generated_message: '¿Cómo te sentís con el filler, Sofía? El leve edema de los primeros días va bajando. ¿Todo bien?',
      patient_response: 'Perfecto, ya se asentó todo ✨',
    },
    {
      id: 't4-msg-3',
      day: 14,
      label: 'Solicitud de foto',
      template_type: 'day14_photo_request',
      scheduled_for: d(-226),
      status: 'sent',
      generated_message: '¡Sofía! Ya pasaron 2 semanas 📸 Ideal para ver cómo quedó integrado el filler. ¿Me mandás una foto frontal?',
      patient_response: 'Acá va! Me encanta cómo quedó 🌸',
    },
    {
      id: 't4-msg-4',
      day: 30,
      label: 'Progreso',
      template_type: 'day30_progress',
      scheduled_for: d(-210),
      status: 'sent',
      generated_message: 'Un mes del filler, Sofía 🌟 Los resultados se ven increíbles y muy naturales. Guardá esta foto para cuando hagamos el próximo retoque y veamos la diferencia.',
      patient_response: '¡Gracias doctora! La mejor decisión que tomé 😊',
    },
    {
      id: 't4-msg-5',
      day: 90,
      label: 'Reactivación',
      template_type: 'day90_reactivation',
      scheduled_for: d(-150),
      status: 'sent',
      generated_message: '¡Hola Sofía! Ya pasaron 3 meses del filler 💜 ¿Cómo lo estás viendo? Si querés coordinamos una consulta para ver cómo está el volumen y si necesitás un retoque.',
      patient_response: 'Sí! Coordinamos la semana que viene 📅',
    },
  ],
  'demo-t2': [
    {
      id: 't2-msg-1',
      day: 0,
      label: 'Bienvenida',
      template_type: 'day0_welcome',
      scheduled_for: d(-90),
      status: 'sent',
      generated_message: '¡Hola Camila! Fue un placer atenderte hoy ✨ Recordá no presionar la zona tratada las próximas 24hs y evitá ejercicio intenso. ¡Cualquier consulta escribime!',
      patient_response: '¡Gracias! Muy contenta con el resultado',
    },
    {
      id: 't2-msg-2',
      day: 3,
      label: 'Control',
      template_type: 'day3_check',
      scheduled_for: d(-87),
      status: 'sent',
      generated_message: '¿Cómo te sentís, Camila? El filler se va integrando estos primeros días. ¿Alguna consulta?',
      patient_response: null,
    },
    {
      id: 't2-msg-3',
      day: 14,
      label: 'Solicitud de foto',
      template_type: 'day14_photo_request',
      scheduled_for: d(-76),
      status: 'sent',
      generated_message: '¡Camila! Ya pasaron 14 días 📸 ¿Me mandás una foto para ver cómo quedó el filler integrado?',
      patient_response: 'Acá va! Quedó muy natural 🥰',
    },
    {
      id: 't2-msg-4',
      day: 30,
      label: 'Progreso',
      template_type: 'day30_progress',
      scheduled_for: d(-60),
      status: 'sent',
      generated_message: '¡Un mes del tratamiento, Camila! 🌟 ¿Cómo estás viendo los resultados? Muy pronto coordinamos tu retratamiento.',
      patient_response: '¡Genial! ¿Cuándo me agendás? 😊',
    },
    {
      id: 't2-msg-5',
      day: 90,
      label: 'Reactivación',
      template_type: 'day90_reactivation',
      scheduled_for: d(14),
      status: 'scheduled',
      generated_message: null,
      patient_response: null,
    },
  ],
  'demo-t3': [
    {
      id: 't3-msg-1',
      day: 0,
      label: 'Bienvenida',
      template_type: 'day0_welcome',
      scheduled_for: d(-120),
      status: 'sent',
      generated_message: '¡Hola Lucía! Gracias por tu confianza hoy 💜 Acordate de no recostarte las próximas 4hs y evitá ejercicio intenso. ¡Cualquier consulta me escribís!',
      patient_response: '¡Gracias doctora!',
    },
    {
      id: 't3-msg-2',
      day: 3,
      label: 'Control',
      template_type: 'day3_check',
      scheduled_for: d(-117),
      status: 'sent',
      generated_message: '¿Cómo te sentís, Lucía? Con la toxina los primeros efectos se notan entre el día 3 y 7. ¿Todo bien?',
      patient_response: null,
    },
    {
      id: 't3-msg-3',
      day: 14,
      label: 'Solicitud de foto',
      template_type: 'day14_photo_request',
      scheduled_for: d(-106),
      status: 'sent',
      generated_message: '¡Lucía! Ya pasaron 14 días 📸 ¿Me podés mandar una foto frontal con buena luz? Necesito ver cómo está evolucionando la zona.',
      patient_response: null,
    },
    {
      id: 't3-msg-4',
      day: 30,
      label: 'Progreso',
      template_type: 'day30_progress',
      scheduled_for: d(-90),
      status: 'sent',
      generated_message: 'Lucía, ya pasó un mes 🌟 ¿Cómo ves los resultados? Cuando puedas mandame una foto para actualizar tu seguimiento.',
      patient_response: null,
    },
    {
      id: 't3-msg-5',
      day: 90,
      label: 'Reactivación',
      template_type: 'day90_reactivation',
      scheduled_for: d(-30),
      status: 'sent',
      generated_message: '¡Hola Lucía! Ya casi 3 meses desde tu tratamiento 💜 ¿Cómo lo ves? Si querés coordinamos el próximo retratamiento — los resultados de la toxina suelen durar entre 3 y 4 meses.',
      patient_response: null,
    },
  ],
}

// ─── KPIs (precalculados para el dashboard demo) ──────────────────────────────

export const DEMO_KPIS = {
  totalActive: 10,
  pendingThisWeek: 3,
  atRisk: 3,
  nearBaseline: 3,
  pendingPhoto: 1,
}

// ─── Stock de insumos ─────────────────────────────────────────────────────────

export type StockStatus = 'ok' | 'warn' | 'critical'

export interface Lote {
  id: string
  numero: string        // número de lote
  cantidad: number      // unidades restantes
  fechaCompra: string   // ISO date
  vencimiento: string   // ISO date
  proveedor: string
  precioUnitario: number // USD
}

export interface StockItem {
  id: string
  name: string
  marca: string
  category: 'toxin' | 'filler' | 'peel' | 'prp' | 'mesotherapy' | 'laser' | 'general'
  unit: string
  monthlyUsage: number
  status: StockStatus   // pre-computado sobre stock total
  lotes: Lote[]
}

// stock total = sum de lotes
export function totalStock(item: StockItem): number {
  return item.lotes.reduce((s, l) => s + l.cantidad, 0)
}

// costo promedio ponderado por unidad
export function avgCost(item: StockItem): number {
  const total = totalStock(item)
  if (total === 0) return 0
  const weighted = item.lotes.reduce((s, l) => s + l.precioUnitario * l.cantidad, 0)
  return Math.round(weighted / total)
}

export const DEMO_STOCK: StockItem[] = [
  // ── Toxina ──
  {
    id: 's1', name: 'Viales Botox® 100U', marca: 'Allergan (AbbVie)',
    category: 'toxin', unit: 'viales', monthlyUsage: 12, status: 'ok',
    lotes: [
      { id: 'l1a', numero: 'LT-BOT-2024-089', cantidad: 3, fechaCompra: '2024-09-15', vencimiento: '2026-08-31', proveedor: 'Droguería del Sur SA', precioUnitario: 145 },
      { id: 'l1b', numero: 'LT-BOT-2025-011', cantidad: 5, fechaCompra: '2025-01-20', vencimiento: '2027-01-15', proveedor: 'Droguería del Sur SA', precioUnitario: 148 },
    ],
  },
  {
    id: 's2', name: 'Viales Dysport® 500U', marca: 'Galderma',
    category: 'toxin', unit: 'viales', monthlyUsage: 4, status: 'critical',
    lotes: [
      { id: 'l2a', numero: 'LT-DYS-2024-112', cantidad: 2, fechaCompra: '2024-10-03', vencimiento: '2026-05-31', proveedor: 'MedEstética SA', precioUnitario: 160 },
    ],
  },
  {
    id: 's3', name: 'Viales Xeomin® 100U', marca: 'Merz Aesthetics',
    category: 'toxin', unit: 'viales', monthlyUsage: 6, status: 'ok',
    lotes: [
      { id: 'l3a', numero: 'LT-XEO-2024-077', cantidad: 2, fechaCompra: '2024-08-10', vencimiento: '2026-10-15', proveedor: 'BioFarma Distribuidora', precioUnitario: 138 },
      { id: 'l3b', numero: 'LT-XEO-2025-003', cantidad: 3, fechaCompra: '2025-02-05', vencimiento: '2027-02-01', proveedor: 'BioFarma Distribuidora', precioUnitario: 140 },
    ],
  },
  // ── Filler ──
  {
    id: 's4', name: 'Restylane® Kysse 1ml', marca: 'Galderma',
    category: 'filler', unit: 'jeringas', monthlyUsage: 5, status: 'warn',
    lotes: [
      { id: 'l4a', numero: 'LT-RES-2024-304', cantidad: 1, fechaCompra: '2024-07-22', vencimiento: '2026-07-20', proveedor: 'MedEstética SA', precioUnitario: 215 },
      { id: 'l4b', numero: 'LT-RES-2024-411', cantidad: 2, fechaCompra: '2024-11-08', vencimiento: '2027-01-20', proveedor: 'MedEstética SA', precioUnitario: 220 },
    ],
  },
  {
    id: 's5', name: 'Juvederm® Ultra 1ml', marca: 'Allergan (AbbVie)',
    category: 'filler', unit: 'jeringas', monthlyUsage: 4, status: 'ok',
    lotes: [
      { id: 'l5a', numero: 'LT-JUV-2024-218', cantidad: 2, fechaCompra: '2024-09-01', vencimiento: '2026-09-10', proveedor: 'Droguería del Sur SA', precioUnitario: 210 },
      { id: 'l5b', numero: 'LT-JUV-2025-019', cantidad: 3, fechaCompra: '2025-01-10', vencimiento: '2027-03-10', proveedor: 'Droguería del Sur SA', precioUnitario: 215 },
    ],
  },
  {
    id: 's6', name: 'Teosyal® RHA 3 1ml', marca: 'Teoxane',
    category: 'filler', unit: 'jeringas', monthlyUsage: 3, status: 'warn',
    lotes: [
      { id: 'l6a', numero: 'LT-TEO-2024-091', cantidad: 2, fechaCompra: '2024-10-15', vencimiento: '2026-12-05', proveedor: 'Dermocosméticos Arg.', precioUnitario: 235 },
    ],
  },
  {
    id: 's7', name: 'Cánulas 25G (caja 20u)', marca: 'TSK Laboratory',
    category: 'filler', unit: 'cajas', monthlyUsage: 2, status: 'critical',
    lotes: [
      { id: 'l7a', numero: 'LT-CAN-2024-560', cantidad: 1, fechaCompra: '2024-12-01', vencimiento: '2028-06-01', proveedor: 'Insumos Médicos Plus', precioUnitario: 45 },
    ],
  },
  {
    id: 's8', name: 'EMLA crema 30g', marca: 'Aspen / AstraZeneca',
    category: 'filler', unit: 'pomos', monthlyUsage: 3, status: 'ok',
    lotes: [
      { id: 'l8a', numero: 'LT-EML-2024-022', cantidad: 2, fechaCompra: '2024-06-10', vencimiento: '2026-06-15', proveedor: 'Farmacia Central', precioUnitario: 27 },
      { id: 'l8b', numero: 'LT-EML-2024-155', cantidad: 2, fechaCompra: '2024-11-20', vencimiento: '2026-09-15', proveedor: 'Farmacia Central', precioUnitario: 28 },
    ],
  },
  // ── Peeling ──
  {
    id: 's9', name: 'Ácido glicólico 30% 100ml', marca: 'Dermalogica',
    category: 'peel', unit: 'frascos', monthlyUsage: 4, status: 'warn',
    lotes: [
      { id: 'l9a', numero: 'LT-AGL-2024-188', cantidad: 2, fechaCompra: '2024-08-25', vencimiento: '2025-11-30', proveedor: 'Cosméticos Profesionales', precioUnitario: 55 },
    ],
  },
  {
    id: 's10', name: 'Ácido salicílico 20% 100ml', marca: 'Dermalogica',
    category: 'peel', unit: 'frascos', monthlyUsage: 3, status: 'ok',
    lotes: [
      { id: 'l10a', numero: 'LT-ASA-2024-190', cantidad: 3, fechaCompra: '2024-09-05', vencimiento: '2025-12-20', proveedor: 'Cosméticos Profesionales', precioUnitario: 42 },
      { id: 'l10b', numero: 'LT-ASA-2025-007', cantidad: 3, fechaCompra: '2025-01-15', vencimiento: '2026-03-20', proveedor: 'Cosméticos Profesionales', precioUnitario: 44 },
    ],
  },
  {
    id: 's11', name: 'Neutralizador peeling 100ml', marca: 'Jan Marini',
    category: 'peel', unit: 'frascos', monthlyUsage: 3, status: 'critical',
    lotes: [
      { id: 'l11a', numero: 'LT-NEU-2024-033', cantidad: 1, fechaCompra: '2024-07-01', vencimiento: '2025-08-10', proveedor: 'BeautyPro Distribuciones', precioUnitario: 38 },
    ],
  },
  // ── PRP ──
  {
    id: 's12', name: 'Kits PRP centrifugación', marca: 'RegenKit® (Regen Lab)',
    category: 'prp', unit: 'kits', monthlyUsage: 6, status: 'warn',
    lotes: [
      { id: 'l12a', numero: 'LT-PRP-2024-398', cantidad: 2, fechaCompra: '2024-08-18', vencimiento: '2026-05-01', proveedor: 'BioCell Argentina', precioUnitario: 82 },
      { id: 'l12b', numero: 'LT-PRP-2024-441', cantidad: 3, fechaCompra: '2024-10-30', vencimiento: '2026-07-01', proveedor: 'BioCell Argentina', precioUnitario: 85 },
    ],
  },
  // ── Mesoterapia ──
  {
    id: 's13', name: 'NCTF 135 HA (Filorga)', marca: 'Institut Esthederm (Filorga)',
    category: 'mesotherapy', unit: 'viales', monthlyUsage: 8, status: 'critical',
    lotes: [
      { id: 'l13a', numero: 'LT-NCT-2024-201', cantidad: 1, fechaCompra: '2024-09-12', vencimiento: '2026-03-15', proveedor: 'MedEstética SA', precioUnitario: 92 },
      { id: 'l13b', numero: 'LT-NCT-2024-205', cantidad: 2, fechaCompra: '2024-11-05', vencimiento: '2026-04-30', proveedor: 'MedEstética SA', precioUnitario: 95 },
    ],
  },
  // ── General ──
  {
    id: 's14', name: 'Jeringas tuberculina 1ml', marca: 'BD (Becton Dickinson)',
    category: 'general', unit: 'cajas', monthlyUsage: 3, status: 'ok',
    lotes: [
      { id: 'l14a', numero: 'LT-JER-2024-771', cantidad: 2, fechaCompra: '2024-07-08', vencimiento: '2027-06-01', proveedor: 'Insumos Médicos Plus', precioUnitario: 12 },
      { id: 'l14b', numero: 'LT-JER-2024-889', cantidad: 2, fechaCompra: '2024-12-03', vencimiento: '2027-12-01', proveedor: 'Insumos Médicos Plus', precioUnitario: 12 },
    ],
  },
  {
    id: 's15', name: 'Agujas 30G x ½" (caja 100u)', marca: 'BD (Becton Dickinson)',
    category: 'general', unit: 'cajas', monthlyUsage: 3, status: 'critical',
    lotes: [
      { id: 'l15a', numero: 'LT-AGU-2024-102', cantidad: 1, fechaCompra: '2024-10-22', vencimiento: '2027-08-15', proveedor: 'Insumos Médicos Plus', precioUnitario: 9 },
    ],
  },
  {
    id: 's16', name: 'Guantes nitrilo M (caja 100u)', marca: 'Ansell',
    category: 'general', unit: 'cajas', monthlyUsage: 4, status: 'ok',
    lotes: [
      { id: 'l16a', numero: 'LT-GUA-2024-601', cantidad: 3, fechaCompra: '2024-08-01', vencimiento: '2027-08-01', proveedor: 'Farmacia Central', precioUnitario: 17 },
      { id: 'l16b', numero: 'LT-GUA-2024-774', cantidad: 3, fechaCompra: '2024-11-15', vencimiento: '2028-01-01', proveedor: 'Farmacia Central', precioUnitario: 18 },
    ],
  },
  {
    id: 's17', name: 'Gasas estériles (paq. 10u)', marca: 'Hartmann',
    category: 'general', unit: 'paquetes', monthlyUsage: 8, status: 'ok',
    lotes: [
      { id: 'l17a', numero: 'LT-GAS-2024-201', cantidad: 6, fechaCompra: '2024-07-20', vencimiento: '2026-07-30', proveedor: 'Farmacia Central', precioUnitario: 6 },
      { id: 'l17b', numero: 'LT-GAS-2024-331', cantidad: 8, fechaCompra: '2024-10-10', vencimiento: '2027-06-30', proveedor: 'Farmacia Central', precioUnitario: 6 },
    ],
  },
  {
    id: 's18', name: 'Barbijos descartables (50u)', marca: 'Kimberly-Clark',
    category: 'general', unit: 'cajas', monthlyUsage: 2, status: 'warn',
    lotes: [
      { id: 'l18a', numero: 'LT-BAR-2024-667', cantidad: 2, fechaCompra: '2024-09-28', vencimiento: '2026-11-20', proveedor: 'Insumos Médicos Plus', precioUnitario: 22 },
    ],
  },
]

// ─── Competitive Intelligence — proveedores por categoría / país ──────────────

export const CI_PAISES = ['Argentina', 'México', 'Colombia', 'Chile'] as const
export type CIPais = typeof CI_PAISES[number]

export interface CIProvider {
  id: string
  empresa: string
  contacto: string
  email: string
  pais: CIPais
  ciudad: string
  precio: number
  moneda: 'USD' | 'ARS' | 'MXN' | 'COP' | 'CLP'
  unidad: string
  stockDisponible: number
  entregaDias: number
  observaciones: string
}

// Proveedores reales encontrados via market research:
// GS Distribuidor (gsdistribuidor.com) — vende Dysport/Juvederm, Argentina
// Suizo Argentina S.A. (suizoargentina.com) — insumos médicos y estéticos
// CYM Distribuidora (cymdistribuidora.com.ar) — insumos estética/cosmética, Posadas
// Distribuidora Peeling (distribuidorapeeling.com.ar) — peeling profesional, Buenos Aires
// BACIMED (bacimed.com.ar) — insumos médicos
// Austral Médica (australmedicasa.com.ar) — distribuidor médico

export const DEMO_CI_PROVIDERS: Record<string, CIProvider[]> = {
  toxin: [
    { id: 'p1', empresa: 'GS Distribuidor',        contacto: 'Equipo de ventas',     email: 'ventas@gsdistribuidor.com',      pais: 'Argentina', ciudad: 'Buenos Aires',    precio: 142, moneda: 'USD', unidad: 'vial 100U', stockDisponible: 30, entregaDias: 2, observaciones: 'Venden Dysport® 500U y Juvederm. Solicitan matrícula profesional. Envío con cadena de frío. gsdistribuidor.com' },
    { id: 'p2', empresa: 'Suizo Argentina S.A.',   contacto: 'Área comercial',       email: 'comercial@suizoargentina.com',   pais: 'Argentina', ciudad: 'Buenos Aires',    precio: 148, moneda: 'USD', unidad: 'vial 100U', stockDisponible: 25, entregaDias: 3, observaciones: 'Integrante de la cadena de suministro de especialidad medicinal. suizoargentina.com' },
    { id: 'p3', empresa: 'Austral Médica SA',      contacto: 'Ventas médica estética', email: 'info@australmedicasa.com.ar',  pais: 'Argentina', ciudad: 'Buenos Aires',    precio: 155, moneda: 'USD', unidad: 'vial 100U', stockDisponible: 18, entregaDias: 1, observaciones: 'Distribuidor de productos médicos de alta complejidad. Entrega 24h CABA. australmedicasa.com.ar' },
    { id: 'p4', empresa: 'BACIMED',                contacto: 'Sector insumos',       email: 'ventas@bacimed.com.ar',          pais: 'Argentina', ciudad: 'Buenos Aires',    precio: 138, moneda: 'USD', unidad: 'vial 100U', stockDisponible: 40, entregaDias: 2, observaciones: 'Proveedores de insumos médicos para el sector salud. Precios competitivos. bacimed.com.ar' },
    { id: 'p5', empresa: 'GS Distribuidor MX',    contacto: 'Equipo LATAM',         email: 'latam@gsdistribuidor.com',       pais: 'México',    ciudad: 'Ciudad de México', precio: 135, moneda: 'USD', unidad: 'vial 100U', stockDisponible: 50, entregaDias: 5, observaciones: 'Sucursal México. Importación directa Galderma y Allergan. us-gsdistribuidor.com' },
    { id: 'p6', empresa: 'Dermo Supply Colombia', contacto: 'Lic. Andrea Torres',   email: 'info@dermosupply.co',            pais: 'Colombia',  ciudad: 'Bogotá',           precio: 130, moneda: 'USD', unidad: 'vial 100U', stockDisponible: 28, entregaDias: 7, observaciones: 'Precio competitivo LATAM. Stock permanente Botox y Dysport.' },
    { id: 'p7', empresa: 'MedPro Chile',          contacto: 'Sra. Camila Vidal',    email: 'contacto@medprochile.cl',        pais: 'Chile',     ciudad: 'Santiago',         precio: 144, moneda: 'USD', unidad: 'vial 100U', stockDisponible: 20, entregaDias: 4, observaciones: 'Distribuidor Merz y Galderma en Chile. Envío refrigerado.' },
  ],
  filler: [
    { id: 'p8',  empresa: 'GS Distribuidor',       contacto: 'Equipo de ventas',     email: 'ventas@gsdistribuidor.com',      pais: 'Argentina', ciudad: 'Buenos Aires',    precio: 205, moneda: 'USD', unidad: 'jeringa 1ml', stockDisponible: 22, entregaDias: 2, observaciones: 'Venden Juvederm Ultra 3 y 4. Requieren matrícula. Entrega con cadena de frío. gsdistribuidor.com' },
    { id: 'p9',  empresa: 'Suizo Argentina S.A.',  contacto: 'Área comercial',       email: 'comercial@suizoargentina.com',   pais: 'Argentina', ciudad: 'Buenos Aires',    precio: 215, moneda: 'USD', unidad: 'jeringa 1ml', stockDisponible: 30, entregaDias: 2, observaciones: 'Stock Restylane, Juvederm y Teosyal aprobados ANMAT. Pago a 30/60 días. suizoargentina.com' },
    { id: 'p10', empresa: 'BACIMED',               contacto: 'Sector insumos',       email: 'ventas@bacimed.com.ar',          pais: 'Argentina', ciudad: 'Buenos Aires',    precio: 198, moneda: 'USD', unidad: 'jeringa 1ml', stockDisponible: 15, entregaDias: 3, observaciones: 'Fillers con certificación ANMAT. Amplia variedad de marcas. bacimed.com.ar' },
    { id: 'p11', empresa: 'Nutramedix',            contacto: 'Equipo comercial',     email: 'ventas@nutramedix.co',           pais: 'México',    ciudad: 'Ciudad de México', precio: 192, moneda: 'USD', unidad: 'jeringa 1ml', stockDisponible: 35, entregaDias: 6, observaciones: 'HA, skinboosters, bioestimuladores. Distribución LATAM. nutramedix.co' },
    { id: 'p12', empresa: 'FillerPro Colombia',    contacto: 'Dra. Sofía Molina',    email: 'info@fillerpro.co',              pais: 'Colombia',  ciudad: 'Medellín',         precio: 188, moneda: 'USD', unidad: 'jeringa 1ml', stockDisponible: 40, entregaDias: 6, observaciones: 'Precio competitivo LATAM. Stock garantizado Restylane y Juvederm.' },
  ],
  peel: [
    { id: 'p13', empresa: 'Distribuidora Peeling', contacto: 'Equipo de ventas',     email: 'ventas@distribuidorapeeling.com.ar', pais: 'Argentina', ciudad: 'Buenos Aires', precio: 44, moneda: 'USD', unidad: 'frasco 100ml', stockDisponible: 60, entregaDias: 2, observaciones: 'Especialistas en peeling profesional. Líneas Lidherma, Idraet, Icono, HDM. distribuidorapeeling.com.ar' },
    { id: 'p14', empresa: 'CYM Distribuidora',    contacto: 'Equipo comercial',     email: 'info@cymdistribuidora.com.ar',       pais: 'Argentina', ciudad: 'Posadas',      precio: 48, moneda: 'USD', unidad: 'frasco 100ml', stockDisponible: 40, entregaDias: 3, observaciones: 'Insumos de estética y cosmética. Envío a todo el país. cymdistribuidora.com.ar' },
    { id: 'p15', empresa: 'BACIMED',              contacto: 'Sector insumos',       email: 'ventas@bacimed.com.ar',              pais: 'Argentina', ciudad: 'Buenos Aires', precio: 50, moneda: 'USD', unidad: 'frasco 100ml', stockDisponible: 35, entregaDias: 2, observaciones: 'Ácidos AHA y BHA para uso profesional. Stock permanente. bacimed.com.ar' },
    { id: 'p16', empresa: 'DermaChem México',     contacto: 'Lic. Patricia Soto',   email: 'ventas@dermachem.mx',                pais: 'México',    ciudad: 'CDMX',         precio: 40, moneda: 'USD', unidad: 'frasco 100ml', stockDisponible: 80, entregaDias: 7, observaciones: 'Precio más bajo de LATAM. AHA y BHA profesionales de laboratorio.' },
  ],
  prp: [
    { id: 'p17', empresa: 'BACIMED',              contacto: 'Sector insumos',       email: 'ventas@bacimed.com.ar',          pais: 'Argentina', ciudad: 'Buenos Aires',    precio: 76, moneda: 'USD', unidad: 'kit', stockDisponible: 20, entregaDias: 2, observaciones: 'Kits PRP y centrifugadoras. Insumos para regenerativa. bacimed.com.ar' },
    { id: 'p18', empresa: 'Austral Médica SA',    contacto: 'Ventas médica',        email: 'info@australmedicasa.com.ar',    pais: 'Argentina', ciudad: 'Buenos Aires',    precio: 80, moneda: 'USD', unidad: 'kit', stockDisponible: 15, entregaDias: 1, observaciones: 'Productos médicos de alta complejidad. Kits RegenKit disponibles. australmedicasa.com.ar' },
    { id: 'p19', empresa: 'RegenCell Colombia',  contacto: 'Dr. Sebastián López',  email: 'ventas@regencell.co',            pais: 'Colombia',  ciudad: 'Bogotá',           precio: 72, moneda: 'USD', unidad: 'kit', stockDisponible: 30, entregaDias: 7, observaciones: 'Importación directa Regen Lab. Precio más bajo LATAM.' },
  ],
  mesotherapy: [
    { id: 'p20', empresa: 'GS Distribuidor',      contacto: 'Equipo de ventas',     email: 'ventas@gsdistribuidor.com',      pais: 'Argentina', ciudad: 'Buenos Aires',    precio: 85, moneda: 'USD', unidad: 'vial 3ml', stockDisponible: 18, entregaDias: 2, observaciones: 'NCTF 135HA y 135+ disponible. Distribución con cadena de frío. gsdistribuidor.com' },
    { id: 'p21', empresa: 'Suizo Argentina S.A.', contacto: 'Área comercial',       email: 'comercial@suizoargentina.com',   pais: 'Argentina', ciudad: 'Buenos Aires',    precio: 90, moneda: 'USD', unidad: 'vial 3ml', stockDisponible: 25, entregaDias: 3, observaciones: 'Filorga, NCTF y cocktails aprobados ANMAT. suizoargentina.com' },
    { id: 'p22', empresa: 'MesoSupply Chile',     contacto: 'Sra. Daniela Pérez',   email: 'ventas@mesosupply.cl',           pais: 'Chile',     ciudad: 'Santiago',         precio: 83, moneda: 'USD', unidad: 'vial 3ml', stockDisponible: 15, entregaDias: 5, observaciones: 'Filorga y NCTF. Envío refrigerado garantizado.' },
  ],
  general: [
    { id: 'p23', empresa: 'CYM Distribuidora',    contacto: 'Equipo comercial',     email: 'info@cymdistribuidora.com.ar',   pais: 'Argentina', ciudad: 'Posadas',          precio: 7,  moneda: 'USD', unidad: 'caja 100u', stockDisponible: 300, entregaDias: 2, observaciones: 'Descartables y complementos para estética. Venta mayorista exclusiva a profesionales. cymdistribuidora.com.ar' },
    { id: 'p24', empresa: 'BACIMED',              contacto: 'Sector insumos',       email: 'ventas@bacimed.com.ar',          pais: 'Argentina', ciudad: 'Buenos Aires',     precio: 9,  moneda: 'USD', unidad: 'caja 100u', stockDisponible: 150, entregaDias: 1, observaciones: 'Agujas, jeringas, guantes y descartables en stock permanente. bacimed.com.ar' },
    { id: 'p25', empresa: 'Austral Médica SA',    contacto: 'Ventas médica',        email: 'info@australmedicasa.com.ar',    pais: 'Argentina', ciudad: 'Buenos Aires',     precio: 10, moneda: 'USD', unidad: 'caja 100u', stockDisponible: 100, entregaDias: 1, observaciones: 'Insumos descartables de alta calidad. Entrega 24h CABA. australmedicasa.com.ar' },
    { id: 'p26', empresa: 'MedSupply México',     contacto: 'Sr. Jorge Mendoza',    email: 'ventas@medsupply.mx',            pais: 'México',    ciudad: 'Monterrey',        precio: 6,  moneda: 'USD', unidad: 'caja 100u', stockDisponible: 500, entregaDias: 7, observaciones: 'Precio mayorista más bajo. Envío a toda LATAM.' },
  ],
}

export interface QuoteResponse {
  id: string
  proveedorId: string
  empresa: string
  emailDe: string
  emailPara: string
  fechaEnviado: string
  fechaRespuesta: string
  asunto: string
  emailEnviado: string   // texto del email que se envió
  respuesta: string      // texto de la respuesta recibida
  precio: number
  moneda: 'USD' | 'ARS' | 'MXN' | 'COP'
  unidad: string
  disponibilidad: string
}

export const DEMO_QUOTE_RESPONSES: QuoteResponse[] = [
  {
    id: 'qr1',
    proveedorId: 'p1',
    empresa: 'GS Distribuidor',
    emailDe: 'ventas@gsdistribuidor.com',
    emailPara: 'hola@aestheticiq.app',
    fechaEnviado: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    fechaRespuesta: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    asunto: 'Solicitud de cotización — Toxina Botulínica',
    emailEnviado: `Estimado equipo de GS Distribuidor,

Me comunico desde Clínica Demo · Aesthetic IQ. Estamos evaluando proveedores de toxina botulínica y nos interesa recibir una cotización actualizada para:

- Botox® 100U (aproximadamente 8-10 unidades mensuales)
- Dysport® 500U (aproximadamente 4 unidades mensuales)

Adjunto matrícula profesional. Necesitamos precio unitario, condiciones de pago, entrega con cadena de frío y disponibilidad de stock.

Quedo a disposición.

Dra. Valentina Ruiz
Clínica Demo · Aesthetic IQ
Buenos Aires, Argentina`,
    respuesta: `Estimada Dra. Ruiz, muchas gracias por contactarnos desde Aesthetic IQ.

Cotización para su clínica:

• Dysport® 500U: USD 142 / vial (stock: 30 unidades disponibles)
• Botox® 100U: consultar disponibilidad según lote

Condiciones: pago con tarjeta o transferencia. Entrega CABA/GBA en 48hs con cadena de frío documentada. Para pedidos de 5+ viales no cobramos logística.

Podemos coordinar por WhatsApp para mayor agilidad.

Equipo GS Distribuidor — gsdistribuidor.com`,
    precio: 142,
    moneda: 'USD',
    unidad: 'vial 100U',
    disponibilidad: 'Stock inmediato · entrega 48hs',
  },
  {
    id: 'qr2',
    proveedorId: 'p4',
    empresa: 'BACIMED',
    emailDe: 'ventas@bacimed.com.ar',
    emailPara: 'hola@aestheticiq.app',
    fechaEnviado: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    fechaRespuesta: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    asunto: 'Solicitud de cotización — Toxina Botulínica',
    emailEnviado: `Estimado equipo de BACIMED,

Me comunico desde Clínica Demo · Aesthetic IQ. Estamos evaluando proveedores de toxina botulínica y nos interesa recibir una cotización actualizada para:

- Botox® 100U (aproximadamente 8-10 unidades mensuales)
- Dysport® 500U (aproximadamente 4 unidades mensuales)

Necesitamos precio unitario, condiciones de pago, tiempo de entrega y disponibilidad de stock.

Quedo a disposición.

Dra. Valentina Ruiz
Clínica Demo · Aesthetic IQ
Buenos Aires, Argentina`,
    respuesta: `Estimada Dra. Ruiz, gracias por contactarse con BACIMED.

Como proveedores de insumos médicos para el sector salud, le acercamos nuestra cotización:

• Botox® 100U: USD 138 / vial (stock: 40 u.)
• Dysport® 500U: USD 135 / vial (stock: 25 u.)

Descuento del 5% a partir de 10 unidades, 8% a partir de 20 unidades.
Entrega CABA/GBA en 24-48hs. Interior del país en 3-5 días hábiles.
Factura A disponible. Aceptamos transferencia, tarjeta y cheque.

Quedamos atentos a su respuesta.
Sector Insumos — BACIMED · bacimed.com.ar`,
    precio: 138,
    moneda: 'USD',
    unidad: 'vial 100U',
    disponibilidad: 'Entrega 3-5 días hábiles',
  },
]

// ─── Legacy export (usado en portal) ─────────────────────────────────────────

export const DEMO_MESSAGES = DEMO_MESSAGE_SCHEDULE['demo-t1'].filter(m => m.status === 'sent')

// ─── Progress story (Sofía) ───────────────────────────────────────────────────

export const DEMO_STORY = {
  title: '✨ Tu piel lo dice todo, Sofía',
  narrative: 'A 45 días de tu tratamiento con toxina botulínica, los resultados hablan solos. La zona del entrecejo muestra una suavización del 67% y las líneas de expresión en la frente se redujeron notablemente. Tu piel luce más descansada y natural, sin perder expresividad.',
  highlightValue: '67%',
  highlightLabel: 'de mejora en glabela',
  ctaText: 'En 45 días coordinamos tu próximo paso para mantener estos resultados.',
}
