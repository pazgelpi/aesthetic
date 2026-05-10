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

export interface StockItem {
  id: string
  name: string
  category: 'toxin' | 'filler' | 'peel' | 'prp' | 'mesotherapy' | 'laser' | 'general'
  stock: number
  unit: string
  monthlyUsage: number
  costPerUnit: number
  status: StockStatus
  // detail fields
  marca: string
  proveedor: string
  lote: string
  vencimiento: string   // ISO date
  tratamiento: string   // treatment type key
}

export const DEMO_STOCK: StockItem[] = [
  // ── Toxina ──
  { id: 's1',  name: 'Viales Botox® 100U',          category: 'toxin',       stock: 8,  unit: 'viales',   monthlyUsage: 12, costPerUnit: 145, status: 'ok',       marca: 'Allergan (AbbVie)', proveedor: 'Droguería del Sur SA',      lote: 'LT-BOT-2024-089', vencimiento: '2026-08-31', tratamiento: 'toxin' },
  { id: 's2',  name: 'Viales Dysport® 500U',         category: 'toxin',       stock: 2,  unit: 'viales',   monthlyUsage: 4,  costPerUnit: 160, status: 'critical',  marca: 'Galderma',         proveedor: 'MedEstética SA',            lote: 'LT-DYS-2024-112', vencimiento: '2026-05-31', tratamiento: 'toxin' },
  { id: 's3',  name: 'Viales Xeomin® 100U',          category: 'toxin',       stock: 5,  unit: 'viales',   monthlyUsage: 6,  costPerUnit: 138, status: 'ok',       marca: 'Merz Aesthetics',  proveedor: 'BioFarma Distribuidora',    lote: 'LT-XEO-2024-077', vencimiento: '2026-10-15', tratamiento: 'toxin' },
  // ── Filler ──
  { id: 's4',  name: 'Restylane® Kysse 1ml',         category: 'filler',      stock: 3,  unit: 'jeringas', monthlyUsage: 5,  costPerUnit: 220, status: 'warn',      marca: 'Galderma',         proveedor: 'MedEstética SA',            lote: 'LT-RES-2024-304', vencimiento: '2027-01-20', tratamiento: 'filler' },
  { id: 's5',  name: 'Juvederm® Ultra 1ml',           category: 'filler',      stock: 5,  unit: 'jeringas', monthlyUsage: 4,  costPerUnit: 215, status: 'ok',       marca: 'Allergan (AbbVie)', proveedor: 'Droguería del Sur SA',      lote: 'LT-JUV-2024-218', vencimiento: '2027-03-10', tratamiento: 'filler' },
  { id: 's6',  name: 'Teosyal® RHA 3 1ml',           category: 'filler',      stock: 2,  unit: 'jeringas', monthlyUsage: 3,  costPerUnit: 235, status: 'warn',      marca: 'Teoxane',          proveedor: 'Dermocosméticos Arg.',      lote: 'LT-TEO-2024-091', vencimiento: '2026-12-05', tratamiento: 'filler' },
  { id: 's7',  name: 'Cánulas 25G (caja 20u)',        category: 'filler',      stock: 1,  unit: 'cajas',    monthlyUsage: 2,  costPerUnit: 45,  status: 'critical',  marca: 'TSK Laboratory',   proveedor: 'Insumos Médicos Plus',      lote: 'LT-CAN-2024-560', vencimiento: '2028-06-01', tratamiento: 'filler' },
  { id: 's8',  name: 'EMLA crema 30g',                category: 'filler',      stock: 4,  unit: 'pomos',    monthlyUsage: 3,  costPerUnit: 28,  status: 'ok',       marca: 'Aspen / AstraZeneca', proveedor: 'Farmacia Central',       lote: 'LT-EML-2024-022', vencimiento: '2026-09-15', tratamiento: 'filler' },
  // ── Peeling ──
  { id: 's9',  name: 'Ácido glicólico 30% 100ml',    category: 'peel',        stock: 2,  unit: 'frascos',  monthlyUsage: 4,  costPerUnit: 55,  status: 'warn',      marca: 'Dermalogica',      proveedor: 'Cosméticos Profesionales',  lote: 'LT-AGL-2024-188', vencimiento: '2025-11-30', tratamiento: 'peel' },
  { id: 's10', name: 'Ácido salicílico 20% 100ml',   category: 'peel',        stock: 6,  unit: 'frascos',  monthlyUsage: 3,  costPerUnit: 42,  status: 'ok',       marca: 'Dermalogica',      proveedor: 'Cosméticos Profesionales',  lote: 'LT-ASA-2024-190', vencimiento: '2026-03-20', tratamiento: 'peel' },
  { id: 's11', name: 'Neutralizador peeling 100ml',  category: 'peel',        stock: 1,  unit: 'frascos',  monthlyUsage: 3,  costPerUnit: 38,  status: 'critical',  marca: 'Jan Marini',       proveedor: 'BeautyPro Distribuciones',  lote: 'LT-NEU-2024-033', vencimiento: '2025-08-10', tratamiento: 'peel' },
  // ── PRP ──
  { id: 's12', name: 'Kits PRP centrifugación',      category: 'prp',         stock: 5,  unit: 'kits',     monthlyUsage: 6,  costPerUnit: 85,  status: 'warn',      marca: 'RegenKit® (Regen Lab)', proveedor: 'BioCell Argentina',    lote: 'LT-PRP-2024-441', vencimiento: '2026-07-01', tratamiento: 'prp' },
  // ── Mesoterapia ──
  { id: 's13', name: 'NCTF 135 HA (Filorga)',         category: 'mesotherapy', stock: 3,  unit: 'viales',   monthlyUsage: 8,  costPerUnit: 95,  status: 'critical',  marca: 'Institut Esthederm (Filorga)', proveedor: 'MedEstética SA', lote: 'LT-NCT-2024-205', vencimiento: '2026-04-30', tratamiento: 'mesotherapy' },
  // ── General ──
  { id: 's14', name: 'Jeringas tuberculina 1ml',     category: 'general',     stock: 4,  unit: 'cajas',    monthlyUsage: 3,  costPerUnit: 12,  status: 'ok',       marca: 'BD (Becton Dickinson)', proveedor: 'Insumos Médicos Plus',  lote: 'LT-JER-2024-889', vencimiento: '2027-12-01', tratamiento: 'general' },
  { id: 's15', name: 'Agujas 30G x ½" (caja 100u)',  category: 'general',     stock: 1,  unit: 'cajas',    monthlyUsage: 3,  costPerUnit: 9,   status: 'critical',  marca: 'BD (Becton Dickinson)', proveedor: 'Insumos Médicos Plus',  lote: 'LT-AGU-2024-102', vencimiento: '2027-08-15', tratamiento: 'general' },
  { id: 's16', name: 'Guantes nitrilo M (caja 100u)', category: 'general',    stock: 6,  unit: 'cajas',    monthlyUsage: 4,  costPerUnit: 18,  status: 'ok',       marca: 'Ansell',           proveedor: 'Farmacia Central',          lote: 'LT-GUA-2024-774', vencimiento: '2028-01-01', tratamiento: 'general' },
  { id: 's17', name: 'Gasas estériles (paq. 10u)',   category: 'general',     stock: 14, unit: 'paquetes', monthlyUsage: 8,  costPerUnit: 6,   status: 'ok',       marca: 'Hartmann',         proveedor: 'Farmacia Central',          lote: 'LT-GAS-2024-331', vencimiento: '2027-06-30', tratamiento: 'general' },
  { id: 's18', name: 'Barbijos descartables (50u)',  category: 'general',     stock: 2,  unit: 'cajas',    monthlyUsage: 2,  costPerUnit: 22,  status: 'warn',      marca: 'Kimberly-Clark',   proveedor: 'Insumos Médicos Plus',      lote: 'LT-BAR-2024-667', vencimiento: '2026-11-20', tratamiento: 'general' },
]

