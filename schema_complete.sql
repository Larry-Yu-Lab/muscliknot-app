-- Enable the UUID extension
create extension if not exists "uuid-ossp";

-- *** PART 1: Recovery Knowledge Base ***

drop table if exists recovery_knowledge_base;

create table recovery_knowledge_base (
  id uuid primary key default uuid_generate_v4(),
  muscle_id text[] not null,
  target_area_size text not null check (target_area_size in ('small', 'medium', 'large')),
  exercise_type text not null default 'relief',
  title text not null,
  description text,
  duration text,
  video_url text,
  image_url text,
  difficulty_level text default 'beginner',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table recovery_knowledge_base enable row level security;

create policy "Recovery knowledge is viewable by everyone."
  on recovery_knowledge_base for select
  using ( true );

insert into recovery_knowledge_base 
(muscle_id, target_area_size, exercise_type, title, description, duration, video_url, image_url)
values
(ARRAY['neck', 'traps'], 'small', 'relief', 'Neck Release & Stretch', 'Gentle neck stretches to relieve tension from looking down at screens.', '5 min', 'https://www.youtube.com/watch?v=s-7lyvlbodw', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800'),
(ARRAY['lower_back', 'glutes'], 'medium', 'relief', 'Lower Back Decompression', 'Relieve pressure in the lower back with these gentle movements.', '10 min', 'https://www.youtube.com/watch?v=XeXz8fIZDCE', 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800'),
(ARRAY['legs', 'quads'], 'large', 'relief', 'Full Leg Flush', 'Improve circulation and reduce soreness in the legs.', '12 min', 'https://www.youtube.com/watch?v=K-PpCgP_P2Y', 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800');

-- *** PART 2: User Profiles ***

create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone."
  on profiles for select using ( true );

create policy "Users can insert their own profile."
  on profiles for insert with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update using ( auth.uid() = id );

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- *** PART 3: User Preferences ***

create table if not exists public.user_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lifestyle text check (lifestyle in ('sedentary', 'active', 'athlete')),
  primary_goal text check (primary_goal in ('relieve_pain', 'improve_mobility', 'daily_maintenance')),
  onboarding_completed boolean default false,
  theme text default 'dark',
  language text default 'en',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

alter table public.user_preferences enable row level security;

create policy "Users can view their own preferences"
  on public.user_preferences for select using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on public.user_preferences for insert with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.user_preferences for update using (auth.uid() = user_id);

-- *** PART 4: User History ***

create table if not exists public.user_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date bigint not null,
  muscle_group text not null,
  exercises jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_history enable row level security;

create policy "Users can view their own history"
  on public.user_history for select using (auth.uid() = user_id);

create policy "Users can insert their own history"
  on public.user_history for insert with check (auth.uid() = user_id);

create policy "Users can delete their own history"
  on public.user_history for delete using (auth.uid() = user_id);

-- *** PART 5: User Stats (NEW - required by UserContext) ***

create table if not exists public.user_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  workouts integer default 0,
  recovery_score integer default 92,
  streak_days integer default 1,
  fitness_level text default 'BEGINNER',
  level integer default 1,
  level_progress integer default 0,
  injury_recovery integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

alter table public.user_stats enable row level security;

create policy "Users can view their own stats"
  on public.user_stats for select using (auth.uid() = user_id);

create policy "Users can insert their own stats"
  on public.user_stats for insert with check (auth.uid() = user_id);

create policy "Users can update their own stats"
  on public.user_stats for update using (auth.uid() = user_id);

-- Auto-create stats row when a new user signs up
create or replace function public.handle_new_user_stats()
returns trigger as $$
begin
  insert into public.user_stats (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created_stats
  after insert on auth.users
  for each row execute procedure public.handle_new_user_stats();

-- Create stats for any existing users who don't have them
insert into public.user_stats (user_id)
select id from auth.users
where id not in (select user_id from public.user_stats)
on conflict do nothing;
