-- Run this once in your Supabase SQL editor.

-- ============================================================
-- Tables
-- ============================================================
create extension if not exists "pgcrypto";

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null,
  tags text[] not null default '{}',
  color text not null default 'from-violet-500/30 to-fuchsia-500/30',
  image_url text,
  href text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists projects_sort_idx on public.projects (sort_order asc, created_at asc);
create index if not exists messages_created_idx on public.messages (created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.admins   enable row level security;
alter table public.projects enable row level security;
alter table public.messages enable row level security;

-- admins: nobody. Service role bypasses RLS automatically.

-- This app reads and writes through server routes with the service role.
-- The policies below keep direct browser access unnecessary.

-- projects: direct browser reads are not required.
drop policy if exists "projects read all" on public.projects;

-- messages: inserts also go through the server route.
drop policy if exists "messages insert public" on public.messages;

-- ============================================================
-- Storage bucket for project images (public read)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;
