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
    let charTimeout: NodeJS.Timeout;
    
    const typeNextChar = () => {
      if (i < personal.tagline.length) {
        setDisplayText(personal.tagline.slice(0, i + 1));
        i++;
        // Variable speed for more natural typing
        const delay = Math.random() * 30 + theme.animations.typingSpeed;
        charTimeout = setTimeout(typeNextChar, delay);
      }
    };
    
    // Start typing after a brief delay
    const startDelay = setTimeout(typeNextChar, 300);
    
    return () => {
      clearTimeout(startDelay);
      clearTimeout(charTimeout);
    };
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
      {/* Enhanced background with shiny gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-3xl animate-float opacity-50" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-l from-accent/25 via-primary/15 to-secondary/20 rounded-full blur-2xl animate-float-delayed opacity-60" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-primary/15 via-transparent to-accent/15 rounded-full blur-3xl animate-float-slow opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <AnimatedSection animation="slide-in-up" className="w-full relative z-10">
        <TerminalWindow title="root@hiro:~#" className="w-full max-w-4xl mx-auto backdrop-blur-md bg-background/95 border-2 border-primary/30 shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500 group relative overflow-hidden">
          {/* Shiny border effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute -inset-[2px] bg-gradient-to-r from-primary/30 via-accent/40 to-secondary/30 rounded-lg blur-sm animate-pulse" />
          </div>
          <div className="text-center space-y-8 relative z-10">
            {/* Enhanced Avatar with Stunning Glow */}
            <AnimatedSection animation="slide-in-up" delay={1} className="flex justify-center">
              <div className="relative group">
                {/* Enhanced Outer Glow Layers with shiny effect */}
                <div className="absolute -inset-8 bg-gradient-to-r from-primary/40 via-accent/40 to-secondary/40 rounded-full blur-3xl opacity-70 animate-pulse" />
                <div className="absolute -inset-6 bg-gradient-to-l from-accent/50 via-secondary/50 to-primary/50 rounded-full blur-2xl opacity-80 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/60 via-accent/60 to-secondary/60 rounded-full blur-xl opacity-90 group-hover:opacity-100 transition-all duration-700" />
                
                {/* Enhanced Rotating Ring with shiny borders */}
                <div className="absolute -inset-3 rounded-full animate-spin" style={{ animationDuration: '6s' }}>
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/70 via-accent/80 via-transparent to-secondary/70 blur-sm" />
                </div>
                
                {/* Enhanced Inner Border Glow */}
                <div className="absolute -inset-2 bg-gradient-to-br from-primary/70 via-accent/70 to-secondary/70 rounded-full blur-md opacity-90 group-hover:opacity-100 transition-all duration-500" />
                
                {/* Avatar Container with enhanced border */}
                <div className="relative">
                  <img 
                    src={pixelAvatar} 
                    alt={`${personal.name}'s avatar`} 
                    className="relative w-32 h-32 rounded-full border-[3px] border-accent/60 group-hover:border-accent shadow-[0_0_15px_rgba(var(--accent),0.5)] group-hover:shadow-[0_0_25px_rgba(var(--accent),0.8)] transition-all duration-700 transform group-hover:scale-110 pixel-art"
                  />
                  
                  {/* Inner Highlight */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                </div>
                
                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-accent/60 rounded-full animate-ping opacity-60"
                      style={{
                        left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 60}%`,
                        top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 60}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${2 + i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
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
            
            {/* Enhanced Typing Animation with shiny border */}
            <AnimatedSection delay={2} className="min-h-[120px] flex items-center justify-center">
              <div className="max-w-3xl mx-auto glass-card p-6 rounded-xl border-2 border-accent/30 hover:border-accent/50 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute -inset-[2px] bg-gradient-to-r from-primary/20 via-accent/30 to-secondary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                <p className="text-foreground/90 leading-relaxed text-lg font-light tracking-wide relative z-10">
                  {displayText}
                  <span className="cursor inline-block w-0.5 h-6 bg-gradient-to-b from-accent to-secondary ml-1 animate-pulse shadow-lg shadow-accent/50">|</span>
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
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(personal.email);
                    const btn = document.activeElement as HTMLElement;
                    const originalContent = btn.innerHTML;
                    btn.innerHTML = '<div class="flex items-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>Email copied!</span></div>';
                    setTimeout(() => {
                      btn.innerHTML = originalContent;
                    }, 2000);
                  }}
                  className="flex items-center space-x-3 glass-card p-3 rounded-lg hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
                >
                  <Mail className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-foreground/90">{personal.email}</span>
                </button>
              </div>
            </AnimatedSection>
            
            {/* Action Buttons */}
            <AnimatedSection animation="slide-in-up" delay={3.5}>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="hero-button group relative overflow-hidden border-accent/50 bg-background/50 hover:border-accent hover:bg-accent/20 hover:text-foreground transition-all duration-500 backdrop-blur-sm"
                  onClick={() => window.open(social.github, '_blank')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Github className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10">GitHub</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="hero-button group relative overflow-hidden border-accent/50 bg-background/50 hover:border-accent hover:bg-accent/20 hover:text-foreground transition-all duration-500 backdrop-blur-sm"
                  onClick={() => scrollToSection('contact')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10">Contact</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="hero-button group relative overflow-hidden border-accent/50 bg-background/50 hover:border-accent hover:bg-accent/20 hover:text-foreground transition-all duration-500 backdrop-blur-sm"
                  onClick={() => scrollToSection('projects')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10">Projects</span>
                </Button>
                <Link to="/tools">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="hero-button group relative overflow-hidden border-accent/50 bg-background/50 hover:border-accent hover:bg-accent/20 hover:text-foreground transition-all duration-500 backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Calculator className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10">Tools</span>
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