-- Google OAuth credentials storage
create table oauth_credentials (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid references professionals(id) on delete cascade not null,
  provider text not null check (provider = 'google'),
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  scopes text[] not null default '{}',
  google_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(professional_id, provider)
);

alter table oauth_credentials enable row level security;

create policy "own_credentials"
  on oauth_credentials for all
  using (professional_id in (select id from professionals where user_id = auth.uid()));

-- Track Google Calendar event IDs on treatments
alter table treatments
  add column if not exists google_calendar_event_id text,
  add column if not exists google_calendar_retreatment_event_id text;
