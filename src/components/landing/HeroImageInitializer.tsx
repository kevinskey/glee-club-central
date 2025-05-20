
import React, { useEffect, useState } from 'react';
import { seedDefaultHeroImages } from '@/utils/siteImages';
import { toast } from 'sonner';

interface HeroImageInitializerProps {
  onInitialized?: () => void;
}

export const HeroImageInitializer: React.FC<HeroImageInitializerProps> = ({ onInitialized }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  
  useEffect(() => {
    async function initializeHeroImages() {
      if (isInitializing) return;
      
      setIsInitializing(true);
      try {
        const result = await seedDefaultHeroImages();
        
        if (result.success) {
          console.log("Hero images initialized successfully");
          if (onInitialized) {
            onInitialized();
          }
        } else {
          console.error("Failed to initialize hero images:", result.error);
          toast.error("Could not load hero images");
        }
      } catch (error) {
        console.error("Error initializing hero images:", error);
      } finally {
        setIsInitializing(false);
      }
    }
    
    initializeHeroImages();
  }, [onInitialized, isInitializing]);
  
  // This component doesn't render anything visible
  return null;
};
