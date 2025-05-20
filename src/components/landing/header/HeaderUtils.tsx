
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function HeaderUtils() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center gap-2">
      <GleeToolsDropdown />
      <ThemeToggle />
      
      {/* Show login button on desktop */}
      {!isMobile && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/login")}
          className="ml-2 text-base px-5 py-2 h-auto md:text-lg md:px-6 md:py-3"
        >
          Login
        </Button>
      )}
    </div>
  );
}
