-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  education TEXT,
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resumes table
CREATE TABLE public.resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  parsed_data JSONB,
  skills TEXT[],
  education TEXT[],
  experience TEXT[],
  keywords TEXT[],
  resume_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job roles table
CREATE TABLE public.job_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  required_skills TEXT[] NOT NULL,
  experience_level TEXT,
  salary_range TEXT,
  industry TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user job matches table
CREATE TABLE public.user_job_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_role_id UUID NOT NULL REFERENCES public.job_roles(id) ON DELETE CASCADE,
  match_percentage INTEGER NOT NULL,
  missing_skills TEXT[],
  matching_skills TEXT[],
  is_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_role_id)
);

-- Create learning recommendations table
CREATE TABLE public.learning_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_role_id UUID NOT NULL REFERENCES public.job_roles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  recommendation_type TEXT NOT NULL, -- 'course', 'project', 'certification', 'roadmap'
  title TEXT NOT NULL,
  url TEXT,
  provider TEXT,
  is_free BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for resumes
CREATE POLICY "Users can view their own resumes" ON public.resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own resumes" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resumes" ON public.resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resumes" ON public.resumes FOR DELETE USING (auth.uid() = user_id);

-- Create policies for job roles (public read)
CREATE POLICY "Anyone can view job roles" ON public.job_roles FOR SELECT USING (true);

-- Create policies for user job matches
CREATE POLICY "Users can view their own job matches" ON public.user_job_matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own job matches" ON public.user_job_matches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own job matches" ON public.user_job_matches FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for learning recommendations (public read)
CREATE POLICY "Anyone can view learning recommendations" ON public.learning_recommendations FOR SELECT USING (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample job roles data
INSERT INTO public.job_roles (title, description, required_skills, experience_level, salary_range, industry) VALUES
('Software Engineer', 'Develop and maintain software applications', ARRAY['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git'], 'Mid-level', '$70,000 - $120,000', 'Technology'),
('Data Scientist', 'Analyze complex data to help companies make decisions', ARRAY['Python', 'R', 'Machine Learning', 'SQL', 'Statistics', 'Pandas', 'NumPy'], 'Mid-level', '$80,000 - $140,000', 'Technology'),
('UI/UX Designer', 'Design user interfaces and experiences', ARRAY['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Design Systems'], 'Mid-level', '$60,000 - $100,000', 'Design'),
('DevOps Engineer', 'Manage infrastructure and deployment pipelines', ARRAY['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform', 'Monitoring'], 'Senior', '$90,000 - $150,000', 'Technology'),
('Product Manager', 'Guide product development and strategy', ARRAY['Product Strategy', 'User Research', 'Data Analysis', 'Agile', 'Communication', 'Roadmapping'], 'Mid-level', '$85,000 - $130,000', 'Product'),
('Frontend Developer', 'Build user-facing web applications', ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Responsive Design', 'TypeScript'], 'Junior', '$50,000 - $90,000', 'Technology'),
('Backend Developer', 'Develop server-side applications and APIs', ARRAY['Node.js', 'Python', 'Java', 'SQL', 'REST APIs', 'Database Design', 'Security'], 'Mid-level', '$65,000 - $110,000', 'Technology'),
('Mobile Developer', 'Create mobile applications for iOS and Android', ARRAY['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile UI/UX', 'App Store Optimization'], 'Mid-level', '$70,000 - $115,000', 'Technology');

-- Insert sample learning recommendations
INSERT INTO public.learning_recommendations (job_role_id, skill_name, recommendation_type, title, url, provider, is_free, description) 
SELECT 
  jr.id,
  unnest(jr.required_skills),
  'course',
  'Master ' || unnest(jr.required_skills),
  'https://coursera.org/' || lower(replace(unnest(jr.required_skills), ' ', '-')),
  'Coursera',
  false,
  'Comprehensive course on ' || unnest(jr.required_skills)
FROM public.job_roles jr;

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Create storage policies for resumes
CREATE POLICY "Users can upload their own resumes" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own resumes" ON storage.objects FOR SELECT USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own resumes" ON storage.objects FOR UPDATE USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own resumes" ON storage.objects FOR DELETE USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);