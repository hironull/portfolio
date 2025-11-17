import { useState } from "react";
import { portfolioConfig } from "../config/portfolio.config";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Github, Mail, Globe, ExternalLink, Music, Calendar, CheckCircle } from "lucide-react";
import pixelAvatar from "../assets/pixel-avatar.png";
import heroBackground from "../assets/hero-background.jpg";

export const DiscordProfile = () => {
  const { personal, social, skills, projects } = portfolioConfig;
  const [statusText] = useState("Available for work");

  return (
    <div className="min-h-screen bg-discord-dark text-discord-text">
      {/* Banner */}
      <div className="relative h-[300px] overflow-hidden">
        <img 
          src={personal.bannerUrl || heroBackground}
          alt="Profile banner"
          className="w-full h-full object-cover blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-discord-dark/20 to-discord-dark"></div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10 pb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Avatar & Main Info */}
          <div className="flex-shrink-0">
            {/* Avatar */}
            <div className="relative">
              <div className="absolute -inset-1 bg-discord-blurple/20 rounded-full blur-md"></div>
              <img 
                src={personal.avatarUrl || pixelAvatar}
                alt={personal.name}
                className="relative w-32 h-32 rounded-full border-8 border-discord-dark bg-discord-darker pixel-art"
              />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-discord-green rounded-full border-4 border-discord-dark"></div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="flex-1 space-y-4">
            {/* Username & Badges */}
            <div className="bg-discord-card rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-bold">{personal.name}</h1>
                  <Badge variant="secondary" className="bg-discord-blurple/20 text-discord-blurple border-0 text-xs">
                    He/Him
                  </Badge>
                </div>
                <p className="text-discord-muted text-sm">{personal.email}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="border-discord-blurple/50 text-discord-blurple bg-discord-blurple/10">
                    {personal.title}
                  </Badge>
                  <Badge variant="outline" className="border-accent/50 text-accent bg-accent/10">
                    Full Stack
                  </Badge>
                  <Badge variant="outline" className="border-discord-green/50 text-discord-green bg-discord-green/10">
                    React Expert
                  </Badge>
                </div>
              </div>

              <Button 
                className="w-full bg-discord-hover hover:bg-discord-hover/80 text-foreground border-0"
                size="lg"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>

            {/* Listening to Spotify */}
            <Card className="bg-discord-card border-0 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Music className="w-4 h-4 text-discord-muted" />
                <span className="text-xs font-semibold text-discord-muted uppercase">
                  Currently Working On
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-discord-hover flex items-center justify-center">
                  <Globe className="w-8 h-8 text-discord-blurple" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {projects[0].name}
                  </p>
                  <p className="text-sm text-discord-muted truncate">
                    {projects[0].description.substring(0, 60)}...
                  </p>
                </div>
              </div>
            </Card>

            {/* About Me */}
            <Card className="bg-discord-card border-0 p-4">
              <h3 className="text-xs font-semibold text-discord-muted uppercase mb-3">
                About Me
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                {personal.tagline}
              </p>
              <div className="mt-4 pt-4 border-t border-discord-hover">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-discord-muted" />
                  <span className="text-discord-muted">Member Since</span>
                  <span className="text-foreground font-medium">2020</span>
                </div>
              </div>
            </Card>

            {/* Skills as Note */}
            <Card className="bg-discord-card border-0 p-4">
              <h3 className="text-xs font-semibold text-discord-muted uppercase mb-3">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 8).map((skill) => (
                  <Badge 
                    key={skill.name}
                    variant="secondary"
                    className="bg-discord-hover text-foreground border-0"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Connections */}
            <Card className="bg-discord-card border-0 p-4">
              <h3 className="text-xs font-semibold text-discord-muted uppercase mb-3">
                Connections
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between group hover:bg-discord-hover rounded-lg p-2 -mx-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-discord-hover flex items-center justify-center group-hover:bg-discord-dark transition-colors">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">GitHub</span>
                        <CheckCircle className="w-4 h-4 text-discord-blurple" />
                      </div>
                      <p className="text-xs text-discord-muted">@hironull</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-discord-dark"
                    onClick={() => window.open(social.github, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between group hover:bg-discord-hover rounded-lg p-2 -mx-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-discord-hover flex items-center justify-center group-hover:bg-discord-dark transition-colors">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">Website</span>
                        <CheckCircle className="w-4 h-4 text-discord-green" />
                      </div>
                      <p className="text-xs text-discord-muted">hironull.lol</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-discord-dark"
                    onClick={() => window.open('https://hironull.lol', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between group hover:bg-discord-hover rounded-lg p-2 -mx-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-discord-hover flex items-center justify-center group-hover:bg-discord-dark transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">Email</span>
                        <CheckCircle className="w-4 h-4 text-accent" />
                      </div>
                      <p className="text-xs text-discord-muted">{personal.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-discord-dark"
                    onClick={() => {
                      navigator.clipboard.writeText(personal.email);
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Projects as Friends */}
            <Card className="bg-discord-card border-0 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-discord-muted uppercase">
                  Featured Projects
                </h3>
                <span className="text-xs text-discord-muted">{projects.filter(p => p.featured).length}</span>
              </div>
              <div className="space-y-2">
                {projects.filter(p => p.featured).map((project) => (
                  <div 
                    key={project.name}
                    className="flex items-center justify-between group hover:bg-discord-hover rounded-lg p-2 -mx-2 transition-colors cursor-pointer"
                    onClick={() => window.open(project.links.live, '_blank')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-discord-blurple to-accent flex items-center justify-center text-white font-bold">
                        {project.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{project.name}</span>
                          {project.status === "production" && (
                            <div className="w-2 h-2 bg-discord-green rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-discord-muted">{project.year}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-discord-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Status Note */}
            <Card className="bg-discord-card border-0 p-4">
              <h3 className="text-xs font-semibold text-discord-muted uppercase mb-2">
                Note (visible to you)
              </h3>
              <p className="text-sm text-discord-muted italic">
                {statusText}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
