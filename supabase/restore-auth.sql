-- =====================================================================
--  Prep OS — restore real per-user accounts
--
--  Run this in Supabase -> SQL Editor -> New query if you previously ran
--  single-user.sql and now want proper accounts back.
--
--  ⚠️  Step 1 DELETES the placeholder-owned rows, because those rows belong
--  to a fake user id that doesn't exist in auth.users, and the foreign key
--  can't be restored while they're there. If you have data you care about,
--  export it first: Table Editor -> the table -> Export -> CSV.
-- =====================================================================

-- 1. Clear rows owned by the single-user placeholder --------------------
delete from public.progress     where user_id = '00000000-0000-0000-0000-000000000001';
delete from public.notes        where user_id = '00000000-0000-0000-0000-000000000001';
delete from public.sessions     where user_id = '00000000-0000-0000-0000-000000000001';
delete from public.applications where user_id = '00000000-0000-0000-0000-000000000001';
delete from public.settings     where user_id = '00000000-0000-0000-0000-000000000001';

-- 2. Drop the fixed-owner defaults --------------------------------------
do $$
declare t text;
begin
  foreach t in array array['progress','notes','sessions','applications','settings'] loop
    execute format('alter table public.%I alter column user_id drop default', t);
  end loop;
end $$;

-- 3. Re-attach the foreign keys to auth.users ---------------------------
alter table public.progress     add constraint progress_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.notes        add constraint notes_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.sessions     add constraint sessions_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.applications add constraint applications_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.settings     add constraint settings_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- 4. Restore owner-only RLS policies ------------------------------------
do $$
declare t text;
begin
  foreach t in array array['progress','notes','sessions','applications','settings'] loop
    execute format('drop policy if exists "single_user_all" on public.%I', t);
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

-- 5. Recreate the signup trigger ----------------------------------------
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
