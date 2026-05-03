-- ============ ENABLE RLS ============

alter table clinics enable row level security;
alter table professionals enable row level security;
alter table patients enable row level security;
alter table clinic_profiles enable row level security;
alter table clinic_protocols enable row level security;
alter table clinic_documents enable row level security;
alter table treatments enable row level security;
alter table photo_sessions enable row level security;
alter table capture_tokens enable row level security;
alter table comparisons enable row level security;
alter table scheduled_messages enable row level security;
alter table recommendations enable row level security;
alter table adherence_logs enable row level security;
alter table audit_logs enable row level security;
alter table message_templates enable row level security;

-- ============ HELPER FUNCTION ============

create or replace function get_clinic_id_for_user(p_user_id uuid)
returns uuid as $$
  select clinic_id from professionals where user_id = p_user_id limit 1;
$$ language sql security definer stable;

-- ============ CLINICS ============

create policy "professionals_select_own_clinic"
  on clinics for select
  using (id = get_clinic_id_for_user(auth.uid()));

create policy "professionals_update_own_clinic"
  on clinics for update
  using (id = get_clinic_id_for_user(auth.uid()));

create policy "allow_insert_clinic"
  on clinics for insert
  with check (true);

-- ============ PROFESSIONALS ============

create policy "professionals_select_own"
  on professionals for select
  using (clinic_id = get_clinic_id_for_user(auth.uid()) or user_id = auth.uid());

create policy "allow_insert_professional"
  on professionals for insert
  with check (true);

-- ============ PATIENTS ============

create policy "professionals_crud_patients"
  on patients for all
  using (clinic_id = get_clinic_id_for_user(auth.uid()));

-- ============ CLINIC PROFILES ============

create policy "professionals_crud_clinic_profile"
  on clinic_profiles for all
  using (clinic_id = get_clinic_id_for_user(auth.uid()));

-- ============ CLINIC PROTOCOLS ============

create policy "professionals_crud_clinic_protocols"
  on clinic_protocols for all
  using (clinic_id = get_clinic_id_for_user(auth.uid()));

-- ============ CLINIC DOCUMENTS ============

create policy "professionals_crud_clinic_documents"
  on clinic_documents for all
  using (clinic_id = get_clinic_id_for_user(auth.uid()));

-- ============ TREATMENTS ============

create policy "professionals_crud_treatments"
  on treatments for all
  using (clinic_id = get_clinic_id_for_user(auth.uid()));

-- ============ PHOTO SESSIONS ============

create policy "professionals_crud_photo_sessions"
  on photo_sessions for all
  using (
    treatment_id in (
      select id from treatments where clinic_id = get_clinic_id_for_user(auth.uid())
    )
  );

-- ============ CAPTURE TOKENS ============

create policy "professionals_crud_capture_tokens"
  on capture_tokens for all
  using (
    patient_id in (
      select id from patients where clinic_id = get_clinic_id_for_user(auth.uid())
    )
  );

-- Allow anonymous token lookup (for patient portal)
create policy "anyone_select_valid_token"
  on capture_tokens for select
  using (expires_at > now());

-- ============ COMPARISONS ============

create policy "professionals_crud_comparisons"
  on comparisons for all
  using (
    treatment_id in (
      select id from treatments where clinic_id = get_clinic_id_for_user(auth.uid())
    )
  );

-- ============ SCHEDULED MESSAGES ============

create policy "professionals_crud_scheduled_messages"
  on scheduled_messages for all
  using (clinic_id = get_clinic_id_for_user(auth.uid()));

-- ============ RECOMMENDATIONS ============

create policy "professionals_crud_recommendations"
  on recommendations for all
  using (clinic_id = get_clinic_id_for_user(auth.uid()));

-- ============ ADHERENCE LOGS ============

create policy "professionals_select_adherence"
  on adherence_logs for select
  using (clinic_id = get_clinic_id_for_user(auth.uid()));

create policy "anyone_insert_adherence"
  on adherence_logs for insert
  with check (true);

-- ============ AUDIT LOGS ============

create policy "professionals_select_audit"
  on audit_logs for select
  using (
    entity_id in (
      select id from patients where clinic_id = get_clinic_id_for_user(auth.uid())
    )
    or actor_id = auth.uid()
  );

create policy "allow_insert_audit"
  on audit_logs for insert
  with check (true);

-- ============ MESSAGE TEMPLATES (public read) ============

create policy "anyone_select_templates"
  on message_templates for select
  using (true);

create policy "service_role_manage_templates"
  on message_templates for all
  using (auth.role() = 'service_role');
