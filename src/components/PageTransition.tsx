import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import loadingGif from "../assets/loading-animation.jpg";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Start transition
    setIsTransitioning(true);
    
    // End transition after animation
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* Transition Overlay */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
          isTransitioning 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(203,166,247,0.1) 50%, rgba(0,0,0,0.95) 100%)'
        }}
      >
        <div className="relative">
          {/* Terminal Window Container */}
          <div className="bg-background/95 border-2 border-accent/50 rounded-lg p-6 backdrop-blur-md shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-foreground/70 text-sm ml-2">Loading...</span>
            </div>
            
            {/* Loading Content */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={loadingGif} 
                  alt="Loading animation" 
                  className="w-12 h-12 pixel-art animate-pulse"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-full animate-spin"></div>
              </div>
              
              <div className="space-y-2">
                <div className="text-foreground font-mono">
                  <span className="text-accent">$</span> switching pages
                  <span className="animate-pulse">...</span>
                </div>
                
                {/* Animated Loading Bar */}
                <div className="w-48 h-1 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-accent to-secondary transition-all duration-700 ${
                      isTransitioning ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
                
                <div className="text-xs text-foreground/60 font-mono">
                  Preparing terminal environment...
                </div>
              </div>
            </div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/10 blur-xl rounded-lg -z-10"></div>
        </div>
        
        {/* Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-accent/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div 
        className={`transition-all duration-500 ${
          isTransitioning 
            ? 'opacity-0 scale-95 blur-sm' 
            : 'opacity-100 scale-100 blur-0'
        }`}
      >
        {children}
      </div>
    </>
  );
};