import { TerminalWindow } from "./TerminalWindow";
import { AnimatedSection } from "./AnimatedSection";
import { Badge } from "./ui/badge";
import { ExternalLink, Github, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";
import { portfolioConfig } from "../config/portfolio.config";

// Debug logging
console.log("TerminalWindow:", TerminalWindow);
console.log("AnimatedSection:", AnimatedSection);
console.log("Badge:", Badge);
console.log("ExternalLink:", ExternalLink);
console.log("Github:", Github);
console.log("Clock:", Clock);
console.log("Star:", Star);
console.log("Button:", Button);
console.log("portfolioConfig:", portfolioConfig);

const statusIcons = {
  production: Star,
  development: Clock,
  archived: Clock
};

const statusColors = {
  production: "bg-primary text-primary-foreground",
  development: "bg-yellow-500 text-black", 
  archived: "bg-muted text-muted-foreground"
};

export const Projects = () => {
  const { projects } = portfolioConfig;
  
  return (
    <section id="projects" className="py-20 px-4 scroll-section">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="slide-in-up">
          <TerminalWindow title="projects.portfolio" className="backdrop-blur-md bg-background/95 border border-primary/20">
            <div className="space-y-12">
              <AnimatedSection delay={0.5}>
                <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Featured Projects
                </h2>
              </AnimatedSection>
              
              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project, index) => {
                  const StatusIcon = statusIcons[project.status as keyof typeof statusIcons];
                  const statusColor = statusColors[project.status as keyof typeof statusColors];
                  
                  return (
                    <AnimatedSection
                      key={project.name}
                      animation="slide-in-up"
                      delay={1 + index * 0.2}
                    >
                      <div className="glass-card p-6 rounded-xl hover-lift group h-full flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                              {project.name}
                            </h3>
                            {project.featured && (
                              <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30">
                                Featured
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Badge 
                              className={`text-xs ${statusColor} flex items-center space-x-1 border-0`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              <span className="capitalize">{project.status}</span>
                            </Badge>
                            <span className="text-foreground/60 text-sm">
                              {project.year}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-foreground/80 mb-6 leading-relaxed flex-grow">
                          {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag, tagIndex) => (
                            <AnimatedSection
                              key={tag}
                              animation="slide-in-right"
                              delay={1.5 + index * 0.2 + tagIndex * 0.1}
                            >
                              <Badge 
                                variant="outline" 
                                className="text-xs border-accent/30 hover:border-accent/60 hover:bg-accent/10 transition-all duration-300"
                              >
                                {tag}
                              </Badge>
                            </AnimatedSection>
                          ))}
                        </div>
                        
                        <div className="flex space-x-3 mt-auto">
                          {project.links.live && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="premium-button group relative overflow-hidden border-accent/40 hover:border-accent/80 bg-gradient-to-r from-background/80 to-background/60 hover:from-accent/10 hover:to-secondary/5 transition-all duration-500"
                              onClick={() => window.open(project.links.live, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                              <span className="relative z-10">Visit Now</span>
                            </Button>
                          )}
                          {portfolioConfig.features.showCodeButtons && project.links.github && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="premium-button group relative overflow-hidden border-accent/40 hover:border-accent/80 bg-gradient-to-r from-background/80 to-background/60 hover:from-accent/10 hover:to-secondary/5 transition-all duration-500"
                              onClick={() => window.open(project.links.github, '_blank')}
                            >
                              <Github className="w-4 h-4 mr-2 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                              <span className="relative z-10">Code</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          </TerminalWindow>
        </AnimatedSection>
      </div>
    </section>
  );
};