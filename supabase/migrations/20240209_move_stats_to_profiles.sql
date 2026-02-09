-- Add stats columns to profiles table
alter table public.profiles
add column if not exists workouts int default 0,
add column if not exists recovery_score int default 92,
add column if not exists streak_days int default 1,
add column if not exists fitness_level text default 'Intermediate',
add column if not exists score_level int default 1, -- renamed from 'level' to avoid reserved keyword conflicts if any, though 'level' is usually fine in PG, let's stick to 'level' or 'user_level' for clarity. Let's use 'user_level'.
add column if not exists user_level int default 1,
add column if not exists level_progress int default 0,
add column if not exists injury_recovery int default 0;

-- Drop user_stats table if it exists (since we are moving to profiles)
drop table if exists public.user_stats;

-- Update handle_new_user function to no longer insert into user_stats
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert into profiles with default stats
  insert into public.profiles (id, full_name, avatar_url, workouts, recovery_score, streak_days, user_level, level_progress, injury_recovery)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    0, 92, 1, 1, 0, 0
  );

  -- Insert into user_preferences (default values)
  insert into public.user_preferences (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;
