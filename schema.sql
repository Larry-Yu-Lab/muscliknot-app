-- Enable the UUID extension
create extension if not exists "uuid-ossp";

-- *** PART 1: Recovery Knowledge Base ***

-- Drop the table if it already exists to ensure we create it with the correct columns
drop table if exists recovery_knowledge_base;

-- Create the recovery_knowledge_base table
create table recovery_knowledge_base (
  id uuid primary key default uuid_generate_v4(),
  muscle_id text[] not null, -- Array of muscle IDs (e.g. ['neck', 'traps'])
  target_area_size text not null check (target_area_size in ('small', 'medium', 'large')),
  exercise_type text not null default 'relief', -- 'relief', 'warmup', 'strength'
  title text not null,
  description text,
  duration text, -- e.g. "5 min"
  video_url text, -- URL to video
  image_url text, -- URL to thumbnail
  difficulty_level text default 'beginner',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table recovery_knowledge_base enable row level security;

-- Create a policy that allows everyone to read data
create policy "Public profiles are viewable by everyone."
  on recovery_knowledge_base for select
  using ( true );

-- Insert Sample Data
insert into recovery_knowledge_base 
(muscle_id, target_area_size, exercise_type, title, description, duration, video_url, image_url)
values
(
  ARRAY['neck', 'traps'], 
  'small', 
  'relief', 
  'Neck Release & Stretch', 
  'Gentle neck stretches to relieve tension from looking down at screens.', 
  '5 min', 
  'https://www.youtube.com/watch?v=example', 
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800'
),
(
  ARRAY['lower_back', 'glutes'], 
  'medium', 
  'relief', 
  'Lower Back Decompression', 
  'Relieve pressure in the lower back with these gentle movements.', 
  '10 min', 
  'https://www.youtube.com/watch?v=example2', 
  'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800'
),
(
  ARRAY['legs', 'quads'], 
  'large', 
  'relief', 
  'Full Leg Flush', 
  'Improve circulation and reduce soreness in the legs.', 
  '12 min', 
  'https://www.youtube.com/watch?v=example3', 
  'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800'
);

-- *** PART 2: User Profiles Sync ***

-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- *** PART 3: User Data Sync (Preferences & History) ***

-- Create user_preferences table
create table if not exists public.user_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lifestyle text check (lifestyle in ('sedentary', 'active', 'athlete')),
  primary_goal text check (primary_goal in ('relieve_pain', 'improve_mobility', 'daily_maintenance')),
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Enable RLS for user_preferences
alter table public.user_preferences enable row level security;

create policy "Users can view their own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

-- Create user_history table
create table if not exists public.user_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date bigint not null,
  muscle_group text not null,
  exercises jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for user_history
alter table public.user_history enable row level security;

create policy "Users can view their own history"
  on public.user_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own history"
  on public.user_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own history"
  on public.user_history for delete
  using (auth.uid() = user_id);
