
import React, { useEffect, useState } from 'react';
import { seedDefaultHeroImages } from '@/utils/siteImages';

// This component will run once to ensure we have hero images on first load
export const HeroImageInitializer: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const initializeHeroImages = async () => {
      if (!initialized) {
        try {
          await seedDefaultHeroImages();
          if (isMounted) {
            setInitialized(true);
          }
        } catch (error) {
          console.error("Error initializing hero images:", error);
        }
      }
    };
    
    initializeHeroImages();
    
    return () => {
      isMounted = false;
    };
  }, [initialized]);
  
  // This component doesn't render anything
  return null;
};
