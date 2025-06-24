
import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-10 w-10 bg-background hover:bg-accent hover:text-accent-foreground border border-border transition-all duration-200"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-foreground transition-all" />
      ) : (
        <Sun className="h-5 w-5 text-foreground transition-all" />
      )}
      <span className="sr-only">{theme === "light" ? "Dark" : "Light"} mode</span>
    </Button>
  );
}
