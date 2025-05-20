
import { useState, useEffect } from 'react';

// Define the standard mobile breakpoint
const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  // Initialize with server-safe default
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    // Skip for SSR
    if (typeof window === 'undefined') return;
    
    // Create a media query for mobile devices
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Update function to set the state
    const updateMobileState = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Add event listener
    mql.addEventListener('change', updateMobileState);
    
    // Initialize state
    updateMobileState();
    
    // Clean up
    return () => mql.removeEventListener('change', updateMobileState);
  }, []);

  return isMobile;
}

export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(() => 
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', updateMatches);
    updateMatches(); // Initialize
    
    return () => mediaQuery.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}

// Additional responsive breakpoint hooks for more granular control
export function useIsSmallMobile(): boolean {
  return useMedia('(max-width: 479px)');
}

export function useIsTablet(): boolean {
  return useMedia('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsDesktop(): boolean {
  return useMedia('(min-width: 1024px)');
}

// Landscape vs portrait orientation
export function useIsLandscape(): boolean {
  return useMedia('(orientation: landscape)');
}

export function useIsPortrait(): boolean {
  return useMedia('(orientation: portrait)');
}
