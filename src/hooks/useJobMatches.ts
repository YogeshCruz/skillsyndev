import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface JobMatch {
  id: string;
  title: string;
  description: string | null;
  required_skills: string[];
  experience_level?: string;
  salary_range: string | null;
  industry?: string;
  growth_rate?: string | null;
  match_percentage?: number;
  missing_skills?: string[];
  matching_skills?: string[];
  is_saved?: boolean;
}

interface JobRole {
  id: string;
  title: string;
  description: string | null;
  required_skills: string[] | null;
  salary_range: string | null;
  growth_rate: string | null;
  created_at: string;
}

interface Resume {
  skills: string[] | null;
}

interface UserJobMatch {
  is_saved: boolean | null;
}

export const useJobMatches = () => {
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const calculateMatchPercentage = (userSkills: string[], requiredSkills: string[]) => {
    if (!userSkills || !requiredSkills) return 0;
    
    const matchingSkills = userSkills.filter(skill => 
      requiredSkills.some(required => 
        required.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(required.toLowerCase())
      )
    );
    
    return Math.round((matchingSkills.length / requiredSkills.length) * 100);
  };

  const fetchJobMatches = async () => {
    try {
      setLoading(true);
      
      // Fetch all job roles
      const { data: jobRoles, error: jobError } = await supabase
        .from('job_roles' as any)
        .select('*') as { data: JobRole[] | null; error: any };

      if (jobError) throw jobError;

      if (!user) {
        setJobMatches(jobRoles || []);
        setLoading(false);
        return;
      }

      // Fetch user's skills from latest resume
      const { data: resumes, error: resumeError } = await supabase
        .from('resumes' as any)
        .select('skills')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1) as { data: Resume[] | null; error: any };

      if (resumeError) throw resumeError;

      const userSkills = resumes?.[0]?.skills || [];

      // Calculate matches and fetch existing saved matches
      const matchesWithPercentage = await Promise.all(
        (jobRoles || []).map(async (job) => {
          const matchPercentage = calculateMatchPercentage(userSkills, job.required_skills);
          const matchingSkills = userSkills.filter(skill => 
            job.required_skills.some(required => 
              required.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(required.toLowerCase())
            )
          );
          const missingSkills = job.required_skills.filter(required =>
            !userSkills.some(skill =>
              required.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(required.toLowerCase())
            )
          );

          // Check if this job is saved by the user
          const { data: savedMatch } = await supabase
            .from('user_job_matches' as any)
            .select('is_saved')
            .eq('user_id', user.id)
            .eq('job_role_id', job.id)
            .maybeSingle() as { data: UserJobMatch | null; error: any };

          return {
            ...job,
            match_percentage: matchPercentage,
            matching_skills: matchingSkills,
            missing_skills: missingSkills,
            is_saved: savedMatch?.is_saved || false,
          };
        })
      );

      // Sort by match percentage
      const sortedMatches = matchesWithPercentage.sort((a, b) => 
        (b.match_percentage || 0) - (a.match_percentage || 0)
      );

      setJobMatches(sortedMatches);
    } catch (error) {
      console.error('Error fetching job matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveJobMatch = async (jobId: string, matchPercentage: number, matchingSkills: string[], missingSkills: string[]) => {
    if (!user) return;

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      // Call secure edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/job-matches`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save',
          jobId,
          matchPercentage,
          matchingSkills,
          missingSkills,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save job match');
      }

      // Update local state
      setJobMatches(prev => prev.map(job => 
        job.id === jobId ? { ...job, is_saved: true } : job
      ));
    } catch (error) {
      console.error('Error saving job match:', error);
    }
  };

  const unsaveJobMatch = async (jobId: string) => {
    if (!user) return;

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      // Call secure edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/job-matches`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'unsave',
          jobId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to unsave job match');
      }

      // Update local state
      setJobMatches(prev => prev.map(job => 
        job.id === jobId ? { ...job, is_saved: false } : job
      ));
    } catch (error) {
      console.error('Error unsaving job match:', error);
    }
  };

  useEffect(() => {
    fetchJobMatches();
  }, [user]);

  return {
    jobMatches,
    loading,
    saveJobMatch,
    unsaveJobMatch,
    refetch: fetchJobMatches,
  };
};