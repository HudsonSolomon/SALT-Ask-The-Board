-- Ask the Board — database schema
-- Run this once in your Supabase project's SQL Editor (Project -> SQL Editor -> New query)

create extension if not exists pgcrypto;

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,          -- claim code shown to the student, e.g. "7K2Q-9PLM"
  question text not null,
  reply text,
  status text not null default 'pending' check (status in ('pending', 'replied', 'archived')),
  created_at timestamptz not null default now(),
  replied_at timestamptz
);

create index if not exists questions_status_idx on questions (status);
create index if not exists questions_code_idx on questions (code);

-- Row Level Security is enabled with NO policies attached.
-- That means the anon and authenticated keys can do nothing to this table directly —
-- every read/write must go through the Next.js server routes, which use the
-- service role key (kept server-side only, never sent to the browser).
-- This is what keeps questions private: there is no client-side path to list them.
alter table questions enable row level security;
