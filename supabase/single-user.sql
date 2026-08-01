-- =====================================================================
--  Prep OS — SINGLE USER MODE
--
--  Removes the login requirement. Run this AFTER schema.sql, once,
--  in Supabase -> SQL Editor -> New query.
--
--  What it does:
--    1. Drops the foreign keys to auth.users (there is no logged-in user now)
--    2. Points every row at one fixed owner id
--    3. Replaces the "only the owner can read this" RLS policies with open ones
--    4. Removes the signup trigger
--    5. Creates your settings row
--
--  ⚠️  SECURITY: after this, anyone who knows your deployed URL can read and
--  edit your data. The anon key ships in the browser bundle, so it is not a
--  secret. Keep the URL to yourself. To reverse this, re-run schema.sql and
--  follow the "Re-enabling login" section of SETUP.md.
-- =====================================================================

-- 1. Drop foreign keys to auth.users -----------------------------------
alter table public.progress     drop constraint if exists progress_user_id_fkey;
alter table public.notes        drop constraint if exists notes_user_id_fkey;
alter table public.sessions     drop constraint if exists sessions_user_id_fkey;
alter table public.applications drop constraint if exists applications_user_id_fkey;
alter table public.settings     drop constraint if exists settings_user_id_fkey;

-- 2. One fixed owner ---------------------------------------------------
do $$
declare
  t text;
  owner uuid := '00000000-0000-0000-0000-000000000001';
begin
  foreach t in array array['progress','notes','sessions','applications','settings'] loop
    execute format('alter table public.%I alter column user_id set default %L', t, owner);
    execute format('update public.%I set user_id = %L where user_id is distinct from %L',
                   t, owner, owner);
  end loop;
end $$;

-- 3. Open the RLS policies --------------------------------------------
--    RLS stays ENABLED, but the policies no longer check who you are.
--    Keeping RLS on (rather than disabling it) makes this a one-line
--    change to reverse later.
do $$
declare t text;
begin
  foreach t in array array['progress','notes','sessions','applications','settings'] loop
    execute format('drop policy if exists "own_select" on public.%I', t);
    execute format('drop policy if exists "own_insert" on public.%I', t);
    execute format('drop policy if exists "own_update" on public.%I', t);
    execute format('drop policy if exists "own_delete" on public.%I', t);
    execute format('drop policy if exists "single_user_all" on public.%I', t);

    execute format(
      'create policy "single_user_all" on public.%I for all using (true) with check (true)',
      t);
  end loop;
end $$;

-- 4. Remove the signup trigger ----------------------------------------
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 5. Create the settings row ------------------------------------------
insert into public.settings (user_id, start_date)
values ('00000000-0000-0000-0000-000000000001', current_date)
on conflict (user_id) do nothing;
