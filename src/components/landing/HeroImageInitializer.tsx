
import React, { useEffect, useState } from 'react';
import { seedDefaultHeroImages } from '@/utils/siteImages';
import { toast } from 'sonner';

// This component will run once to ensure we have hero images on first load
export const HeroImageInitializer: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Use a ref to track component mount state
    let isMounted = true;
    
    const initializeHeroImages = async () => {
      if (initialized || isInitializing) return; // Prevent duplicate initialization
      
      try {
        setIsInitializing(true);
        const result = await seedDefaultHeroImages();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setInitialized(true);
          setIsInitializing(false);
          
          if (!result) {
            // Silent failure - don't show errors to users on the landing page
            console.error("Error initializing hero images");
          }
        }
      } catch (error) {
        console.error("Error initializing hero images:", error);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };
    
    // Only run initialization if not already initialized
    if (!initialized && !isInitializing) {
      initializeHeroImages();
    }
    
    return () => {
      // Mark component as unmounted to prevent state updates
      isMounted = false;
    };
  }, [initialized, isInitializing]);
  
  // This component doesn't render anything
  return null;
};
