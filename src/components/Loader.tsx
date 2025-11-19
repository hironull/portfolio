import { useEffect, useState } from 'react';

export const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-discord-darker">
      {/* Glowing Rings */}
      <div className="relative w-32 h-32">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-discord-blurple opacity-75 animate-[loader-spin_1.5s_linear_infinite]"></div>
        
        {/* Middle ring */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-r-discord-blurple opacity-60 animate-[loader-spin_1s_linear_infinite_reverse]"></div>
        
        {/* Inner ring */}
        <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-discord-blurple opacity-45 animate-[loader-spin_2s_linear_infinite]"></div>
        
        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-discord-blurple rounded-full animate-[loader-pulse_1.5s_ease-in-out_infinite] blur-md"></div>
        </div>
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-discord-blurple rounded-full"></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute mt-48 text-discord-text font-mono text-sm animate-pulse">
        Loading...
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 bg-discord-blurple opacity-10 blur-3xl rounded-full"></div>
      </div>
    </div>
  );
};
