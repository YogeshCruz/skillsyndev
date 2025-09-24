import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Target, BookOpen, TrendingUp, Users, Brain } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Smart Resume Analysis",
      description: "Upload your resume and get instant AI-powered analysis of your skills, experience, and career positioning.",
      badge: "AI-Powered",
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Job Role Matching",
      description: "Get personalized job recommendations based on your skills with detailed match percentages.",
      badge: "Precision Matching",
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Skill Gap Analysis",
      description: "Identify exactly what skills you need to develop to reach your target roles.",
      badge: "Strategic Insights",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Learning Recommendations",
      description: "Get curated courses, certifications, and project ideas tailored to your career goals.",
      badge: "Personalized Learning",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Progress Tracking",
      description: "Monitor your skill development and career advancement with visual dashboards.",
      badge: "Real-time Updates",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Career Roadmaps",
      description: "Follow structured pathways to your dream job with milestone tracking.",
      badge: "Step-by-Step Guidance",
    },
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Career Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to align your skills with market demand and accelerate your career growth
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="text-xs">
                  {feature.badge}
                </Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;