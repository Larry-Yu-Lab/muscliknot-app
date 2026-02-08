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
  date bigint not null, -- Storing timestamp as bigint to match current local storage format (Date.now())
  muscle_group text not null,
  exercises jsonb not null, -- Storing the array of exercises
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
