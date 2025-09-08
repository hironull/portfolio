import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Skills } from "../components/Skills";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";
import { ScrollProgress } from "../components/ScrollProgress";
import { ParticleField } from "../components/ParticleField";
import { portfolioConfig } from "../config/portfolio.config";

const Index = () => {
  const { features } = portfolioConfig;
  
  return (
    <div className="min-h-screen bg-background relative">
      {/* Scroll Progress Indicator */}
      {features.particles && <ScrollProgress />}
      
      {/* Particle Background Effect */}
      {features.particles && <ParticleField />}
      
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
