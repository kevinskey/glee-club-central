
import { useState, useEffect } from 'react';

export function useIsPad() {
  const [isPad, setIsPad] = useState<boolean>(false);

  useEffect(() => {
    const checkIfPad = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIPad = /ipad/.test(userAgent) || 
                     (/macintosh/.test(userAgent) && 'ontouchend' in document);
      
      const isTabletSize = window.innerWidth >= 768 && window.innerWidth <= 1366;
      
      setIsPad(isIPad || isTabletSize);
    };

    checkIfPad();
    window.addEventListener('resize', checkIfPad);
    
    return () => window.removeEventListener('resize', checkIfPad);
  }, []);

  return isPad;
}

export function useTabletOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerWidth > window.innerHeight) {
        setOrientation('landscape');
      } else {
        setOrientation('portrait');
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return orientation;
}
