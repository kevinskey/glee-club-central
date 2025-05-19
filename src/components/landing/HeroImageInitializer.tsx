
import React, { useEffect, useState, useRef } from 'react';
import { seedDefaultHeroImages } from '@/utils/siteImages';
import { toast } from 'sonner';

// This component will run once to ensure we have hero images on first load
export const HeroImageInitializer: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const isMountedRef = useRef(true);
  const attemptedRef = useRef(false);
  
  useEffect(() => {
    // Track component mount state
    isMountedRef.current = true;
    
    const initializeHeroImages = async () => {
      // Only try once per component lifecycle
      if (initialized || isInitializing || attemptedRef.current) return;
      
      try {
        attemptedRef.current = true;
        setIsInitializing(true);
        
        const result = await seedDefaultHeroImages();
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setInitialized(true);
          setIsInitializing(false);
        }
      } catch (error) {
        console.error("Error initializing hero images:", error);
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setIsInitializing(false);
          // Don't show errors to users on the landing page
        }
      }
    };
    
    // Initialize with a slight delay to prevent race conditions
    const timeoutId = setTimeout(() => {
      if (isMountedRef.current) {
        initializeHeroImages();
      }
    }, 500);
    
    return () => {
      // Mark component as unmounted to prevent state updates
      isMountedRef.current = false;
      clearTimeout(timeoutId);
    };
  }, [initialized, isInitializing]);
  
  // This component doesn't render anything
  return null;
};
