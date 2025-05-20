
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/providers/ThemeProvider";

export function Logo() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  return (
    <Link to="/" className="flex items-center gap-3">
      {/* Light mode logo (shown in light mode, hidden in dark mode) */}
      <img 
        src="/lovable-uploads/8fa96710-a03a-4033-9ee0-032306d74daa.png" 
        alt="GleeWorld Logo - Light Mode" 
        className={`${isMobile ? "h-7" : "h-6"} w-auto block dark:hidden`}
      />
      
      {/* Dark mode logo (hidden in light mode, shown in dark mode) */}
      <img 
        src="/lovable-uploads/312fd1a4-7f46-4000-8711-320383aa565a.png" 
        alt="GleeWorld Logo - Dark Mode" 
        className={`${isMobile ? "h-7" : "h-6"} w-auto hidden dark:block`}
      />
      
      <span className={`font-semibold ${isMobile ? "text-xl" : "text-lg"}`}>
        GleeWorld
      </span>
    </Link>
  );
}
