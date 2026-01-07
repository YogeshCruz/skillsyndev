-- Add is_saved column to user_job_matches table
ALTER TABLE public.user_job_matches ADD COLUMN IF NOT EXISTS is_saved BOOLEAN DEFAULT false;
ALTER TABLE public.user_job_matches ADD COLUMN IF NOT EXISTS matching_skills TEXT[] DEFAULT '{}';
ALTER TABLE public.user_job_matches ADD COLUMN IF NOT EXISTS missing_skills TEXT[] DEFAULT '{}';