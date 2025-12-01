import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div 
      className={`transition-all duration-400 ease-in-out ${
        isTransitioning 
          ? 'opacity-0 scale-[0.98] translate-y-2' 
          : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      {children}
    </div>
  );
};