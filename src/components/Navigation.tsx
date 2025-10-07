import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Target, Menu, X, Moon, Sun } from "lucide-react";
import AuthModal from "./AuthModal";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Target className="h-7 w-7 text-primary glow-yellow" />
              <span className="text-xl font-bold text-primary">SkillSync</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-foreground hover:text-primary transition-colors font-medium">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-foreground hover:text-primary transition-colors font-medium">
                How it Works
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-foreground hover:text-primary transition-colors font-medium">
                Pricing
              </button>
              <button onClick={() => scrollToSection('dashboard')} className="text-foreground hover:text-primary transition-colors font-medium">
                Dashboard
              </button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button variant="ghost" onClick={() => setShowAuthModal(true)}>
                Sign In
              </Button>
              <Button variant="default" onClick={() => setShowAuthModal(true)}>
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
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
            <div className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in">
              <button 
                onClick={() => scrollToSection('features')} 
                className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('dashboard')} 
                className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
              >
                Dashboard
              </button>
              <Button variant="ghost" onClick={() => setShowAuthModal(true)} className="w-full">
                Sign In
              </Button>
              <Button variant="default" onClick={() => setShowAuthModal(true)} className="w-full">
                Get Started
              </Button>
            </div>
          )}
        </nav>
      </header>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default Navigation;
