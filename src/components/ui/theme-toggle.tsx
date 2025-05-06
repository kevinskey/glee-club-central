
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Determine icon and text based on current theme
  const Icon = theme === "light" ? Sun : Moon;
  const tooltipText = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
  const ariaLabel = theme === "light" ? "Enable dark mode" : "Enable light mode";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full transition-colors hover:bg-accent/10 h-8 w-8"
            aria-label={ariaLabel}
          >
            <Icon className="h-4 w-4 text-glee-purple" />
            <span className="sr-only">{ariaLabel}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
