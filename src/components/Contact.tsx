import { TerminalWindow } from "./TerminalWindow";
import { AnimatedSection } from "./AnimatedSection";
import { Mail, Github, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { portfolioConfig } from "../config/portfolio.config";

export const Contact = () => {
  const { content, social, personal } = portfolioConfig;
  
  return (
    <section id="contact" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection animation="slide-in-up">
          <TerminalWindow title="Contact">
            <div className="space-y-8 text-center">
              <AnimatedSection delay={2}>
                <h2 className="text-2xl font-bold mb-6 font-code">
                  {content.contact.title}
                </h2>
              </AnimatedSection>
              
              <div className="space-y-6">
                <AnimatedSection animation="slide-in-up" delay={3}>
                  <p className="text-foreground leading-relaxed max-w-2xl mx-auto">
                    {content.contact.description}
                  </p>
                </AnimatedSection>
                
                <AnimatedSection animation="slide-in-up" delay={4}>
                  <div className="flex items-center justify-center space-x-2 text-primary font-mono relative skill-progress glow-pulse">
                    <Mail className="w-5 h-5" />
                    <span>{personal.email}</span>
                  </div>
                </AnimatedSection>
                
                <AnimatedSection animation="slide-in-up" delay={5}>
                  <p className="text-muted-foreground">
                    or connect via social media above
                  </p>
                </AnimatedSection>
                
                <AnimatedSection animation="slide-in-up" delay={6}>
                  <div className="flex justify-center space-x-4 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="terminal-hover font-mono stagger-1 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      onClick={() => window.open(social.email, '_blank')}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="terminal-hover font-mono stagger-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      onClick={() => window.open(social.github, '_blank')}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="terminal-hover font-mono stagger-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      onClick={(event) => {
                        navigator.clipboard.writeText('hironull');
                        // Create a temporary tooltip or alert
                        const button = event.currentTarget as HTMLButtonElement;
                        const originalText = button.textContent;
                        button.textContent = 'Username copied!';
                        setTimeout(() => {
                          button.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.681L3 21l2.681-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path></svg>Discord';
                        }, 2000);
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Discord
                    </Button>
                  </div>
                </AnimatedSection>
              </div>
              
              <AnimatedSection animation="slide-in-up" delay={7}>
                <div className="pt-8 text-muted-foreground font-mono text-sm">
                  <p>$ {content.contact.cta}</p>
                  <div className="cursor inline-block w-2 h-4 bg-primary ml-1 animate-pulse">_</div>
                </div>
              </AnimatedSection>
            </div>
          </TerminalWindow>
        </AnimatedSection>
      </div>
    </section>
  );
};