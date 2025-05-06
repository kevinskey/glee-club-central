
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme, Theme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ThemeToggleProps {
  variant?: "switch" | "button" | "toggle";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ThemeToggle({ 
  variant = "button", 
  size = "sm", 
  className = "" 
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Size mapping
  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20,
  }[size];

  if (variant === "switch") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-2 ${className}`}>
              <Switch 
                checked={isDark} 
                onCheckedChange={toggleTheme} 
                aria-label="Toggle theme"
              />
              {isDark ? (
                <Moon size={iconSize} className="text-foreground" />
              ) : (
                <Sun size={iconSize} className="text-foreground" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle {isDark ? "light" : "dark"} mode</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === "toggle") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value as Theme)} className={className}>
              <ToggleGroupItem value="light" aria-label="Light mode">
                <Sun className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="dark" aria-label="Dark mode">
                <Moon className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle theme</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Default button variant
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className={className}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Moon className={`h-${size === "sm" ? "4" : size === "md" ? "5" : "6"} w-${size === "sm" ? "4" : size === "md" ? "5" : "6"}`} />
            ) : (
              <Sun className={`h-${size === "sm" ? "4" : size === "md" ? "5" : "6"} w-${size === "sm" ? "4" : size === "md" ? "5" : "6"}`} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle {isDark ? "light" : "dark"} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
