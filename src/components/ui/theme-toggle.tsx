
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
      className="h-10 w-10"
      aria-label={theme === "light" ? "Enable dark mode" : "Enable light mode"}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-navy-700 dark:text-white" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400 dark:text-white" />
      )}
      <span className="sr-only">{theme === "light" ? "Dark" : "Light"} mode</span>
    </Button>
  );
}
