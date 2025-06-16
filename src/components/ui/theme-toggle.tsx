
import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="default"
      onClick={toggleTheme}
      className="h-10 px-4 text-sm font-medium"
      aria-label={theme === "light" ? "Enable dark mode" : "Enable light mode"}
    >
      {theme === "light" ? (
        <>
          <Sun className="h-4 w-4 mr-2 text-royal-600 transition-all" />
          <span className="text-black dark:text-white">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 mr-2 text-powder-400 transition-all" />
          <span className="text-black dark:text-white">Dark</span>
        </>
      )}
      <span className="sr-only">{theme === "light" ? "Dark" : "Light"} mode</span>
    </Button>
  );
}