// ─── Competitive Intelligence — proveedores por producto ─────────────────────

export interface CIProvider {
  id: string
  empresa: string
  contacto: string
  email: string
  precio: number
  moneda: 'USD' | 'ARS'
  unidad: string
  stockDisponible: number
  entregaDias: number
  zona: string
  observaciones: string
}

export const DEMO_CI_PROVIDERS: Record<string, CIProvider[]> = {
  toxin: [
    { id: 'p1', empresa: 'MedEstética SA',           contacto: 'Lic. Daniela Vega',    email: 'ventas@medest.com.ar',      precio: 148, moneda: 'USD', unidad: 'vial 100U', stockDisponible: 40, entregaDias: 2, zona: 'CABA / GBA',         observaciones: 'Distribuidor oficial Allergan. Pago a 30 días.' },
    { id: 'p2', empresa: 'Droguería del Sur SA',     contacto: 'Sr. Martín Álvarez',   email: 'compras@drogueriadelsur.com', precio: 142, moneda: 'USD', unidad: 'vial 100U', stockDisponible: 22, entregaDias: 3, zona: 'Nacional',           observaciones: 'Precio incluye flete hasta $500 USD. Stock limitado Dysport.' },
    { id: 'p3', empresa: 'BioFarma Distribuidora',  contacto: 'Dra. Carla Suárez',    email: 'info@biofarma.ar',           precio: 155, moneda: 'USD', unidad: 'vial 100U', stockDisponible: 15, entregaDias: 1, zona: 'CABA',               observaciones: 'Entrega en 24h. Incluye cadena de frío certificada.' },
    { id: 'p4', empresa: 'ImportMed Latam',          contacto: 'Sr. Roberto Fuentes',  email: 'cotizaciones@importmed.com', precio: 135, moneda: 'USD', unidad: 'vial 100U', stockDisponible: 60, entregaDias: 5, zona: 'Nacional / Import.', observaciones: 'Precio más bajo del mercado. Importación directa Galderma.' },
  ],
  filler: [
    { id: 'p5', empresa: 'Dermocosméticos Arg.',     contacto: 'Lic. Valentina Cruz',  email: 'ventas@dermocos.com.ar',    precio: 210, moneda: 'USD', unidad: 'jeringa 1ml', stockDisponible: 18, entregaDias: 2, zona: 'CABA / GBA',       observaciones: 'Distribuidor oficial Teoxane. Incluye capacitación.' },
    { id: 'p6', empresa: 'MedEstética SA',           contacto: 'Lic. Daniela Vega',    email: 'ventas@medest.com.ar',      precio: 218, moneda: 'USD', unidad: 'jeringa 1ml', stockDisponible: 30, entregaDias: 2, zona: 'Nacional',         observaciones: 'Stock Restylane y Juvederm disponible. Pago a 30/60 días.' },
    { id: 'p7', empresa: 'BeautyPro Distribuciones', contacto: 'Sra. Inés Morales',   email: 'pedidos@beautypro.ar',      precio: 205, moneda: 'USD', unidad: 'jeringa 1ml', stockDisponible: 12, entregaDias: 3, zona: 'Nacional',         observaciones: 'Precio especial por volumen (+10 jeringas). Variedad de marcas.' },
  ],
  peel: [
    { id: 'p8', empresa: 'Cosméticos Profesionales', contacto: 'Sr. Diego Ramos',      email: 'ventas@cosmpro.com.ar',     precio: 48,  moneda: 'USD', unidad: 'frasco 100ml', stockDisponible: 50, entregaDias: 2, zona: 'Nacional',        observaciones: 'Línea completa AHA/BHA. Descuento 10% por compra de set.' },
    { id: 'p9', empresa: 'BeautyPro Distribuciones', contacto: 'Sra. Inés Morales',   email: 'pedidos@beautypro.ar',      precio: 52,  moneda: 'USD', unidad: 'frasco 100ml', stockDisponible: 35, entregaDias: 3, zona: 'Nacional',        observaciones: 'Incluye neutralizador de regalo por compra de 6+ frascos.' },
  ],
  prp: [
    { id: 'p10', empresa: 'BioCell Argentina',       contacto: 'Dr. Gustavo Ríos',     email: 'info@biocell.com.ar',       precio: 78,  moneda: 'USD', unidad: 'kit',         stockDisponible: 25, entregaDias: 2, zona: 'Nacional',        observaciones: 'Distribuidor oficial RegenKit. Incluye soporte técnico.' },
    { id: 'p11', empresa: 'MedLab Insumos',          contacto: 'Lic. Paula Gómez',     email: 'compras@medlab.ar',         precio: 82,  moneda: 'USD', unidad: 'kit',         stockDisponible: 10, entregaDias: 1, zona: 'CABA',            observaciones: 'Kits compatibles con centrifugadoras Hettich y Thermo.' },
  ],
  mesotherapy: [
    { id: 'p12', empresa: 'MedEstética SA',          contacto: 'Lic. Daniela Vega',    email: 'ventas@medest.com.ar',      precio: 88,  moneda: 'USD', unidad: 'vial 3ml',    stockDisponible: 20, entregaDias: 2, zona: 'CABA / GBA',      observaciones: 'NCTF 135HA y 135+ disponible. Distribuidor oficial Filorga.' },
    { id: 'p13', empresa: 'ImportMed Latam',         contacto: 'Sr. Roberto Fuentes',  email: 'cotizaciones@importmed.com', precio: 82, moneda: 'USD', unidad: 'vial 3ml',    stockDisponible: 45, entregaDias: 4, zona: 'Nacional',        observaciones: 'Importación directa. Precio más bajo. Stock garantizado.' },
  ],
  general: [
    { id: 'p14', empresa: 'Insumos Médicos Plus',    contacto: 'Sr. Carlos Herrera',   email: 'ventas@insumosplus.com.ar', precio: 8,   moneda: 'USD', unidad: 'caja 100u',   stockDisponible: 200, entregaDias: 1, zona: 'Nacional',       observaciones: 'Todo tipo de agujas, jeringas y descartables. Precios mayoristas.' },
    { id: 'p15', empresa: 'Farmacia Central',        contacto: 'Sra. Ana Rodríguez',   email: 'farmacia@central.com.ar',   precio: 10,  moneda: 'USD', unidad: 'caja 100u',   stockDisponible: 80, entregaDias: 1, zona: 'CABA',            observaciones: 'Entrega el mismo día antes de las 15hs. Variedad completa.' },
  ],
}

