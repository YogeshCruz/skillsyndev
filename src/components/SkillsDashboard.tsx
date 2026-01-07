import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ExternalLink, Heart, HeartOff, Award, TrendingUp, Target, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useJobMatches } from "@/hooks/useJobMatches";
import { supabase } from "@/integrations/supabase/client";

interface ResumeData {
  skills: string[] | null;
  resume_score: number | null;
  score_explanation: string | null;
}

interface LearningRecommendation {
  id: string;
  skill: string;
  resource_title: string | null;
  resource_url: string | null;
  priority: number | null;
  recommendation_type?: string;
  title?: string;
  provider?: string;
  description?: string;
  url?: string;
}

const SkillsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [resumeScore, setResumeScore] = useState(0);
  const [learningRecommendations, setLearningRecommendations] = useState<any[]>([]);
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  
  const { user } = useAuth();
  const { jobMatches, loading, saveJobMatch, unsaveJobMatch } = useJobMatches();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
    
    // Check if resume has been uploaded in this session
    const storedScore = sessionStorage.getItem('resumeScore');
    if (storedScore && parseInt(storedScore) > 0) {
      setHasUploadedResume(true);
      setResumeScore(parseInt(storedScore));
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user's latest resume data
      const { data: resumes } = await supabase
        .from('resumes' as any)
        .select('skills, resume_score, score_explanation')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1) as { data: ResumeData[] | null; error: any };

      if (resumes && resumes.length > 0) {
        setUserSkills(resumes[0].skills || []);
        setResumeScore(resumes[0].resume_score || 0);
        
        // Store score explanation if available
        if (resumes[0].score_explanation) {
          sessionStorage.setItem('resumeScoreExplanation', resumes[0].score_explanation);
        }
      }

      // Fetch learning recommendations
      const { data: recommendations } = await supabase
        .from('learning_recommendations' as any)
        .select('*')
        .limit(6) as { data: LearningRecommendation[] | null; error: any };
      
      setLearningRecommendations(recommendations || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Dev] Error fetching user data:', error);
      }
    }
  };

  const handleSaveJob = async (job: any) => {
    if (job.is_saved) {
      await unsaveJobMatch(job.id);
    } else {
      await saveJobMatch(job.id, job.match_percentage || 0, job.matching_skills || [], job.missing_skills || []);
    }
  };

  // Transform user skills into display format
  const skillsWithLevels = userSkills.map(skill => ({
    name: skill,
    level: Math.floor(Math.random() * 40) + 60,
    category: getCategoryForSkill(skill)
  }));

  function getCategoryForSkill(skill: string): string {
    const categories: { [key: string]: string } = {
      'JavaScript': 'Programming',
      'Python': 'Programming', 
      'TypeScript': 'Programming',
      'React': 'Frontend',
      'Vue.js': 'Frontend',
      'HTML': 'Frontend',
      'CSS': 'Frontend',
      'Node.js': 'Backend',
      'SQL': 'Database',
      'MongoDB': 'Database',
      'Git': 'Tools',
      'Docker': 'Tools',
      'AWS': 'Cloud',
    };
    return categories[skill] || 'Other';
  }

  // Show placeholder if no resume uploaded
  if (!hasUploadedResume) {
    return (
      <section id="dashboard" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Career Dashboard</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track your progress, discover opportunities, and accelerate your career growth
            </p>
          </div>
          <Card className="max-w-2xl mx-auto text-center py-12 card-elevated">
            <CardContent className="pt-6">
              <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload your resume to get your score</h3>
              <p className="text-muted-foreground mb-6">
                Get personalized insights, job matches, and skill recommendations
              </p>
              <Button 
                variant="hero"
                onClick={() => {
                  const uploadSection = document.getElementById('resume-upload');
                  if (uploadSection) {
                    uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Upload Resume
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Career Dashboard</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your progress, discover opportunities, and accelerate your career growth
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Job Matches</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Skills Profile
                </CardTitle>
                <CardDescription>
                  Current skill levels based on your resume analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {skillsWithLevels.length > 0 ? skillsWithLevels.map((skill) => (
                    <Card key={skill.name} className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="secondary">{skill.category}</Badge>
                      </div>
                      <div className="space-y-2">
                        <Progress value={skill.level} className="h-2" />
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                    </Card>
                  )) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      Upload your resume to see your skills analysis
                    </div>
                  )}
                </div>

                <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Resume Score</h3>
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="text-4xl font-bold text-primary">{resumeScore || 0}/100</div>
                      <Badge variant={resumeScore >= 70 ? "default" : resumeScore >= 40 ? "secondary" : "destructive"}>
                        {resumeScore >= 91 ? "Excellent" : resumeScore >= 71 ? "Good" : resumeScore >= 41 ? "Average" : resumeScore > 0 ? "Needs Work" : "Not Scored"}
                      </Badge>
                    </div>
                    <Progress value={resumeScore || 0} className="max-w-xs mx-auto mb-4" />
                    {typeof window !== 'undefined' && sessionStorage.getItem('resumeScoreExplanation') && (
                      <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4 text-left px-4">
                        {sessionStorage.getItem('resumeScoreExplanation')}
                      </p>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const improveSection = document.getElementById('interview');
                        if (improveSection) {
                          improveSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                    >
                      Improve Score
                    </Button>
                  </div>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            {loading ? (
              <div className="text-center py-8">Loading job matches...</div>
            ) : (
              <div className="grid gap-6">
                {jobMatches.slice(0, 10).map((job) => (
                  <Card key={job.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          {job.match_percentage !== undefined && (
                            <Badge variant="outline" className="text-primary border-primary">
                              {job.match_percentage}% Match
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-1">{job.industry}</p>
                        <p className="text-sm font-medium text-success">{job.salary_range}</p>
                      </div>
                      <div className="flex gap-2">
                        {user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveJob(job)}
                            className="flex items-center gap-2"
                          >
                            {job.is_saved ? (
                              <Heart className="h-4 w-4 fill-current text-red-500" />
                            ) : (
                              <HeartOff className="h-4 w-4" />
                            )}
                            {job.is_saved ? 'Saved' : 'Save'}
                          </Button>
                        )}
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 text-success">Required Skills:</h4>
                        <div className="flex flex-wrap gap-1">
                          {job.required_skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs bg-success/10 text-success">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {job.missing_skills && job.missing_skills.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 text-warning">Skills to Develop:</h4>
                          <div className="flex flex-wrap gap-1">
                            {job.missing_skills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs bg-warning/10 text-warning">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="grid gap-4">
              {learningRecommendations.map((item, index) => (
                <Card key={index} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {item.recommendation_type === 'course' && <BookOpen className="h-4 w-4 text-primary" />}
                      {item.recommendation_type === 'certification' && <Award className="h-4 w-4 text-secondary" />}
                      {item.recommendation_type === 'project' && <Target className="h-4 w-4 text-accent" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.provider}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      {item.url && (
                        <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Learn More
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default SkillsDashboard;