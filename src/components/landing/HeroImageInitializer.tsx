
import React, { useEffect, useState, useRef } from 'react';
import { seedDefaultHeroImages } from '@/utils/siteImages';
import { toast } from "sonner";

interface HeroImageInitializerProps {
  onInitialized?: () => void;
}

// This component will run once to ensure we have hero images on first load
export const HeroImageInitializer: React.FC<HeroImageInitializerProps> = ({ onInitialized }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    // Track component mount state
    isMountedRef.current = true;
    
    // Check if already initialized to avoid multiple initializations
    const alreadyInitialized = localStorage.getItem('heroImagesInitialized') === 'true';
    if (alreadyInitialized) {
      if (isMountedRef.current) {
        setIsInitialized(true);
        setIsLoading(false);
        
        // Call the callback if provided
        if (onInitialized) {
          onInitialized();
        }
      }
      return;
    }
    
    // Initialize hero images
    const initializeHeroImages = async () => {
      try {
        setIsLoading(true);
        
        // Add the default hero images
        await seedDefaultHeroImages([
          "/lovable-uploads/c69d3562-4bdc-4e42-9415-aefdd5f573e8.png",
          "/lovable-uploads/65c0e4fd-f960-4e32-a3cd-dc46f81be743.png",
          "/lovable-uploads/1536a1d1-51f6-4121-8f53-423d37672f2e.png",
          "/lovable-uploads/daf81087-d822-4f6c-9859-43580f9a3971.png",
          "/lovable-uploads/a1d9a510-4276-40df-bfb5-86a441d06e4f.png"
        ]);
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setIsInitialized(true);
          setIsLoading(false);
          localStorage.setItem('heroImagesInitialized', 'true');
          
          // Call the callback if provided
          if (onInitialized) {
            onInitialized();
          }
        }
      } catch (error) {
        console.error("Error initializing hero images:", error);
        if (isMountedRef.current) {
          setIsLoading(false);
          toast.error("Could not load hero images", { 
            description: "Please refresh the page to try again" 
          });
        }
      }
    };
    
    // Initialize with a slight delay to prevent race conditions
    const timeoutId = setTimeout(() => {
      if (isMountedRef.current) {
        initializeHeroImages();
      }
    }, 100); // Reduced from 300ms to 100ms for faster loading
    
    return () => {
      // Mark component as unmounted to prevent state updates
      isMountedRef.current = false;
      clearTimeout(timeoutId);
    };
  }, [onInitialized]);
  
  // This component doesn't render anything
  return null;
};
