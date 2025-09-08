import { useEffect, useRef, useState, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'slide-in-up' | 'slide-in-left' | 'slide-in-right' | 'fade-in';
  delay?: number;
  className?: string;
}

export const AnimatedSection = ({ 
  children, 
  animation = 'slide-in-up', 
  delay = 0, 
  className = '' 
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 100);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`
        ${className}
        ${isVisible ? animation : 'opacity-0'}
        transition-all duration-700 ease-out
      `}
    >
      {children}
    </div>
  );
};