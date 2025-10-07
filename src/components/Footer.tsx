import { Target, Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-card border-t border-border py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-primary glow-yellow" />
              <span className="text-lg font-bold text-primary">SkillSync</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Smart career alignment platform that helps professionals sync their skills with dream careers.
            </p>
            <div className="flex space-x-3">
              <Github className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors glow-yellow" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors glow-yellow" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors glow-yellow" />
              <Mail className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors glow-yellow" />
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => scrollToSection('resume-upload')} className="hover:text-primary transition-colors">Resume Analysis</button></li>
              <li><button onClick={() => scrollToSection('dashboard')} className="hover:text-primary transition-colors">Skill Matching</button></li>
              <li><button onClick={() => scrollToSection('roadmap')} className="hover:text-primary transition-colors">Career Roadmaps</button></li>
              <li><button onClick={() => scrollToSection('interview')} className="hover:text-primary transition-colors">Interview Prep</button></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-primary transition-colors">Documentation</button></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Career Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 SkillSync. All rights reserved. Built with ❤️ for career growth.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
