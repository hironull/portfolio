import { portfolioConfig } from "../config/portfolio.config";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Github, Mail, Globe, ExternalLink, Calendar, Code2 } from "lucide-react";
import { Loader } from "./Loader";
import pixelAvatar from "../assets/pixel-avatar.png";

export const DiscordProfile = () => {
  const { personal, social, skills, projects } = portfolioConfig;

  return (
    <>
      <Loader />
      <div className="min-h-screen bg-black text-white fade-in">
        {/* Minimal Banner with Glass Effect */}
        <div className="relative h-[280px] overflow-hidden">
          {personal.bannerUrl && (
            <>
              <img 
                src={personal.bannerUrl}
                alt="Profile banner"
                className="w-full h-full object-cover opacity-20 blur-sm scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black"></div>
            </>
          )}
          {!personal.bannerUrl && (
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 -mt-24 relative z-10 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Avatar & Quick Info */}
            <div className="flex-shrink-0 lg:w-72">
              {/* Avatar */}
              <div className="relative mb-8">
                <div className="absolute -inset-2 bg-white/10 rounded-full blur-xl"></div>
                <img 
                  src={personal.avatarUrl || pixelAvatar}
                  alt={personal.name}
                  className="relative w-40 h-40 rounded-full border-4 border-white/20 bg-black shadow-2xl transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full border-4 border-black shadow-lg"></div>
              </div>

              {/* Quick Contact */}
              <Button 
                className="w-full glass-card glass-hover text-white border-white/20 mb-6 py-6 text-base font-light tracking-wide"
                size="lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Message
              </Button>

              {/* Member Since */}
              <Card className="glass-card border-white/10 p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-white/60" />
                  <span className="text-xs font-light text-white/50 uppercase tracking-wider">
                    Developer Since
                  </span>
                </div>
                <p className="text-base font-light">January 2020</p>
              </Card>

              {/* Current Focus */}
              <Card className="glass-card border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Code2 className="w-5 h-5 text-white/60" />
                  <span className="text-xs font-light text-white/50 uppercase tracking-wider">
                    Currently Building
                  </span>
                </div>
                <p className="font-light text-sm text-white/80">Full Stack Web Applications</p>
              </Card>
            </div>

            {/* Right Column - Main Content */}
            <div className="flex-1 space-y-8">
              {/* Name & Title */}
              <div className="glass-card border-white/10 p-8 slide-in-up stagger-1">
                <h1 className="text-4xl font-light mb-3 tracking-tight">{personal.name}</h1>
                <p className="text-white/60 text-lg font-light mb-4">{personal.email}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className="glass border-white/20 text-white font-light px-4 py-1.5">
                    {personal.title}
                  </Badge>
                  <Badge variant="outline" className="glass border-white/20 text-white font-light px-4 py-1.5">
                    Full Stack Developer
                  </Badge>
                  <Badge variant="outline" className="glass border-white/20 text-white font-light px-4 py-1.5">
                    React Expert
                  </Badge>
                </div>
              </div>

              {/* About Me */}
              <Card className="glass-card border-white/10 p-8 slide-in-up stagger-2">
                <h3 className="text-xs font-light text-white/50 uppercase tracking-widest mb-4">
                  About Me
                </h3>
                <p className="text-base font-light leading-relaxed text-white/80">
                  {personal.tagline}
                </p>
              </Card>

              {/* Skills */}
              <Card className="glass-card border-white/10 p-8 slide-in-up stagger-3">
                <h3 className="text-xs font-light text-white/50 uppercase tracking-widest mb-6">
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <Badge 
                      key={skill.name}
                      variant="secondary"
                      className="glass glass-hover border-white/10 text-white font-light px-4 py-2 text-sm"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Featured Projects */}
              <Card className="glass-card border-white/10 p-8 slide-in-up stagger-4">
                <h3 className="text-xs font-light text-white/50 uppercase tracking-widest mb-6">
                  Featured Projects
                </h3>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <a
                      key={project.name}
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block glass-card border-white/10 p-6 glass-hover group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-light text-lg group-hover:text-white/90 transition-colors">
                              {project.name}
                            </h4>
                            {project.links.github && (
                              <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                            )}
                          </div>
                          <p className="text-sm font-light leading-relaxed text-white/60 mb-4">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <Badge 
                                key={tag}
                                variant="secondary"
                                className="bg-white/5 text-white/50 border-0 text-xs px-3 py-1 font-light"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </Card>

              {/* Connections */}
              <Card className="glass-card border-white/10 p-8 slide-in-up stagger-5">
                <h3 className="text-xs font-light text-white/50 uppercase tracking-widest mb-6">
                  Connect With Me
                </h3>
                <div className="space-y-4">
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 glass-card border-white/10 p-5 glass-hover group"
                  >
                    <div className="w-12 h-12 rounded-xl glass flex items-center justify-center group-hover:bg-white/10 transition-all">
                      <Github className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-light">GitHub</p>
                      <p className="text-sm text-white/50 font-light">@{social.github.split('/').pop()}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                  </a>

                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 glass-card border-white/10 p-5 glass-hover group"
                  >
                    <div className="w-12 h-12 rounded-xl glass flex items-center justify-center group-hover:bg-white/10 transition-all">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-light">LinkedIn</p>
                      <p className="text-sm text-white/50 font-light">Professional Network</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                  </a>
                </div>
              </Card>

              {/* Status */}
              <Card className="glass-card border-white/10 p-6 slide-in-up stagger-6">
                <p className="text-sm font-light text-white/60 italic text-center">
                  Available for work and collaboration
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
