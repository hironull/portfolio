import { DiscordProfile } from "../components/DiscordProfile";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Smooth page entrance animation
    setIsLoaded(true);
    
    // Log visitor
    const logVisitor = async () => {
      try {
        await supabase.functions.invoke('log-visitor');
      } catch (error) {
        console.error('Error logging visitor:', error);
      }
    };
    
    logVisitor();
  }, []);
  
  return (
    <div className={`min-h-screen bg-discord-dark relative transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <DiscordProfile />
    </div>
  );
};

export default Index;
