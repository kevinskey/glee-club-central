
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full transition-colors hover:bg-accent/10 h-8 w-8"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Sun className="h-4 w-4 text-glee-purple" />
      ) : (
        <Moon className="h-4 w-4 text-glee-purple" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
