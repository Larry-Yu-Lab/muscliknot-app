-- Create user_stats table
create table if not exists public.user_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  workouts int default 0,
  recovery_score int default 0,
  streak_days int default 0,
  fitness_level text default 'Intermediate',
  level int default 1,
  level_progress int default 0,
  injury_recovery int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Enable RLS
alter table public.user_stats enable row level security;

create policy "Users can view their own stats"
  on public.user_stats for select
  using (auth.uid() = user_id);

create policy "Users can update their own stats"
  on public.user_stats for update
  using (auth.uid() = user_id);

create policy "Users can insert their own stats"
  on public.user_stats for insert
  with check (auth.uid() = user_id);

-- Update handle_new_user function to also initialize stats
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert into profiles
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  -- Insert into user_preferences (default values)
  insert into public.user_preferences (user_id)
  values (new.id);

  -- Insert into user_stats (default values)
  insert into public.user_stats (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;
