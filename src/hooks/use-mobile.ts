
import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Enhanced detection for iPad and mobile devices
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      
      // Consider iPad as mobile for layout purposes if in portrait mode
      const isIPad = /iPad/.test(userAgent) || 
        (navigator.maxTouchPoints > 1 && /Macintosh/.test(userAgent));
      
      // Mobile if width < 768 OR iPad in portrait mode
      const shouldBeMobile = width < 768 || (isIPad && width <= 1024);
      
      setIsMobile(shouldBeMobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Also check on orientation change for iPad
    window.addEventListener('orientationchange', () => {
      setTimeout(checkScreenSize, 100); // Small delay for orientation change
    });

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('orientationchange', checkScreenSize);
    };
  }, []);

  return isMobile;
}

// Export useIsSmallMobile for components that need it
export function useIsSmallMobile() {
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallMobile(window.innerWidth < 480);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isSmallMobile;
}

// Export useMedia hook for sidebar compatibility
export function useMedia(query: string, defaultValue?: boolean) {
  const [matches, setMatches] = useState(defaultValue ?? false);

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
