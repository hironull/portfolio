import { useEffect, useState } from "react";

export const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 animate-[loader-spin_2s_linear_infinite]">
          <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-white border-r-white/40 shadow-[0_0_40px_rgba(255,255,255,0.3)]"></div>
        </div>
        
        {/* Inner pulsing ring */}
        <div className="absolute inset-0 animate-[loader-pulse_2s_ease-in-out_infinite]">
          <div className="w-24 h-24 rounded-full border-2 border-white/20"></div>
        </div>
        
        {/* Center glow */}
        <div className="w-24 h-24 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-white animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.8)]"></div>
        </div>
      </div>
    </div>
  );
};
