-- Create resumes table
CREATE TABLE public.resumes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    filename TEXT NOT NULL,
    file_url TEXT,
    file_hash TEXT,
    skills TEXT[] DEFAULT '{}',
    education TEXT[] DEFAULT '{}',
    experience TEXT[] DEFAULT '{}',
    resume_score INTEGER DEFAULT 0,
    score_explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_roles table
CREATE TABLE public.job_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    required_skills TEXT[] DEFAULT '{}',
    salary_range TEXT,
    growth_rate TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_job_matches table
CREATE TABLE public.user_job_matches (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    job_role_id UUID REFERENCES public.job_roles(id) ON DELETE CASCADE,
    match_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning_recommendations table
CREATE TABLE public.learning_recommendations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    skill TEXT NOT NULL,
    resource_title TEXT,
    resource_url TEXT,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies for resumes
CREATE POLICY "Users can view their own resumes" ON public.resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own resumes" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resumes" ON public.resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resumes" ON public.resumes FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for job_roles (public read)
CREATE POLICY "Anyone can view job roles" ON public.job_roles FOR SELECT USING (true);

-- RLS policies for user_job_matches
CREATE POLICY "Users can view their own job matches" ON public.user_job_matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own job matches" ON public.user_job_matches FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for learning_recommendations
CREATE POLICY "Users can view their own recommendations" ON public.learning_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own recommendations" ON public.learning_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Storage policies
CREATE POLICY "Users can upload their own resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);