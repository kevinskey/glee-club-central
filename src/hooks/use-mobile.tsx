
import { useState, useEffect } from 'react';

// Define the standard mobile breakpoint
const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  // Initialize with undefined and update in useEffect
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    // Create a media query for mobile devices
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Update function to set the state
    const updateMobileState = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Add event listener
    mql.addEventListener('change', updateMobileState);
    
    // Clean up
    return () => mql.removeEventListener('change', updateMobileState);
  }, []);

  return isMobile;
}

export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', updateMatches);
    return () => mediaQuery.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}
