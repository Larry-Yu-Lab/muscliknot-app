-- Create user_saved_exercises table
create table if not exists public.user_saved_exercises (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  exercise_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, exercise_id) -- Prevent duplicates
);

-- Enable RLS
alter table public.user_saved_exercises enable row level security;

-- Create policies
create policy "Users can view their own saved exercises"
  on public.user_saved_exercises for select
  using (auth.uid() = user_id);

create policy "Users can save exercises"
  on public.user_saved_exercises for insert
  with check (auth.uid() = user_id);

create policy "Users can unsave exercises"
  on public.user_saved_exercises for delete
  using (auth.uid() = user_id);
