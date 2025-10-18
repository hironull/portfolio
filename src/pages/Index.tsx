import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Skills } from "../components/Skills";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";
import { ScrollProgress } from "../components/ScrollProgress";
import { ParticleField } from "../components/ParticleField";
import { StatsCarousel } from "../components/StatsCarousel";
import { portfolioConfig } from "../config/portfolio.config";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { features } = portfolioConfig;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Smooth page entrance animation
    setIsLoaded(true);
    
    // Log visitor
    const logVisitor = async () => {
      try {
        await supabase.functions.invoke('log-visitor');
      } catch (error) {
        console.error('Error logging visitor:', error);
      }
    };
    
    logVisitor();
  }, []);
  
  return (
    <div className={`min-h-screen bg-background relative transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Scroll Progress Indicator */}
      {features.particles && <ScrollProgress />}
      
      {/* Particle Background Effect */}
      {features.particles && <ParticleField />}
      
      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <StatsCarousel />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
