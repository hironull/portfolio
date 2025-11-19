import { useState } from "react";
import { portfolioConfig } from "../config/portfolio.config";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Github, Mail, Globe, ExternalLink, Music, Calendar } from "lucide-react";
import { Loader } from "./Loader";
import pixelAvatar from "../assets/pixel-avatar.png";
import heroBackground from "../assets/hero-background.jpg";

export const DiscordProfile = () => {
  const { personal, social, skills, projects } = portfolioConfig;
  const [statusText] = useState("Available for work");

  return (
    <>
      <Loader />
      <div className="min-h-screen bg-discord-dark text-discord-text fade-in">
        {/* Banner */}
        <div className="relative h-[300px] overflow-hidden group">
          <img 
            src={personal.bannerUrl || heroBackground}
            alt="Profile banner"
            className="w-full h-full object-cover blur-sm scale-105 transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-discord-dark/20 to-discord-dark"></div>
          <div className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10 pb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Avatar & Main Info */}
            <div className="flex-shrink-0">
              {/* Avatar */}
              <div className="relative parallax-float">
                <div className="absolute -inset-1 bg-discord-blurple/30 rounded-full blur-lg animate-pulse"></div>
                <img 
                  src={personal.avatarUrl || pixelAvatar}
                  alt={personal.name}
                  className="relative w-32 h-32 rounded-full border-8 border-discord-dark bg-discord-darker pixel-art glow-hover transition-transform duration-500"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-discord-green rounded-full border-4 border-discord-dark animate-pulse"></div>
              </div>
            </div>

            {/* Right Column - Profile Details */}
            <div className="flex-1 space-y-4">
              {/* Username & Badges */}
              <div className="bg-discord-card rounded-2xl p-6 space-y-4 glow-hover slide-in-up stagger-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold">{personal.name}</h1>
                    <Badge variant="secondary" className="bg-discord-blurple/20 text-discord-blurple border-0 text-xs">
                      He/Him
                    </Badge>
                  </div>
                  <p className="text-discord-muted text-sm">{personal.email}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="border-discord-blurple/50 text-discord-blurple bg-discord-blurple/10 glow-hover transition-all duration-300">
                      {personal.title}
                    </Badge>
                    <Badge variant="outline" className="border-accent/50 text-accent bg-accent/10 glow-hover transition-all duration-300">
                      Full Stack
                    </Badge>
                    <Badge variant="outline" className="border-discord-green/50 text-discord-green bg-discord-green/10 glow-hover transition-all duration-300">
                      React Expert
                    </Badge>
                  </div>
                </div>

                <Button 
                  className="w-full bg-discord-hover hover:bg-discord-hover/80 text-foreground border-0 glow-hover transition-all duration-500"
                  size="lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>

              {/* Listening to Spotify */}
              <Card className="bg-discord-card border-0 p-4 glow-hover slide-in-up stagger-2">
                <div className="flex items-center gap-3 mb-3">
                  <Music className="w-4 h-4 text-discord-muted" />
                  <span className="text-xs font-semibold text-discord-muted uppercase">
                    Currently Working On
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-discord-hover flex items-center justify-center">
                    <Music className="w-8 h-8 text-discord-blurple" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Full Stack Development</p>
                    <p className="text-xs text-discord-muted">Building modern web applications</p>
                  </div>
                </div>
              </Card>

              {/* Member Since */}
              <Card className="bg-discord-card border-0 p-4 glow-hover slide-in-up stagger-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-discord-muted" />
                  <div>
                    <span className="text-xs font-semibold text-discord-muted uppercase block">
                      Developer Since
                    </span>
                    <p className="text-sm">January 2020</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* About Me Section */}
          <div className="mt-6 space-y-4">
            <Card className="bg-discord-card border-0 p-6 glow-hover slide-in-up stagger-4">
              <h3 className="text-xs font-semibold text-discord-muted uppercase mb-3">
                About Me
              </h3>
              <p className="text-sm text-discord-text leading-relaxed">
                {personal.tagline}
              </p>
            </Card>

            {/* Skills Section */}
            <Card className="bg-discord-card border-0 p-6 glow-hover slide-in-up stagger-5">
              <h3 className="text-xs font-semibold text-discord-muted uppercase mb-4">
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge 
                    key={skill.name}
                    variant="secondary"
                    className="bg-discord-hover hover:bg-discord-blurple/30 text-discord-text border-discord-blurple/20 glow-hover transition-all duration-300"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Projects Section */}
            <Card className="bg-discord-card border-0 p-6 glow-hover slide-in-up stagger-6">
              <h3 className="text-xs font-semibold text-discord-muted uppercase mb-4">
                Featured Projects
              </h3>
              <div className="space-y-3">
                {projects.map((project) => (
                  <a
                    key={project.name}
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-discord-hover rounded-lg p-4 hover:bg-discord-hover/80 glow-hover transition-all duration-500 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-sm group-hover:text-discord-blurple transition-colors">
                            {project.name}
                          </h4>
                          {project.links.github && (
                            <ExternalLink className="w-4 h-4 text-discord-muted group-hover:text-discord-blurple transition-colors" />
                          )}
                        </div>
                        <p className="text-xs text-discord-muted leading-relaxed">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {project.tags.map((tag) => (
                            <Badge 
                              key={tag}
                              variant="secondary"
                              className="bg-discord-dark/50 text-discord-muted border-0 text-xs px-2 py-0.5"
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

            {/* Connections Section */}
            <Card className="bg-discord-card border-0 p-6 glow-hover slide-in-up stagger-7">
              <h3 className="text-xs font-semibold text-discord-muted uppercase mb-4">
                Connections
              </h3>
              <div className="space-y-3">
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-discord-hover rounded-lg p-3 hover:bg-discord-blurple/20 glow-hover transition-all duration-500 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-discord-dark/50 flex items-center justify-center group-hover:bg-discord-blurple/30 transition-all">
                    <Github className="w-5 h-5 group-hover:text-discord-blurple transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold group-hover:text-discord-blurple transition-colors">GitHub</p>
                    <p className="text-xs text-discord-muted">@{social.github.split('/').pop()}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-discord-muted group-hover:text-discord-blurple transition-colors" />
                </a>

                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-discord-hover rounded-lg p-3 hover:bg-discord-blurple/20 glow-hover transition-all duration-500 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-discord-dark/50 flex items-center justify-center group-hover:bg-discord-blurple/30 transition-all">
                    <Globe className="w-5 h-5 group-hover:text-discord-blurple transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold group-hover:text-discord-blurple transition-colors">LinkedIn</p>
                    <p className="text-xs text-discord-muted">Professional Network</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-discord-muted group-hover:text-discord-blurple transition-colors" />
                </a>
              </div>
            </Card>

            {/* Status Note */}
            <Card className="bg-discord-card border-0 p-4 slide-in-up stagger-8">
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
    </>
  );
};
