-- *** Recovery Squads ***

-- 1. Squads table
create table if not exists public.recovery_squads (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  invite_code text not null unique,
  created_by uuid references auth.users on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.recovery_squads enable row level security;

-- Anyone can read squads (needed for join-by-code lookup)
create policy "Squads are viewable by everyone"
  on public.recovery_squads for select using (true);

-- Authenticated users can create squads
create policy "Authenticated users can create squads"
  on public.recovery_squads for insert with check (auth.uid() = created_by);

-- Only the creator can delete their squad
create policy "Creators can delete their own squads"
  on public.recovery_squads for delete using (auth.uid() = created_by);

-- Only the creator can update their squad
create policy "Creators can update their own squads"
  on public.recovery_squads for update using (auth.uid() = created_by);


-- 2. Squad Members table (join table)
create table if not exists public.squad_members (
  id uuid default uuid_generate_v4() primary key,
  squad_id uuid references public.recovery_squads on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(squad_id, user_id)
);

alter table public.squad_members enable row level security;

-- Members can see other members of squads they belong to
create policy "Members can view squad members"
  on public.squad_members for select using (
    squad_id in (
      select sm.squad_id from public.squad_members sm where sm.user_id = auth.uid()
    )
  );

-- Authenticated users can join squads (insert themselves)
create policy "Users can join squads"
  on public.squad_members for insert with check (auth.uid() = user_id);

-- Users can leave squads (delete themselves)
create policy "Users can leave squads"
  on public.squad_members for delete using (auth.uid() = user_id);


-- 3. Squad Challenges table
create table if not exists public.squad_challenges (
  id uuid default uuid_generate_v4() primary key,
  squad_id uuid references public.recovery_squads on delete cascade not null,
  title text not null,
  description text,
  target_sessions integer not null default 5,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.squad_challenges enable row level security;

-- Members can see challenges for their squads
create policy "Members can view squad challenges"
  on public.squad_challenges for select using (
    squad_id in (
      select sm.squad_id from public.squad_members sm where sm.user_id = auth.uid()
    )
  );

-- Squad creators can manage challenges
create policy "Squad creators can manage challenges"
  on public.squad_challenges for insert with check (
    squad_id in (
      select rs.id from public.recovery_squads rs where rs.created_by = auth.uid()
    )
  );

create policy "Squad creators can update challenges"
  on public.squad_challenges for update using (
    squad_id in (
      select rs.id from public.recovery_squads rs where rs.created_by = auth.uid()
    )
  );

create policy "Squad creators can delete challenges"
  on public.squad_challenges for delete using (
    squad_id in (
      select rs.id from public.recovery_squads rs where rs.created_by = auth.uid()
    )
  );


-- 4. Allow squad members to read each other's profiles and stats (for leaderboard)
-- These policies may already exist; using IF NOT EXISTS pattern via DO block

DO $$ BEGIN
  -- Allow squad members to read other members' profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Squad members can view member profiles' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Squad members can view member profiles"
      ON public.profiles FOR SELECT USING (true);
  END IF;
END $$;

-- Allow squad members to read other members' stats for leaderboard
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Squad members can view member stats' AND tablename = 'user_stats'
  ) THEN
    CREATE POLICY "Squad members can view member stats"
      ON public.user_stats FOR SELECT USING (
        id IN (
          SELECT us.id FROM public.user_stats us
          INNER JOIN public.squad_members sm ON sm.user_id = us.user_id
          WHERE sm.squad_id IN (
            SELECT sm2.squad_id FROM public.squad_members sm2 WHERE sm2.user_id = auth.uid()
          )
        )
        OR user_id = auth.uid()
      );
  END IF;
END $$;
