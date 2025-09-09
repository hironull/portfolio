import { useState, useEffect, useCallback } from "react";
import { TerminalWindow } from "./TerminalWindow";
import { AnimatedSection } from "./AnimatedSection";
import { Button } from "./ui/button";
import { Github, Mail, FileText, Download, Calculator } from "lucide-react";
import { portfolioConfig } from "../config/portfolio.config";
import pixelAvatar from "../assets/pixel-avatar.png";
import { Link } from "react-router-dom";

export const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const { personal, social, theme } = portfolioConfig;
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < personal.tagline.length) {
        setDisplayText(personal.tagline.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, theme.animations.typingSpeed);
    
    return () => clearInterval(timer);
  }, [personal.tagline, theme.animations.typingSpeed]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Optimized background blur elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-accent/8 rounded-full blur-2xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-primary/3 rounded-full blur-3xl animate-float-slow" />
      </div>

      <AnimatedSection animation="slide-in-up" className="w-full relative z-10">
        <TerminalWindow title="root@hiro:~#" className="w-full max-w-4xl mx-auto backdrop-blur-md bg-background/95 border border-primary/20 shadow-2xl">
          <div className="text-center space-y-8">
            {/* Sleek Avatar */}
            <AnimatedSection animation="slide-in-up" delay={1} className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src={pixelAvatar} 
                  alt={`${personal.name}'s avatar`} 
                  className="relative w-28 h-28 rounded-full border-2 border-primary/30 group-hover:border-primary/60 transition-all duration-500 transform group-hover:scale-105"
                />
              </div>
            </AnimatedSection>
            
            {/* Sleek Name and Title */}
            <AnimatedSection animation="slide-in-up" delay={1.5} className="space-y-3">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent tracking-tight">
                {personal.name}
              </h1>
              <h2 className="text-xl md:text-2xl text-primary font-medium">
                {personal.title}
              </h2>
            </AnimatedSection>
            
            {/* Optimized Typing Animation */}
            <AnimatedSection delay={2} className="min-h-[120px] flex items-center justify-center">
              <div className="max-w-3xl mx-auto glass-card p-6 rounded-xl">
                <p className="text-foreground/90 leading-relaxed text-lg font-light">
                  {displayText}
                  <span className="cursor inline-block w-0.5 h-6 bg-primary ml-1 animate-pulse">|</span>
                </p>
              </div>
            </AnimatedSection>
            
            {/* System Status */}
            <AnimatedSection animation="slide-in-up" delay={2.5} className="flex justify-center">
              <div className="flex items-center space-x-3 glass-card px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-foreground/80 font-medium">Online</span>
              </div>
            </AnimatedSection>
            
            {/* Contact Info */}
            <AnimatedSection animation="slide-in-up" delay={3}>
              <div className="flex items-center justify-center space-x-3 glass-card p-3 rounded-lg hover:bg-primary/5 transition-all duration-300">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-foreground/90">{personal.email}</span>
              </div>
            </AnimatedSection>
            
            {/* Action Buttons */}
            <AnimatedSection animation="slide-in-up" delay={3.5}>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="hover-lift border-accent/30 hover:border-accent hover:bg-accent/10 transition-all duration-300 group"
                  onClick={() => window.open(social.github, '_blank')}
                >
                  <Github className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  GitHub
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="hover-lift border-accent/30 hover:border-accent hover:bg-accent/10 transition-all duration-300 group"
                  onClick={() => scrollToSection('contact')}
                >
                  <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Contact
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="hover-lift border-accent/30 hover:border-accent hover:bg-accent/10 transition-all duration-300 group"
                  onClick={() => scrollToSection('projects')}
                >
                  <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Projects
                </Button>
                <Link to="/converter">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="hover-lift border-accent/30 hover:border-accent hover:bg-accent/10 transition-all duration-300 group"
                  >
                    <Calculator className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Tools
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Scroll indicator */}
            <AnimatedSection animation="fade-in" delay={4}>
              <div className="pt-6">
                <div className="flex flex-col items-center space-y-2 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                     onClick={() => scrollToSection('about')}>
                  <span className="text-xs text-foreground/60">Explore</span>
                  <div className="w-px h-6 bg-primary/60 animate-pulse" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </TerminalWindow>
      </AnimatedSection>
    </section>
  );
};