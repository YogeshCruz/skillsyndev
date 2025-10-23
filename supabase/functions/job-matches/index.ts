import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, jobId, matchPercentage, matchingSkills, missingSkills } = await req.json();

    // Validate input
    if (!action || !jobId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === 'save') {
      // Validate required fields for save action
      if (matchPercentage === undefined || !matchingSkills || !missingSkills) {
        return new Response(
          JSON.stringify({ error: "Missing match data for save operation" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Save job match - using user.id from JWT, not trusting client
      const { error } = await supabase
        .from('user_job_matches')
        .upsert({
          user_id: user.id, // Always use authenticated user's ID
          job_role_id: jobId,
          match_percentage: matchPercentage,
          matching_skills: matchingSkills,
          missing_skills: missingSkills,
          is_saved: true,
        });

      if (error) {
        console.error('Error saving job match:', error);
        throw new Error('Failed to save job match');
      }

      return new Response(
        JSON.stringify({ success: true, action: 'saved' }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (action === 'unsave') {
      // Unsave job match - using user.id from JWT
      const { error } = await supabase
        .from('user_job_matches')
        .update({ is_saved: false })
        .eq('user_id', user.id) // Always use authenticated user's ID
        .eq('job_role_id', jobId);

      if (error) {
        console.error('Error unsaving job match:', error);
        throw new Error('Failed to unsave job match');
      }

      return new Response(
        JSON.stringify({ success: true, action: 'unsaved' }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action. Must be 'save' or 'unsave'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("Job match operation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process job match operation" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
