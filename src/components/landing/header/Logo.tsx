
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function Logo() {
  const isMobile = useIsMobile();
  
  return (
    <Link to="/" className="flex items-center gap-3">
      {/* Light mode logo (shown in light mode, hidden in dark mode) */}
      <img 
        src="/logo-black.png" 
        alt="GleeWorld Logo - Light Mode" 
        className={`${isMobile ? "h-7" : "h-6"} w-auto block dark:hidden`}
      />
      
      {/* Dark mode logo (hidden in light mode, shown in dark mode) */}
      <img 
        src="/logo-white.png" 
        alt="GleeWorld Logo - Dark Mode" 
        className={`${isMobile ? "h-7" : "h-6"} w-auto hidden dark:block`}
      />
      
      <span className={`font-semibold ${isMobile ? "text-xl" : "text-lg"}`}>
        GleeWorld
      </span>
    </Link>
  );
}
