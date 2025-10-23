-- Fix 1: Add DELETE policy for user_job_matches table
CREATE POLICY "Users can delete their own job matches" 
ON user_job_matches 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fix 2: Add search_path protection to update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;