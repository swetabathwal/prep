-- =====================================================================
--  Prep OS — database schema
--  Run this whole file once in Supabase -> SQL Editor -> New query.
--  Safe to re-run: everything is idempotent.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. progress
--    Generic key/value store for every checkbox and rating in the app.
--    kind    : 'item'    -> roadmap checklist item      (value 1 = done)
--              'project' -> project milestone           (value 1 = done)
--              'matrix'  -> skill self-rating           (value 0..3)
--              'fsd'     -> system design problem       (value 0..2)
--              'problem' -> DSA problem status          (value 0..3)
--    key     : the stable id from lib/curriculum.ts (e.g. 'm2_7', 'two-sum')
-- ---------------------------------------------------------------------
create table if not exists public.progress (
  user_id     uuid not null references auth.users(id) on delete cascade,
  kind        text not null,
  key         text not null,
  value       int  not null default 1,
  attempts    int  not null default 0,
  updated_at  timestamptz not null default now(),
  primary key (user_id, kind, key)
);

create index if not exists progress_user_kind_idx on public.progress (user_id, kind);

-- ---------------------------------------------------------------------
-- 2. notes
--    Attachable to anything, or free-floating as a journal entry.
--    scope: 'problem' | 'item' | 'fsd' | 'project' | 'topic' | 'journal'
--    ref  : the key of the thing it's attached to (null for journal)
-- ---------------------------------------------------------------------
create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  scope       text not null default 'journal',
  ref         text,
  title       text,
  body        text not null default '',
  tags        text[] not null default '{}',
  pinned      boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists notes_user_scope_ref_idx on public.notes (user_id, scope, ref);
create index if not exists notes_user_updated_idx  on public.notes (user_id, updated_at desc);

-- full-text search over notes
create index if not exists notes_search_idx on public.notes
  using gin (to_tsvector('english', coalesce(title,'') || ' ' || body));

-- ---------------------------------------------------------------------
-- 3. sessions — daily study hours
-- ---------------------------------------------------------------------
create table if not exists public.sessions (
  user_id  uuid not null references auth.users(id) on delete cascade,
  day      date not null,
  hours    numeric(4,1) not null default 0,
  focus    text,
  primary key (user_id, day)
);

-- ---------------------------------------------------------------------
-- 4. applications — job pipeline
-- ---------------------------------------------------------------------
create table if not exists public.applications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  company     text not null,
  role        text,
  ctc_ask     text,
  stage       text not null default 'Researching',
  source      text,
  link        text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists applications_user_idx on public.applications (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- 5. settings — one row per user
-- ---------------------------------------------------------------------
create table if not exists public.settings (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  start_date  date not null default current_date,
  target_ctc  int  not null default 32,
  current_ctc int  not null default 12
);

-- ---------------------------------------------------------------------
-- Row Level Security — every table is private to its owner.
-- ---------------------------------------------------------------------
alter table public.progress     enable row level security;
alter table public.notes        enable row level security;
alter table public.sessions     enable row level security;
alter table public.applications enable row level security;
alter table public.settings     enable row level security;

do $$
declare t text;
begin
  foreach t in array array['progress','notes','sessions','applications','settings'] loop
    execute format('drop policy if exists "own_select" on public.%I', t);
    execute format('drop policy if exists "own_insert" on public.%I', t);
    execute format('drop policy if exists "own_update" on public.%I', t);
    execute format('drop policy if exists "own_delete" on public.%I', t);

    execute format(
      'create policy "own_select" on public.%I for select using (auth.uid() = user_id)', t);
    execute format(
      'create policy "own_insert" on public.%I for insert with check (auth.uid() = user_id)', t);
    execute format(
      'create policy "own_update" on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format(
      'create policy "own_delete" on public.%I for delete using (auth.uid() = user_id)', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Keep updated_at fresh
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists notes_touch on public.notes;
create trigger notes_touch before update on public.notes
  for each row execute function public.touch_updated_at();

drop trigger if exists apps_touch on public.applications;
create trigger apps_touch before update on public.applications
  for each row execute function public.touch_updated_at();

drop trigger if exists progress_touch on public.progress;
create trigger progress_touch before update on public.progress
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Create a settings row automatically on signup
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.settings (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
