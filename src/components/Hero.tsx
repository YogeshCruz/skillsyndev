import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Upload } from "lucide-react";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-75"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 border-2 border-primary/30 rounded-full px-6 py-2 mb-6">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-bold text-primary">AI-Powered Career Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Sync Your Skills with{" "}
              <span className="text-primary inline-block glow-yellow-strong">
                Dream Careers
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Upload your resume, discover skill gaps, and get personalized learning paths 
              to land your ideal job. AI-powered career alignment made simple.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                variant="hero" 
                size="hero" 
                className="group w-full sm:w-auto"
                onClick={() => scrollToSection('resume-upload')}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="hero" 
                className="w-full sm:w-auto"
                onClick={() => scrollToSection('resume-upload')}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Resume
              </Button>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in">
            <div className="card-elevated p-6 hover:card-glow transition-all cursor-pointer">
              <Target className="h-12 w-12 text-primary mx-auto mb-4 glow-yellow" />
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-muted-foreground">AI analyzes your skills and matches you with perfect career opportunities</p>
            </div>
            
            <div className="card-elevated p-6 hover:card-glow transition-all cursor-pointer">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4 glow-yellow" />
              <h3 className="text-xl font-semibold mb-2">Gap Analysis</h3>
              <p className="text-muted-foreground">Identify missing skills and get personalized learning recommendations</p>
            </div>
            
            <div className="card-elevated p-6 hover:card-glow transition-all cursor-pointer">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4 glow-yellow" />
              <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
              <p className="text-muted-foreground">Simply upload your resume and let our AI do the heavy lifting</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Added missing import
import { Zap } from "lucide-react";

export default Hero;
