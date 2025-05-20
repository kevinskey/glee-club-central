
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function Logo() {
  const isMobile = useIsMobile();
  
  return (
    <Link to="/" className="flex items-center gap-3">
      <img 
        src="/lovable-uploads/8fa96710-a03a-4033-9ee0-032306d74daa.png" 
        alt="GleeWorld Logo" 
        className={`${isMobile ? "h-7" : "h-6"} w-auto`} 
      />
      <span className={`font-semibold ${isMobile ? "text-xl" : "text-lg"}`}>
        GleeWorld
      </span>
    </Link>
  );
}