export interface QuoteResponse {
  id: string
  empresa: string
  email: string
  fechaRespuesta: string
  asunto: string
  cuerpo: string
  precio: number
  moneda: 'USD' | 'ARS'
  unidad: string
  disponibilidad: string
}

export const DEMO_QUOTE_RESPONSES: QuoteResponse[] = [
  {
    id: 'qr1',
    empresa: 'MedEstética SA',
    email: 'ventas@medest.com.ar',
    fechaRespuesta: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    asunto: 'Re: Solicitud de cotización — Toxina Botulínica',
    cuerpo: 'Estimada Dra. Ruiz, muchas gracias por contactarnos. Le enviamos nuestra cotización actualizada para Botox® 100U y Dysport® 500U. Contamos con stock disponible para entrega inmediata en CABA. Podemos coordinar una visita de nuestro asesor si lo desea.',
    precio: 148,
    moneda: 'USD',
    unidad: 'vial 100U',
    disponibilidad: 'Stock inmediato',
  },
  {
    id: 'qr2',
    empresa: 'ImportMed Latam',
    email: 'cotizaciones@importmed.com',
    fechaRespuesta: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    asunto: 'Re: Solicitud de cotización — Toxina Botulínica',
    cuerpo: 'Hola Dra. Ruiz. Recibimos su consulta. Somos importadores directos de Galderma y podemos ofrecerle el mejor precio del mercado en Dysport® 500U. Para pedidos de 10+ viales aplicamos 8% de descuento adicional. Trabajamos con todas las provincias, entrega en 3-5 días hábiles.',
    precio: 135,
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
