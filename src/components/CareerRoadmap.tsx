import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, CheckCircle2, Lock } from "lucide-react";

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  completed: boolean;
  locked: boolean;
}

const CareerRoadmap = () => {
  const [roadmapSteps] = useState<RoadmapStep[]>([
    {
      id: 1,
      title: "Master Core Programming",
      description: "Build strong foundation in programming fundamentals",
      duration: "2 months",
      skills: ["JavaScript", "TypeScript", "Data Structures"],
      completed: true,
      locked: false
    },
    {
      id: 2,
      title: "Frontend Frameworks",
      description: "Learn modern React development and state management",
      duration: "1.5 months",
      skills: ["React", "Redux", "Next.js"],
      completed: false,
      locked: false
    },
    {
      id: 3,
      title: "Backend Development",
      description: "Build scalable APIs and database systems",
      duration: "2 months",
      skills: ["Node.js", "PostgreSQL", "REST APIs"],
      completed: false,
      locked: true
    },
    {
      id: 4,
      title: "Cloud & DevOps",
      description: "Deploy and maintain production applications",
      duration: "1 month",
      skills: ["AWS", "Docker", "CI/CD"],
      completed: false,
      locked: true
    }
  ]);

  const completedSteps = roadmapSteps.filter(s => s.completed).length;
  const progress = (completedSteps / roadmapSteps.length) * 100;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Generated Roadmap</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Personalized Career Path</h2>
            <p className="text-muted-foreground text-lg">
              6-month plan to become a Full Stack Developer
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="card-glow mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Overall Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedSteps} of {roadmapSteps.length} milestones completed
                  </p>
                </div>
                <div className="text-3xl font-bold text-primary">{Math.round(progress)}%</div>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>

          {/* Roadmap Steps */}
          <div className="space-y-4">
            {roadmapSteps.map((step, index) => (
              <Card 
                key={step.id} 
                className={`card-elevated transition-all ${
                  step.locked ? 'opacity-60' : 'hover:card-glow'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-success text-white' :
                        step.locked ? 'bg-muted text-muted-foreground' :
                        'bg-primary text-primary-foreground glow-yellow'
                      }`}>
                        {step.completed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : step.locked ? (
                          <Lock className="h-5 w-5" />
                        ) : (
                          <TrendingUp className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={step.completed ? "outline" : "secondary"}>
                      {step.duration}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Skills to Learn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {step.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="border-primary text-primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {!step.locked && !step.completed && (
                    <Button variant="default" className="w-full">
                      Start Learning
                    </Button>
                  )}
                  
                  {step.completed && (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-semibold">Completed</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerRoadmap;
