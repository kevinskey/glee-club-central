
import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 p-0"
      aria-label={theme === "light" ? "Enable dark mode" : "Enable light mode"}
    >
      {theme === "light" ? (
        <Sun className="h-4 w-4 text-royal-600 transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-powder-400 transition-all" />
      )}
      <span className="sr-only">{theme === "light" ? "Dark" : "Light"} mode</span>
    </Button>
  );
}
