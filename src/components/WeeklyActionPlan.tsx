import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DailyTask {
  id: string;
  title: string;
  description: string;
  duration: string;
  outcome: string;
  completed: boolean;
  skill: string;
}

interface DayPlan {
  day: number;
  dayName: string;
  tasks: DailyTask[];
}

const WeeklyActionPlan = () => {
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    checkForExistingData();
  }, [user]);

  const checkForExistingData = async () => {
    if (!user) return;

    try {
      const { data: resumes } = await supabase
        .from('resumes' as any)
        .select('skills, resume_score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1) as { data: any[] | null };

      if (resumes && resumes.length > 0 && resumes[0].skills?.length > 0) {
        setHasData(true);
      }
    } catch (error) {
      console.error('Error checking data:', error);
    }
  };

  const generateWeeklyPlan = async () => {
    if (!user) {
      toast.error("Please sign in to generate your action plan");
      return;
    }

    setLoading(true);

    try {
      // Fetch user's skill data
      const { data: resumes } = await supabase
        .from('resumes' as any)
        .select('skills, resume_score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1) as { data: any[] | null };

      // Fetch job matches for skill gaps
      const { data: jobMatches } = await supabase
        .from('user_job_matches' as any)
        .select('missing_skills, matching_skills')
        .eq('user_id', user.id)
        .limit(5) as { data: any[] | null };

      // Fetch learning recommendations
      const { data: recommendations } = await supabase
        .from('learning_recommendations' as any)
        .select('skill, resource_title, priority')
        .eq('user_id', user.id)
        .order('priority', { ascending: true })
        .limit(10) as { data: any[] | null };

      const userSkills = resumes?.[0]?.skills || [];
      const missingSkills = jobMatches?.flatMap(m => m.missing_skills || []) || [];
      const learningSkills = recommendations?.map(r => r.skill) || [];

      // Combine all skill gap data
      const skillGaps = [...new Set([...missingSkills, ...learningSkills])].slice(0, 7);

      if (skillGaps.length === 0 && userSkills.length === 0) {
        toast.error("Upload your resume first to get personalized action plans");
        setLoading(false);
        return;
      }

      // Call AI to generate the weekly plan
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weekly-action-plan`;
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          userSkills,
          skillGaps,
          resumeScore: resumes?.[0]?.resume_score || 0,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (response.status === 402) {
          toast.error("AI credits exhausted. Please add more credits.");
        } else {
          toast.error("Failed to generate action plan. Please try again.");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setWeeklyPlan(data.weeklyPlan || []);
      toast.success("Your weekly action plan is ready!");
    } catch (error) {
      console.error('Error generating plan:', error);
      toast.error("Failed to generate action plan");
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = (dayIndex: number, taskId: string) => {
    setWeeklyPlan(prev => prev.map((day, i) => {
      if (i === dayIndex) {
        return {
          ...day,
          tasks: day.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return day;
    }));
  };

  const completedTasks = weeklyPlan.flatMap(d => d.tasks).filter(t => t.completed).length;
  const totalTasks = weeklyPlan.flatMap(d => d.tasks).length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getDayOfWeek = (dayOffset: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    today.setDate(today.getDate() + dayOffset);
    return days[today.getDay()];
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered Planning</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Weekly Action Plan</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Turn your career goals into daily achievable tasks. AI generates personalized 7-day action plans based on your skill gaps.
            </p>
          </div>

          {weeklyPlan.length === 0 ? (
            <Card className="card-glow text-center py-12">
              <CardContent className="pt-6">
                <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Generate Your Personalized Action Plan</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Based on your resume analysis, skill gaps, and career roadmap, we'll create a 7-day plan with achievable daily tasks.
                </p>
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={generateWeeklyPlan}
                  disabled={loading || !hasData}
                  className="group"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Weekly Plan
                    </>
                  )}
                </Button>
                {!hasData && !loading && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Upload your resume first to unlock this feature
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress Overview */}
              <Card className="card-glow mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Weekly Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        {completedTasks} of {totalTasks} tasks completed
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-primary">{Math.round(progressPercentage)}%</div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={generateWeeklyPlan}
                        disabled={loading}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </CardContent>
              </Card>

              {/* Daily Plans */}
              <div className="grid gap-6">
                {weeklyPlan.map((day, dayIndex) => (
                  <Card key={day.day} className={`card-elevated transition-all ${
                    day.tasks.every(t => t.completed) ? 'border-success/50 bg-success/5' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            day.tasks.every(t => t.completed) 
                              ? 'bg-success text-white' 
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {day.tasks.every(t => t.completed) ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <span className="font-bold">{day.day}</span>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-xl">{day.dayName}</CardTitle>
                            <CardDescription>
                              {day.tasks.filter(t => t.completed).length} of {day.tasks.length} tasks done
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={day.tasks.every(t => t.completed) ? "default" : "secondary"}>
                          {day.tasks.reduce((acc, t) => {
                            const mins = parseInt(t.duration) || 30;
                            return acc + mins;
                          }, 0)} min total
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {day.tasks.map((task) => (
                        <div 
                          key={task.id}
                          className={`p-4 rounded-lg border transition-all ${
                            task.completed 
                              ? 'bg-success/5 border-success/30' 
                              : 'bg-muted/30 border-border hover:border-primary/30'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox 
                              checked={task.completed}
                              onCheckedChange={() => toggleTaskComplete(dayIndex, task.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {task.title}
                                </h4>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Badge variant="outline" className="text-xs">
                                    {task.skill}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {task.duration}
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                              <div className="flex items-center gap-1 text-xs text-primary">
                                <Target className="h-3 w-3" />
                                <span>Outcome: {task.outcome}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default WeeklyActionPlan;