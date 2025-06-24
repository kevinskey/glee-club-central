
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light'); // Default to light mode
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only check localStorage after component mounts to avoid hydration issues
    const stored = localStorage.getItem('theme') as Theme;
    if (stored && (stored === 'light' || stored === 'dark')) {
      setTheme(stored);
    } else {
      // Check system preference only if no stored preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem('theme', theme);
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Ensure consistent background colors
    document.body.className = theme === 'dark' 
      ? 'dark bg-background text-foreground' 
      : 'bg-background text-foreground';

    // Update theme-color meta tag for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (metaTheme) {
      metaTheme.content = theme === 'dark' ? '#0f172a' : '#ffffff';
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
