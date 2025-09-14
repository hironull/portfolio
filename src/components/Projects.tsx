import { TerminalWindow } from "./TerminalWindow";
import { AnimatedSection } from "./AnimatedSection";
import { Badge } from "./ui/badge";
import { ExternalLink, Github, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";
import { portfolioConfig } from "../config/portfolio.config";

const statusIcons = {
  production: Star,
  development: Clock,
  archived: Clock,
  "coming soon": Clock
};

const statusColors = {
  production: "bg-primary text-primary-foreground",
  development: "bg-yellow-500 text-black", 
  archived: "bg-muted text-muted-foreground",
  "coming soon": "bg-blue-500 text-white"
};

export const Projects = () => {
  const { projects } = portfolioConfig;
  
  return (
    <section id="projects" className="py-20 px-4 scroll-section">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="slide-in-up">
          <TerminalWindow title="projects.portfolio" className="backdrop-blur-md bg-background/95 border border-primary/20 shadow-2xl">
            <div className="space-y-12">
              <AnimatedSection delay={0.5}>
                <div className="text-center space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
                    Featured Projects
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto rounded-full" />
                  <p className="text-foreground/70 text-lg">
                    A showcase of my best work and contributions
                  </p>
                </div>
              </AnimatedSection>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                {projects.map((project, index) => {
                  const StatusIcon = statusIcons[project.status as keyof typeof statusIcons];
                  const statusColor = statusColors[project.status as keyof typeof statusColors];
                  
                  return (
                    <AnimatedSection
                      key={project.name}
                      animation="slide-in-up"
                      delay={1 + index * 0.2}
                    >
                      <div className="project-card group relative h-full flex flex-col overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-md transition-all duration-500 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2">
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Content */}
                        <div className="relative z-10 p-4 sm:p-6 lg:p-8 flex flex-col h-full">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
                            <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300 break-words">
                                {project.name}
                              </h3>
                              {project.featured && (
                                <div className="relative">
                                  <Badge className="bg-gradient-to-r from-accent/20 to-secondary/20 text-accent border-accent/30 animate-pulse text-xs">
                                    ⭐ Featured
                                  </Badge>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                              <Badge 
                                className={`${statusColor} flex items-center space-x-1 border-0 shadow-lg text-xs shrink-0`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                <span className="capitalize font-medium">{project.status}</span>
                              </Badge>
                              <div className="text-foreground/60 text-xs sm:text-sm font-medium bg-muted/20 px-2 py-1 rounded-full shrink-0">
                                {project.year}
                              </div>
                            </div>
                          </div>
                          
                          {/* Description */}
                          <p className="text-foreground/85 mb-6 sm:mb-8 leading-relaxed flex-grow text-sm sm:text-base lg:text-lg">
                            {project.description}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                            {project.tags.map((tag, tagIndex) => (
                              <AnimatedSection
                                key={tag}
                                animation="fade-in"
                                delay={1.5 + index * 0.2 + tagIndex * 0.1}
                              >
                                <Badge 
                                  variant="outline" 
                                  className="text-xs sm:text-sm border-accent/30 hover:border-accent hover:bg-accent/20 hover:text-foreground transition-all duration-300 cursor-default backdrop-blur-sm"
                                >
                                  {tag}
                                </Badge>
                              </AnimatedSection>
                            ))}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto">
                            {project.links.live && (
                              <Button 
                                variant="outline" 
                                size="default"
                                className="project-button group/btn relative overflow-hidden border-accent/50 bg-background/50 hover:border-accent hover:bg-accent/20 hover:text-foreground transition-all duration-500 backdrop-blur-sm flex-1 text-sm"
                                onClick={() => window.open(project.links.live, '_blank')}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                                <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-all duration-300 relative z-10" />
                                <span className="relative z-10 font-medium">Visit Live</span>
                              </Button>
                            )}
                            {portfolioConfig.features.showCodeButtons && project.links.github && (
                              <Button 
                                variant="outline" 
                                size="default"
                                className="project-button group/btn relative overflow-hidden border-accent/50 bg-background/50 hover:border-accent hover:bg-accent/20 hover:text-foreground transition-all duration-500 backdrop-blur-sm flex-1 text-sm"
                                onClick={() => window.open(project.links.github, '_blank')}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                                <Github className="w-4 h-4 mr-2 group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-all duration-300 relative z-10" />
                                <span className="relative z-10 font-medium">View Code</span>
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-bl from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full" />
                        <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-tr from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-full" />
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