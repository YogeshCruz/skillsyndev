import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ResumeUpload from "@/components/ResumeUpload";
import SkillsDashboard from "@/components/SkillsDashboard";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ResumeUpload />
      <SkillsDashboard />
      <Footer />
    </div>
  );
};

export default Index;
