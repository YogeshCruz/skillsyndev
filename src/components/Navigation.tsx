import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";
import { Menu, X, Target } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gradient">SkillSync</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <AuthModal 
              trigger={
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              }
            />
            <AuthModal 
              trigger={
                <Button variant="hero" size="sm">
                  Get Started
                </Button>
              }
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </a>
              <a 
                href="#pricing" 
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <AuthModal 
                  trigger={
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  }
                />
                <AuthModal 
                  trigger={
                    <Button variant="hero" className="w-full">
                      Get Started
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;