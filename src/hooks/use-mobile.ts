
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}

export function useIsSmallMobile(breakpoint: number = 480) {
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const checkIsSmallMobile = () => {
      setIsSmallMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkIsSmallMobile();

    // Add event listener
    window.addEventListener('resize', checkIsSmallMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsSmallMobile);
  }, [breakpoint]);

  return isSmallMobile;
}

export function useMedia(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
