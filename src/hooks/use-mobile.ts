
import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the standard breakpoint for md: in Tailwind
    };

    // Run once on initial render
    checkIsMobile();

    // Set up event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Clean up event listener
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}
