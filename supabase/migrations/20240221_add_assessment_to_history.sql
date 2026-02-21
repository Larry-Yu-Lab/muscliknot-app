-- ============================================================
-- Migration: Add assessment column to user_history
--            & create dedicated pain_sessions table
-- ============================================================

-- 1. Add the missing `assessment` JSONB column to user_history
--    (the app code already tries to write it, but the column was absent)
ALTER TABLE public.user_history
  ADD COLUMN IF NOT EXISTS assessment jsonb;

-- ============================================================
-- 2. Dedicated pain_sessions table for rich session tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pain_sessions (
  id                      uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id                 uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at              timestamptz DEFAULT now() NOT NULL,

  -- What type of activity was this?
  activity_type           text NOT NULL
    CHECK (activity_type IN ('relief', 'warmup', 'yoga', 'strength', 'posture')),

  -- Which muscle / body area?
  muscle_group            text,

  -- Relief-specific
  pain_level              integer CHECK (pain_level BETWEEN 1 AND 10),
  pain_duration           text,   -- 'today' | 'this_week' | 'this_month' | 'longer'
  pain_location           text,   -- specific sub-location from PAIN_LOCATION_MAP
  cause_note              text,

  -- Generic Q&A (warmup goal, yoga mobility, strength exp, posture duration)
  q1                      text,
  q2                      text,

  -- What the engine decided to recommend
  recommendation_category text    -- 'gentle' | 'moderate' | 'full'
    CHECK (recommendation_category IN ('gentle', 'moderate', 'full')),
  recommendation_advisory text,   -- the warning text shown to the user

  -- Snapshot of exercises that were recommended
  exercises_shown         jsonb
);

-- Row Level Security
ALTER TABLE public.pain_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pain sessions"
  ON public.pain_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pain sessions"
  ON public.pain_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pain sessions"
  ON public.pain_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast history retrieval
CREATE INDEX IF NOT EXISTS pain_sessions_user_created_idx
  ON public.pain_sessions (user_id, created_at DESC);
