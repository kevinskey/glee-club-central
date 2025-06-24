
import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface FloatingThemeToggleProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}

export function FloatingThemeToggle({ 
  position = "top-right", 
  className = "" 
}: FloatingThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const positionClasses = {
    "top-right": "fixed top-4 right-4 z-50",
    "top-left": "fixed top-4 left-4 z-50",
    "bottom-right": "fixed bottom-4 right-4 z-50",
    "bottom-left": "fixed bottom-4 left-4 z-50"
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className={`${positionClasses[position]} shadow-lg bg-background border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 ${className}`}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-foreground transition-all" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-foreground transition-all" />
      )}
      <span className="sr-only">{theme === "light" ? "Dark" : "Light"} mode</span>
    </Button>
  );
}
