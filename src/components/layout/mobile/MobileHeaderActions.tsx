
import React from "react";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MobileHeaderActionsProps {
  onMenuClick: () => void;
}

export function MobileHeaderActions({ onMenuClick }: MobileHeaderActionsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <GleeToolsDropdown />
      <ThemeToggle />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="flex-shrink-0 h-10 w-10"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6 text-foreground" />
        <span className="sr-only">Menu</span>
      </Button>
    </div>
  );
}
