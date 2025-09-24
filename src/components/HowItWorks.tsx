import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Search, Target, BookOpen } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: "Upload Your Resume",
      description: "Upload your PDF resume and our AI will extract your skills, experience, and education automatically.",
    },
    {
      number: "02", 
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Get Skill Analysis",
      description: "Receive detailed analysis of your current skills and see how they align with market demands.",
    },
    {
      number: "03",
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Discover Job Matches",
      description: "Explore job roles ranked by match percentage and understand what skills you need to develop.",
    },
    {
      number: "04",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Follow Learning Path",
      description: "Get personalized learning recommendations and track your progress towards your career goals.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How SkillSync Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to accelerate your career and land your dream job
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="relative text-center group hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                
                <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground px-8 py-3">
            Start Your Career Journey
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;