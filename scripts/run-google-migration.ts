import { createAdminClient } from '../lib/supabase/admin'

async function main() {
  const admin = createAdminClient()
  const db = admin as any

  console.log('Running Google OAuth migration...')

  // Step 1: Create oauth_credentials table
  const { error: e1 } = await db.rpc('exec_sql', {
    sql: `
      create table if not exists oauth_credentials (
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
    `
  })
  if (e1) {
    console.log('Note: exec_sql rpc not available, trying direct fetch...')
    await runSqlViaFetch()
    return
  }

  // Step 2: Enable RLS
  await db.rpc('exec_sql', { sql: `alter table oauth_credentials enable row level security;` })

  // Step 3: Create policy
  await db.rpc('exec_sql', {
    sql: `
      create policy if not exists "own_credentials"
        on oauth_credentials for all
        using (professional_id in (select id from professionals where user_id = auth.uid()));
    `
  })

  // Step 4: Add calendar columns to treatments
  await db.rpc('exec_sql', {
    sql: `
      alter table treatments
        add column if not exists google_calendar_event_id text,
        add column if not exists google_calendar_retreatment_event_id text;
    `
  })

  console.log('✓ Migration complete!')
}

async function runSqlViaFetch() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const sqls = [
    `create table if not exists oauth_credentials (
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
    )`,
    `alter table oauth_credentials enable row level security`,
    `do $$ begin
      if not exists (select 1 from pg_policies where tablename='oauth_credentials' and policyname='own_credentials') then
        execute 'create policy "own_credentials" on oauth_credentials for all using (professional_id in (select id from professionals where user_id = auth.uid()))';
      end if;
    end $$`,
    `alter table treatments add column if not exists google_calendar_event_id text`,
    `alter table treatments add column if not exists google_calendar_retreatment_event_id text`,
  ]

  for (const sql of sqls) {
    const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({ sql }),
    })
    const text = await res.text()
    console.log(`SQL: ${sql.slice(0, 50).trim()}... → ${res.status} ${text.slice(0, 100)}`)
  }
}

main().catch(console.error)
