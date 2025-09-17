import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Upload } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Sync Your Skills with 
              <span className="block text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200">
                Dream Careers
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Upload your resume, discover skill gaps, and get personalized learning paths 
              to land your ideal job. AI-powered career alignment made simple.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="hero" size="hero" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="hero" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Upload className="mr-2 h-5 w-5" />
                Upload Resume
              </Button>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Target className="h-12 w-12 text-green-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-gray-200">AI analyzes your skills and matches you with perfect career opportunities</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <TrendingUp className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gap Analysis</h3>
              <p className="text-gray-200">Identify missing skills and get personalized learning recommendations</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Upload className="h-12 w-12 text-orange-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
              <p className="text-gray-200">Simply upload your resume and let our AI do the heavy lifting</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;