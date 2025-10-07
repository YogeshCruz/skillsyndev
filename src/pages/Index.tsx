import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import ResumeUpload from "@/components/ResumeUpload";
import SkillsDashboard from "@/components/SkillsDashboard";
import CareerRoadmap from "@/components/CareerRoadmap";
import InterviewPrep from "@/components/InterviewPrep";
import Gamification from "@/components/Gamification";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="resume-upload">
        <ResumeUpload />
      </div>
      <div id="dashboard">
        <SkillsDashboard />
      </div>
      <div id="roadmap">
        <CareerRoadmap />
      </div>
      <div id="interview">
        <InterviewPrep />
      </div>
      <div id="achievements">
        <Gamification />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
