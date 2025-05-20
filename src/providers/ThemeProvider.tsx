
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Create context with a default value
const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("light");
  const [mounted, setMounted] = React.useState(false);

  // Effect for initial setup
  React.useEffect(() => {
    // Mark component as mounted
    setMounted(true);
    
    // Get theme from localStorage on initial render
    const savedTheme = localStorage.getItem("theme") as Theme;
    
    // Check if user has a saved preference or use system preference
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
    }
  }, []);

  // Effect for updating DOM
  React.useEffect(() => {
    // Only update DOM after component is mounted to prevent hydration mismatch
    if (!mounted) return;
    
    // Update data attribute on body when theme changes
    document.body.setAttribute("data-theme", theme);
    
    // Apply the appropriate class to documentElement (html)
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      // Set appropriate color for mobile status bar
      metaThemeColor.setAttribute(
        "content", 
        theme === "dark" ? "#121212" : "#FFFFFF"
      );
    } else {
      // Create meta theme-color if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = "theme-color";
      meta.content = theme === "dark" ? "#121212" : "#FFFFFF";
      document.head.appendChild(meta);
    }
    
    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Toggle theme function
  const toggleTheme = React.useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      
      // Show theme change notification
      toast.success(`Switched to ${newTheme} mode`, {
        duration: 2000,
        className: "theme-toggle-toast",
      });
      
      return newTheme;
    });
  }, []);

  const contextValue = React.useMemo(() => ({
    theme,
    setTheme,
    toggleTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
      <Toaster />
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
