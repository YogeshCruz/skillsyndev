-- Add file_hash and score_explanation columns to resumes table
ALTER TABLE public.resumes 
ADD COLUMN IF NOT EXISTS file_hash text,
ADD COLUMN IF NOT EXISTS score_explanation text;

-- Create index on file_hash for faster cache lookups
CREATE INDEX IF NOT EXISTS idx_resumes_file_hash ON public.resumes(file_hash);