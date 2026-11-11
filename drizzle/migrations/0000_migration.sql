create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, role_title text default 'Administrateur',
  co2_max int not null default 1000, temp_max numeric not null default 27,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.devices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  name text not null, room text not null,
  api_key text not null default encode(gen_random_bytes(16),'hex'),
  firmware text default 'v1.0.0', battery int, wifi int,
  co2 int, temp numeric, humidity numeric, noise numeric, light numeric,
  recording boolean not null default false,
  last_seen timestamptz,
  created_at timestamptz not null default now()
);
create table public.sensor_readings (
  id bigint generated always as identity primary key,
  device_id uuid not null references public.devices(id) on delete cascade,
  owner_id uuid not null,
  co2 int, temp numeric, humidity numeric, noise numeric, light numeric,
  created_at timestamptz not null default now()
);
create index on public.sensor_readings (device_id, created_at desc);
create table public.device_commands (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices(id) on delete cascade,
  owner_id uuid not null, command text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(), acked_at timestamptz
);
create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  device_id uuid references public.devices(id) on delete set null,
  title text not null, room text,
  scheduled_at timestamptz,
  started_at timestamptz, ended_at timestamptz,
  status text not null default 'scheduled',
  participants text[] not null default '{}',
  summary text, score int,
  created_at timestamptz not null default now()
);
create table public.transcript_lines (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  owner_id uuid not null,
  speaker text not null, content text not null, offset_seconds int not null default 0,
  created_at timestamptz not null default now()
);
create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  owner_id uuid not null, content text not null, made_by text,
  created_at timestamptz not null default now()
);
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  meeting_id uuid references public.meetings(id) on delete set null,
  title text not null, assignee text, due_date date,
  priority text not null default 'Moyenne',
  status text not null default 'todo',
  created_at timestamptz not null default now()
);

do $$ declare t text; begin
  foreach t in array array['devices','sensor_readings','device_commands','meetings','transcript_lines','decisions','tasks'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "owner all" on public.%I for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id)', t);
  end loop;
end $$;

alter publication supabase_realtime add table public.devices;
alter publication supabase_realtime add table public.transcript_lines;
alter publication supabase_realtime add table public.sensor_readings;