import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, BookOpen, Award, ExternalLink } from "lucide-react";

const SkillsDashboard = () => {
  // Mock data - in real app this would come from API
  const userSkills = [
    { name: "JavaScript", level: 85, category: "Programming" },
    { name: "React", level: 80, category: "Frontend" },
    { name: "Node.js", level: 70, category: "Backend" },
    { name: "SQL", level: 75, category: "Database" },
    { name: "Git", level: 90, category: "Tools" },
    { name: "TypeScript", level: 65, category: "Programming" }
  ];

  const jobMatches = [
    {
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      match: 87,
      requiredSkills: ["React", "JavaScript", "CSS", "HTML"],
      missingSkills: ["Vue.js", "Angular"]
    },
    {
      title: "Full Stack Developer", 
      company: "StartupXYZ",
      match: 72,
      requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript"],
      missingSkills: ["MongoDB", "AWS", "Docker"]
    },
    {
      title: "Software Engineer",
      company: "BigTech Co.",
      match: 68,
      requiredSkills: ["JavaScript", "Python", "SQL", "Git"],
      missingSkills: ["Python", "System Design", "Kubernetes"]
    }
  ];

  const learningRecommendations = [
    {
      title: "Complete React Developer Course",
      provider: "Udemy",
      type: "Course",
      rating: 4.8,
      duration: "40 hours"
    },
    {
      title: "MongoDB Fundamentals",
      provider: "MongoDB University",
      type: "Certification",
      rating: 4.9,
      duration: "6 weeks"
    },
    {
      title: "Build a Full Stack App",
      provider: "FreeCodeCamp",
      type: "Project",
      rating: 4.7,
      duration: "20 hours"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Your Skills Dashboard</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your progress, discover opportunities, and plan your career growth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills Overview */}
          <div className="lg:col-span-2 space-y-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userSkills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {skill.category}
                        </Badge>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                      <span className="text-sm text-muted-foreground">
                        {skill.level}% proficiency
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Job Matches */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Top Job Matches
                </CardTitle>
                <CardDescription>
                  Positions that align with your current skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobMatches.map((job, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{job.match}%</div>
                          <div className="text-xs text-muted-foreground">match</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Required: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {job.requiredSkills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {job.missingSkills.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-warning">Missing: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {job.missingSkills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="destructive" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm" className="mt-3">
                        How to Improve
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Recommendations */}
          <div className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recommended Learning
                </CardTitle>
                <CardDescription>
                  Personalized courses to boost your career
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningRecommendations.map((item, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {item.type === 'Course' && <BookOpen className="h-4 w-4 text-primary" />}
                          {item.type === 'Certification' && <Award className="h-4 w-4 text-secondary" />}
                          {item.type === 'Project' && <Target className="h-4 w-4 text-accent" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.provider}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{item.duration}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs">⭐ {item.rating}</span>
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Recommendations
                </Button>
              </CardContent>
            </Card>

            {/* Resume Score */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Resume Score</CardTitle>
                <CardDescription>
                  Overall strength of your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">82</div>
                <div className="text-sm text-muted-foreground mb-4">out of 100</div>
                <Progress value={82} className="mb-4" />
                <Button variant="outline" size="sm">
                  Improve Score
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsDashboard;