
import React, { useEffect, useState } from 'react';
import { seedDefaultHeroImages } from '@/utils/siteImages';

// This component will run once to ensure we have hero images on first load
export const HeroImageInitializer: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    const initializeHeroImages = async () => {
      if (!initialized) {
        await seedDefaultHeroImages();
        setInitialized(true);
      }
    };
    
    initializeHeroImages();
  }, [initialized]);
  
  // This component doesn't render anything
  return null;
};
