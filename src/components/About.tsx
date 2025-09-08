import { TerminalWindow } from "./TerminalWindow";
import { AnimatedSection } from "./AnimatedSection";
import { portfolioConfig } from "../config/portfolio.config";

export const About = () => {
  const { content } = portfolioConfig;
  
  return (
    <section id="about" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection animation="slide-in-up">
          <TerminalWindow title="About">
            <div className="space-y-6">
              <AnimatedSection delay={2}>
                <h2 className="text-2xl font-bold mb-6 text-center font-code">
                  {content.about.title}
                </h2>
              </AnimatedSection>
              
              <div className="space-y-4 text-foreground">
                {content.about.paragraphs.map((paragraph, index) => (
                  <AnimatedSection 
                    key={index}
                    animation="slide-in-left"
                    delay={3 + index}
                  >
                    <p className="leading-relaxed">{paragraph}</p>
                  </AnimatedSection>
                ))}
              </div>
              
              <AnimatedSection animation="slide-in-up" delay={5}>
                <div className="mt-8 p-4 bg-secondary rounded-md terminal-hover">
                  <p className="text-secondary-foreground text-center font-mono relative skill-progress">
                    {content.about.availability}
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </TerminalWindow>
        </AnimatedSection>
      </div>
    </section>
  );
};