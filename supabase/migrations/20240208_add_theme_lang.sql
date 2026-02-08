-- Add theme and language columns to user_preferences
alter table public.user_preferences 
add column if not exists theme text check (theme in ('light', 'dark')),
add column if not exists language text check (language in ('en', 'zh', 'fr', 'es'));
