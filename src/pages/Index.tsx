import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Skills } from "../components/Skills";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";
import { ScrollProgress } from "../components/ScrollProgress";
import { ParticleField } from "../components/ParticleField";
import { MusicPlayer } from "../components/MusicPlayer";
import { portfolioConfig } from "../config/portfolio.config";
import { useState, useEffect } from "react";

const Index = () => {
  const { features } = portfolioConfig;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Smooth page entrance animation
    setIsLoaded(true);
  }, []);
  
  return (
    <div className={`min-h-screen bg-background relative transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Scroll Progress Indicator */}
      {features.particles && <ScrollProgress />}
      
      {/* Particle Background Effect */}
      {features.particles && <ParticleField />}
      
      {/* Music Player */}
      <MusicPlayer />
      
      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
