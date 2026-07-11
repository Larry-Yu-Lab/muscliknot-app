-- Add onboarding fields to user_preferences
alter table public.user_preferences 
  add column if not exists has_coach text,
  add column if not exists source text,
  add column if not exists gender text,
  add column if not exists height text,
  add column if not exists weight text,
  add column if not exists measurement_system text,
  add column if not exists dob text,
  add column if not exists experience_level text,
  add column if not exists equipment jsonb;
