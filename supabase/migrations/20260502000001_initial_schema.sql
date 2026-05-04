-- ============ CORE ENTITIES ============

create table clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_email text not null unique,
  phone text,
  address text,
  city text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table professionals (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text not null,
  role text not null check (role in ('owner', 'professional')),
  created_at timestamptz default now()
);

create table patients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id) on delete cascade not null,
  full_name text not null,
  first_name text not null,
  email text,
  phone_e164 text not null,
  date_of_birth date,
  consent_given_at timestamptz,
  consent_signature_url text,
  notes text,
  status text check (status in ('active', 'paused', 'archived')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ PERSONALIZATION LAYER (D2) ============

create table clinic_profiles (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id) on delete cascade not null unique,
  -- Tone
  formality_level text not null default 'friendly' check (formality_level in ('formal', 'casual', 'friendly')),
  pronoun_usage text not null default 'voseo' check (pronoun_usage in ('voseo', 'tuteo', 'usted')),
  emoji_usage text not null default 'minimal' check (emoji_usage in ('none', 'minimal', 'moderate')),
  -- Voice samples
  voice_sample_1 text,
  voice_sample_2 text,
  voice_sample_3 text,
  -- Branding
  logo_url text,
  primary_color text default '#7C3AED',
  brand_story text,
  -- Signature
  signature_template text default 'Soy {professional_first_name} de {clinic_name}',
  -- Knowledge base
  knowledge_base_text text,
  knowledge_base_updated_at timestamptz,
  -- Wizard progress
  wizard_step int default 0,
  wizard_completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table clinic_protocols (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id) on delete cascade not null,
  treatment_type text not null check (treatment_type in ('toxin', 'filler')),
  preferred_brands text[],
  typical_areas text[],
  default_re_treatment_days int not null default 120,
  contraindications text[],
  pre_treatment_instructions text,
  post_treatment_immediate text,
  post_treatment_week text,
  post_treatment_long_term text,
  recommended_products text,
  patient_education_text text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(clinic_id, treatment_type)
);

create table clinic_documents (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id) on delete cascade not null,
  filename text not null,
  file_url text not null,
  document_type text check (document_type in ('protocol', 'education', 'product_info', 'other')),
  extracted_text text,
  status text not null default 'uploaded' check (status in ('uploaded', 'processing', 'processed', 'failed')),
  error_message text,
  created_at timestamptz default now()
);

-- ============ TREATMENTS & PHOTOS (D3) ============

create table treatments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade not null,
  clinic_id uuid references clinics(id) on delete cascade not null,
  professional_id uuid references professionals(id) not null,
  treatment_type text not null check (treatment_type in ('toxin', 'filler')),
  product_brand text,
  units_total int,
  areas_treated text[] not null,
  notes text,
  treated_at timestamptz not null default now(),
  expected_re_treatment_at timestamptz,
  created_at timestamptz default now()
);

create table photo_sessions (
  id uuid primary key default gen_random_uuid(),
  treatment_id uuid references treatments(id) on delete cascade not null,
  session_type text not null check (session_type in ('pre', 'post_14d', 'post_30d')),
  photo_front_url text,
  photo_contracted_url text,
  photo_45_url text,
  landmarks_front_json jsonb,
  landmarks_contracted_json jsonb,
  landmarks_45_json jsonb,
  alignment_quality_score float,
  capture_metadata jsonb,
  captured_at timestamptz not null default now(),
  created_at timestamptz default now()
);

