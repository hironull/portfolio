interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <div className="transition-all duration-300">
      {children}
    </div>
  );
};