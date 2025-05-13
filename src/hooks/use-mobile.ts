
import { useState, useEffect } from "react";

// Custom hook to check if the device is mobile based on a media query
export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    // Add listener to update state on change
    const handler = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}

// Convenience hook specifically for mobile detection
export function useIsMobile(): boolean {
  return useMedia("(max-width: 640px)");
}
