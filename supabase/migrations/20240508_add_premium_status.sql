-- Add is_premium column to user_stats table
-- This is required for the Stripe webhook to function correctly
ALTER TABLE public.user_stats 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- If user_stats was merged into profiles by a previous migration that the user might have run
-- we also ensure profiles has it just in case.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
