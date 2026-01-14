import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Search, CheckCircle, XCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface MatchResult {
  matchPercentage: number;
  matchingSkills: string[];
  partialMatches: string[];
  missingSkills: string[];
  summary: string;
  suggestions: string[];
}

const ResumeJobMatcher = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const { user } = useAuth();

  const extractSkillsFromText = (text: string): string[] => {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Vue', 'Angular',
      'Node.js', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'Docker',
      'Kubernetes', 'Git', 'CI/CD', 'REST API', 'GraphQL', 'HTML', 'CSS',
      'Tailwind', 'SASS', 'Redux', 'Next.js', 'Express', 'Django', 'Flask',
      'Machine Learning', 'Data Analysis', 'Agile', 'Scrum', 'Project Management',
      'Communication', 'Leadership', 'Problem Solving', 'Excel', 'Power BI',
      'Tableau', 'Figma', 'UI/UX', 'Product Management', 'Marketing', 'SEO',
      'Content Writing', 'Customer Service', 'Sales', 'Negotiation'
    ];

    const foundSkills: string[] = [];
    const lowerText = text.toLowerCase();

    commonSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    return foundSkills;
  };

  const analyzeMatch = async () => {
    if (!jobDescription.trim()) return;

    setIsAnalyzing(true);

    try {
      // Get user's skills from resume
      let userSkills: string[] = [];
      
      if (user) {
        const { data: resumes } = await supabase
          .from('resumes')
          .select('skills')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        userSkills = resumes?.[0]?.skills || [];
      }

      // If no user skills, check session storage
      if (userSkills.length === 0) {
        const storedSkills = sessionStorage.getItem('userSkills');
        if (storedSkills) {
          userSkills = JSON.parse(storedSkills);
        }
      }

      // Extract required skills from job description
      const requiredSkills = extractSkillsFromText(jobDescription);

      // Calculate matches
      const matchingSkills = userSkills.filter(skill =>
        requiredSkills.some(req =>
          req.toLowerCase() === skill.toLowerCase()
        )
      );

      const partialMatches = userSkills.filter(skill =>
        requiredSkills.some(req =>
          (req.toLowerCase().includes(skill.toLowerCase()) ||
           skill.toLowerCase().includes(req.toLowerCase())) &&
          !matchingSkills.includes(skill)
        )
      );

      const missingSkills = requiredSkills.filter(skill =>
        !userSkills.some(us =>
          us.toLowerCase() === skill.toLowerCase() ||
          us.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(us.toLowerCase())
        )
      );

      const matchPercentage = requiredSkills.length > 0
        ? Math.round(((matchingSkills.length + partialMatches.length * 0.5) / requiredSkills.length) * 100)
        : 0;

      // Generate summary
      let summary = "";
      if (matchPercentage >= 80) {
        summary = "Excellent fit! Your skills align very well with this position. You're a strong candidate.";
      } else if (matchPercentage >= 60) {
        summary = "Good match! You have most of the required skills. A few additions could make you ideal.";
      } else if (matchPercentage >= 40) {
        summary = "Moderate match. You have some relevant skills, but would benefit from developing others.";
      } else {
        summary = "This role requires skills outside your current expertise. Consider it a stretch goal.";
      }

      // Generate suggestions
      const suggestions = missingSkills.slice(0, 5).map(skill =>
        `Learn ${skill} through online courses or hands-on projects to improve your candidacy.`
      );

      setMatchResult({
        matchPercentage,
        matchingSkills,
        partialMatches,
        missingSkills,
        summary,
        suggestions,
      });
    } catch (error) {
      console.error('Error analyzing match:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="job-matcher" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Resume-Job Matcher</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Match Your Resume to Any Job</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Paste a job description and instantly see how well your skills match the requirements
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Input Panel */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Job Description
              </CardTitle>
              <CardDescription>
                Paste the job description you want to compare against your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste the job description here...

Example:
We are looking for a Full Stack Developer with experience in React, Node.js, and PostgreSQL. The ideal candidate should have strong problem-solving skills and experience with cloud platforms like AWS..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[250px] resize-none"
              />
              <Button
                className="w-full"
                onClick={analyzeMatch}
                disabled={isAnalyzing || !jobDescription.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Match
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Match Analysis</CardTitle>
              <CardDescription>
                {matchResult
                  ? "Here's how your skills compare to this job"
                  : "Results will appear here after analysis"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {matchResult ? (
                <div className="space-y-6">
                  {/* Match Score */}
                  <div className="text-center p-6 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                    <div className="text-5xl font-bold text-primary mb-2">
                      {matchResult.matchPercentage}%
                    </div>
                    <p className="text-sm text-muted-foreground">Job Match Score</p>
                    <Progress value={matchResult.matchPercentage} className="mt-4 h-3" />
                  </div>

                  {/* Summary */}
                  <p className="text-muted-foreground text-center">{matchResult.summary}</p>

                  {/* Skills Breakdown */}
                  <div className="space-y-4">
                    {matchResult.matchingSkills.length > 0 && (
                      <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="font-medium text-success">
                            Matching Skills ({matchResult.matchingSkills.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {matchResult.matchingSkills.map(skill => (
                            <Badge key={skill} className="bg-success/20 text-success">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchResult.partialMatches.length > 0 && (
                      <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-warning" />
                          <span className="font-medium text-warning">
                            Related Skills ({matchResult.partialMatches.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {matchResult.partialMatches.map(skill => (
                            <Badge key={skill} className="bg-warning/20 text-warning">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchResult.missingSkills.length > 0 && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="h-4 w-4 text-destructive" />
                          <span className="font-medium text-destructive">
                            Skills to Develop ({matchResult.missingSkills.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {matchResult.missingSkills.slice(0, 10).map(skill => (
                            <Badge key={skill} className="bg-destructive/20 text-destructive">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggestions */}
                  {matchResult.suggestions.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-medium mb-3">💡 Recommendations</h4>
                      <ul className="space-y-2">
                        {matchResult.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Paste a job description and click "Analyze Match"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ResumeJobMatcher;
