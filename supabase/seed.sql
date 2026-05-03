-- Seed data for Aesthetic IQ
-- Run this AFTER creating a user through the app (magic link login)
-- Replace 'YOUR_USER_UUID' with the actual UUID from auth.users

-- 1. Create clinic
INSERT INTO clinics (id, name, owner_email, city, phone) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Clínica Estética Demo', 'demo@aestheticiq.app', 'Buenos Aires', '+54 11 4000-0000')
ON CONFLICT (id) DO NOTHING;

-- 2. Create clinic profile (voice configured)
INSERT INTO clinic_profiles (
  clinic_id, formality_level, pronoun_usage, emoji_usage,
  brand_story, signature_template, wizard_step, wizard_completed_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'friendly', 'voseo', 'minimal',
  'Somos una clínica premium de medicina estética ubicada en Buenos Aires. Nos especializamos en toxina botulínica y filler facial con resultados naturales. Nuestro objetivo es que cada paciente se sienta más segura de sí misma.',
  'Un beso, {professional_first_name} de {clinic_name} ✨',
  6,
  now()
)
ON CONFLICT (clinic_id) DO NOTHING;

-- 3. Default message templates
INSERT INTO message_templates (template_type, trigger_offset_days, prompt_instructions, is_active) VALUES
  ('day0_welcome', 0, 'Enviá un mensaje de bienvenida cálido post-tratamiento. Recordá los cuidados inmediatos más importantes (no frotarse, no hacer ejercicio intenso hoy, no alcohol). Máx 4 oraciones.', true),
  ('day3_checkin', 3, 'Hacé un check-in a los 3 días. Preguntá cómo se siente, si notó los primeros resultados, si tiene alguna duda. Sé empática y accesible. Máx 3 oraciones.', true),
  ('day14_photo_request', 14, 'Pedile que saque fotos de los resultados a los 14 días. Explicá brevemente por qué es importante documentar el progreso. Incluí el link de captura si está disponible. Máx 3 oraciones.', true),
  ('day30_progress', 30, 'Celebrá los resultados al mes. Preguntá cómo se siente con los resultados y si está pensando en el próximo tratamiento. Sé entusiasta pero no presiones. Máx 3 oraciones.', true),
  ('day90_reactivation', 90, 'Recordá a la paciente que se aproxima el momento ideal para su próximo tratamiento. Invitala a agendar turno. Sé sutil y no presiones. Máx 2 oraciones.', true)
ON CONFLICT DO NOTHING;

-- 4. Clinic protocols
INSERT INTO clinic_protocols (
  clinic_id, treatment_type, preferred_brands, typical_areas,
  default_re_treatment_days, contraindications,
  pre_treatment_instructions, post_treatment_immediate,
  post_treatment_week, post_treatment_long_term,
  recommended_products, patient_education_text
) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'toxin',
  ARRAY['Botox', 'Dysport', 'Xeomin'],
  ARRAY['Frontal', 'Glabela', 'Patas de gallo', 'Bunny lines'],
  120,
  ARRAY['Embarazo', 'Lactancia', 'Miastenia gravis', 'Alergia a la toxina botulínica', 'Infección activa en la zona'],
  'Evitá tomar aspirina o ibuprofeno 5 días antes. Llegá sin maquillaje. Avisanos si tuvieras herpes activo.',
  'No tocarte ni masajear la zona durante 4 horas. No hacer ejercicio intenso el día del tratamiento. Evitá el alcohol. Podés aplicar frío si hay molestia.',
  'Podés notar el efecto completo entre los días 5 y 14. Si algún área no quedó como esperabas, avisanos para evaluar un retoque sin cargo.',
  'El efecto dura aproximadamente 4 meses. Para mantener resultados óptimos, recomendamos no esperar a que desaparezca completamente entre sesiones.',
  'Vitamina C tópica, protector solar SPF 50 diario, sérum con retinol (de noche, consultar dosis según tipo de piel).',
  'La toxina botulínica actúa relajando los músculos responsables de las arrugas de expresión. El efecto es gradual y alcanza su pico entre los días 7 y 14. Es temporal y reversible.'
),
(
  '00000000-0000-0000-0000-000000000001',
  'filler',
  ARRAY['Juvederm', 'Restylane', 'Sculptra'],
  ARRAY['Labios', 'Surcos nasogenianos', 'Pómulos', 'Ojeras'],
  240,
  ARRAY['Embarazo', 'Lactancia', 'Alergia al ácido hialurónico', 'Coagulopatías', 'Keloides'],
  'Evitá sangre o anticoagulantes 5 días antes. No tomar vitamina E ni omega-3. Hidratate bien.',
  'Aplicá frío intermitente las primeras 24 horas. Puede haber inflamación y hematomas que se resuelven en 5-7 días. Evitá presionar la zona.',
  'La inflamación inicial puede enmascarar el resultado final. Evaluamos el resultado definitivo a los 14 días.',
  'El ácido hialurónico dura entre 6 y 18 meses según la zona y el metabolismo de cada paciente.',
  'Hidratante con ácido hialurónico, protector solar SPF 50, suplemento oral de colágeno.',
  'El filler de ácido hialurónico rellena y da volumen de forma natural y reversible. Los resultados son inmediatos y mejoran en los primeros 14 días a medida que el gel se integra.'
)
ON CONFLICT (clinic_id, treatment_type) DO NOTHING;

-- 5. Sample patients (requires a professional to exist first)
-- These are inserted WITHOUT patient_id link since we don't know the professional UUID yet.
-- After you log in and create your professional, run this manually updating clinic_id:

-- INSERT INTO patients (clinic_id, full_name, first_name, email, phone_e164, date_of_birth, consent_given_at, status)
-- VALUES
--   ('YOUR_CLINIC_ID', 'Valentina López', 'Valentina', 'vale@example.com', '+5491112345678', '1990-03-15', now(), 'active'),
--   ('YOUR_CLINIC_ID', 'Camila Torres', 'Camila', 'cami@example.com', '+5491198765432', '1985-07-22', now(), 'active'),
--   ('YOUR_CLINIC_ID', 'Sofía Martínez', 'Sofía', null, '+5491187654321', '1995-11-08', now(), 'active'),
--   ('YOUR_CLINIC_ID', 'Luciana García', 'Luciana', 'luci@example.com', '+5491176543210', '1988-04-30', now(), 'active'),
--   ('YOUR_CLINIC_ID', 'Martina Rodríguez', 'Martina', null, '+5491165432109', '1993-09-14', now(), 'active');