create table capture_tokens (
  id uuid primary key default gen_random_uuid(),
  treatment_id uuid references treatments(id) on delete cascade not null,
  patient_id uuid references patients(id) on delete cascade not null,
  token text not null unique default encode(gen_random_bytes(32), 'hex'),
  purpose text not null check (purpose in ('post_photo', 'patient_portal')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  used_at timestamptz,
  created_at timestamptz default now()
);

create table comparisons (
  id uuid primary key default gen_random_uuid(),
  treatment_id uuid references treatments(id) on delete cascade not null,
  pre_session_id uuid references photo_sessions(id) not null,
  post_session_id uuid references photo_sessions(id) not null,
  metrics_json jsonb not null default '{}',
  ai_synthesis_patient text not null default '',
  ai_synthesis_clinic text not null default '',
  diff_overlay_url text,
  shareable_image_url text,
  generated_at timestamptz not null default now(),
  created_at timestamptz default now()
);

-- ============ WHATSAPP ENGINE (P1) ============

create table message_templates (
  id uuid primary key default gen_random_uuid(),
  template_type text not null unique check (template_type in (
    'day0_welcome',
    'day3_checkin',
    'day14_photo_request',
    'day30_progress',
    'day90_reactivation'
  )),
  trigger_offset_days int,
  prompt_instructions text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table scheduled_messages (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id) on delete cascade not null,
  patient_id uuid references patients(id) on delete cascade not null,
  treatment_id uuid references treatments(id) on delete cascade,
  template_type text not null,
  scheduled_for timestamptz not null,
  generated_message text,
  generated_at timestamptz,
  status text not null default 'scheduled' check (status in (
    'scheduled', 'generated', 'sent', 'failed', 'cancelled'
  )),
  sent_at timestamptz,
  twilio_message_sid text,
  patient_response text,
  patient_responded_at timestamptz,
  escalated_to_clinic boolean default false,
  escalated_at timestamptz,
  created_at timestamptz default now()
);

-- ============ RECOMMENDATIONS (P2) ============

create table recommendations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade not null,
  clinic_id uuid references clinics(id) on delete cascade not null,
  treatment_id uuid references treatments(id),
  recommendation_type text not null check (recommendation_type in (
    'next_treatment', 'product', 'home_care', 'lifestyle'
  )),
  title text not null,
  description text not null,
  rationale text,
  suggested_at timestamptz not null default now(),
  expires_at timestamptz default (now() + interval '60 days'),
  status text not null default 'active' check (status in (
    'active', 'accepted', 'dismissed', 'completed'
  )),
  created_at timestamptz default now()
);

-- ============ ADHERENCE TRACKING ============

create table adherence_logs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade not null,
  clinic_id uuid references clinics(id) on delete cascade not null,
  logged_at timestamptz not null default now(),
  created_at timestamptz default now()
);

-- ============ AUDIT (privacy compliance) ============

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  actor_type text check (actor_type in ('professional', 'patient_token', 'system')),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- ============ UPDATED_AT TRIGGER ============

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clinics_updated_at before update on clinics
  for each row execute function update_updated_at();
create trigger patients_updated_at before update on patients
  for each row execute function update_updated_at();
create trigger clinic_profiles_updated_at before update on clinic_profiles
  for each row execute function update_updated_at();
create trigger clinic_protocols_updated_at before update on clinic_protocols
  for each row execute function update_updated_at();

-- ============ AUTO-CREATE PROFESSIONAL ON SIGNUP ============

create or replace function handle_new_user()
returns trigger as $$
declare
  v_clinic_id uuid;
begin
  -- Only runs for clinic owners (email-based signup)
  -- The clinic + professional records are created via API after magic link
  return new;
end;
$$ language plpgsql security definer;

-- ============ DEFAULT MESSAGE TEMPLATES ============

insert into message_templates (template_type, trigger_offset_days, prompt_instructions) values
(
  'day0_welcome',
  0,
  'Enviá un mensaje de bienvenida cálido post-tratamiento. Recordá los cuidados inmediatos más importantes (no frotarse, no hacer ejercicio intenso hoy, no alcohol). Máx 4 oraciones.'
),
(
  'day3_checkin',
  3,
  'Hacé un check-in a los 3 días. Preguntá cómo se siente, si notó los primeros resultados, si tiene alguna duda. Sé empática y accesible. Máx 3 oraciones.'
),
(
  'day14_photo_request',
  14,
  'Pedile que saque fotos de los resultados a los 14 días. Explicá brevemente por qué es importante documentar el progreso. Incluí el link de captura si está disponible. Máx 3 oraciones.'
),
(
  'day30_progress',
  30,
  'Celebrá los resultados al mes. Preguntá cómo se siente con los resultados y si está pensando en el próximo tratamiento. Sé entusiasta pero no presiones. Máx 3 oraciones.'
),
(
  'day90_reactivation',
  90,
  'Recordá a la paciente que se aproxima el momento ideal para su próximo tratamiento. Invitala a agendar turno. Sé sutil y no presiones. Máx 2 oraciones.'
);
