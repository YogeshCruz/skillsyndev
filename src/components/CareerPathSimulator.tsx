import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Users, TrendingUp, Clock, Target } from "lucide-react";

interface Step {
  title: string;
  duration: string;
  skills: string[];
  certifications?: string[];
}

interface PathData {
  targetRole: string;
  currentRole: string;
  timeline: string;
  successRate: number;
  totalUsers: number;
  steps: Step[];
}

const CareerPathSimulator = () => {
  const [selectedPath, setSelectedPath] = useState<string>("data-scientist");

  const paths: Record<string, PathData> = {
    "data-scientist": {
      targetRole: "Data Scientist",
      currentRole: "Junior Developer",
      timeline: "6 months",
      successRate: 53,
      totalUsers: 847,
      steps: [
        {
          title: "Master Python & Statistics",
          duration: "2 months",
          skills: ["Python", "NumPy", "Pandas", "Statistics"],
        },
        {
          title: "Learn Machine Learning",
          duration: "2 months",
          skills: ["Scikit-learn", "TensorFlow", "Model Training"],
          certifications: ["Google ML Certificate"],
        },
        {
          title: "Build Portfolio Projects",
          duration: "2 months",
          skills: ["Data Analysis", "Visualization", "Model Deployment"],
        },
      ],
    },
    "senior-dev": {
      targetRole: "Senior Full-Stack Developer",
      currentRole: "Mid-Level Developer",
      timeline: "9 months",
      successRate: 68,
      totalUsers: 1243,
      steps: [
        {
          title: "Master Advanced Patterns",
          duration: "3 months",
          skills: ["Design Patterns", "System Design", "Architecture"],
        },
        {
          title: "Lead Team Projects",
          duration: "3 months",
          skills: ["Team Leadership", "Code Review", "Mentoring"],
        },
        {
          title: "Specialize & Certify",
          duration: "3 months",
          skills: ["Cloud Architecture", "Performance Optimization"],
          certifications: ["AWS Solutions Architect"],
        },
      ],
    },
    "devops-engineer": {
      targetRole: "DevOps Engineer",
      currentRole: "Backend Developer",
      timeline: "8 months",
      successRate: 61,
      totalUsers: 592,
      steps: [
        {
          title: "Learn CI/CD & Containers",
          duration: "3 months",
          skills: ["Docker", "Kubernetes", "Jenkins", "GitLab CI"],
        },
        {
          title: "Master Cloud Platforms",
          duration: "3 months",
          skills: ["AWS/Azure", "Terraform", "Infrastructure as Code"],
          certifications: ["AWS DevOps Professional"],
        },
        {
          title: "Monitoring & Security",
          duration: "2 months",
          skills: ["Prometheus", "Grafana", "Security Best Practices"],
        },
      ],
    },
  };

  const currentPath = paths[selectedPath];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered Prediction</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Career Path Simulator</h2>
            <p className="text-muted-foreground text-lg">
              See exactly how others transitioned to your dream role
            </p>
          </div>

          {/* Path Selector */}
          <Card className="card-glow mb-8">
            <CardHeader>
              <CardTitle>Select Your Target Role</CardTitle>
              <CardDescription>Choose a role to see the detailed transition path</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedPath} onValueChange={setSelectedPath}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="data-scientist">
                    Junior Developer → Data Scientist
                  </SelectItem>
                  <SelectItem value="senior-dev">
                    Mid-Level Dev → Senior Full-Stack Developer
                  </SelectItem>
                  <SelectItem value="devops-engineer">
                    Backend Developer → DevOps Engineer
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Path Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="card-elevated">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary mb-1">
                  {currentPath.timeline}
                </div>
                <div className="text-sm text-muted-foreground">Estimated Timeline</div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-success mb-1">
                  {currentPath.successRate}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-warning mb-1">
                  {currentPath.totalUsers}
                </div>
                <div className="text-sm text-muted-foreground">Completed Path</div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary mb-1">
                  {currentPath.steps.length}
                </div>
                <div className="text-sm text-muted-foreground">Key Steps</div>
              </CardContent>
            </Card>
          </div>

          {/* Path Steps */}
          <div className="space-y-6">
            {currentPath.steps.map((step, index) => (
              <Card key={index} className="card-elevated hover:card-glow transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-1">{step.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {step.duration}
                        </CardDescription>
                      </div>
                    </div>
                    {index < currentPath.steps.length - 1 && (
                      <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                        Skills to Learn
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {step.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {step.certifications && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                          Recommended Certifications
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {step.certifications.map((cert) => (
                            <Badge key={cert} variant="outline" className="border-primary text-primary">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="default" size="lg" className="group">
              Start This Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPathSimulator;
