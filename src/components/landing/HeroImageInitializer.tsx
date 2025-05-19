
import React, { useEffect, useState, useRef } from 'react';
import { seedDefaultHeroImages } from '@/utils/siteImages';
import { toast } from 'sonner';

// This component will run once to ensure we have hero images on first load
export const HeroImageInitializer: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    // Track component mount state
    isMountedRef.current = true;
    
    // Check localStorage to prevent multiple initializations
    const heroImagesInitialized = localStorage.getItem('heroImagesInitialized');
    
    if (heroImagesInitialized === 'true') {
      setIsInitialized(true);
      return;
    }
    
    const initializeHeroImages = async () => {
      try {
        await seedDefaultHeroImages();
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setIsInitialized(true);
          localStorage.setItem('heroImagesInitialized', 'true');
        }
      } catch (error) {
        console.error("Error initializing hero images:", error);
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          // Silent failure, no user-facing errors
        }
      }
    };
    
    // Initialize with a slight delay to prevent race conditions
    const timeoutId = setTimeout(() => {
      if (isMountedRef.current && !isInitialized) {
        initializeHeroImages();
      }
    }, 500);
    
    return () => {
      // Mark component as unmounted to prevent state updates
      isMountedRef.current = false;
      clearTimeout(timeoutId);
    };
  }, [isInitialized]);
  
  // This component doesn't render anything
  return null;
};
