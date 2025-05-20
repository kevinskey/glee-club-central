
import React, { useEffect, useRef } from 'react';
import { seedDefaultHeroImages } from '@/utils/siteImages';

interface HeroImageInitializerProps {
  onInitialized?: () => void;
}

// This component will run once to ensure we have hero images on first load
export const HeroImageInitializer: React.FC<HeroImageInitializerProps> = ({ onInitialized }) => {
  const initialized = useRef(false);
  
  useEffect(() => {
    // Only run once
    if (initialized.current) {
      return;
    }
    
    initialized.current = true;
    
    // Check if already initialized to avoid multiple initializations
    const alreadyInitialized = localStorage.getItem('heroImagesInitialized') === 'true';
    
    if (alreadyInitialized) {
      // Call the callback if provided
      if (onInitialized) {
        onInitialized();
      }
      return;
    }
    
    // Initialize hero images
    const initializeHeroImages = async () => {
      try {
        // Add the default hero images
        await seedDefaultHeroImages([
          "/lovable-uploads/c69d3562-4bdc-4e42-9415-aefdd5f573e8.png",
          "/lovable-uploads/65c0e4fd-f960-4e32-a3cd-dc46f81be743.png",
          "/lovable-uploads/1536a1d1-51f6-4121-8f53-423d37672f2e.png",
          "/lovable-uploads/daf81087-d822-4f6c-9859-43580f9a3971.png",
          "/lovable-uploads/a1d9a510-4276-40df-bfb5-86a441d06e4f.png"
        ]);
        
        localStorage.setItem('heroImagesInitialized', 'true');
        
        // Call the callback if provided
        if (onInitialized) {
          onInitialized();
        }
      } catch (error) {
        console.error("Error initializing hero images:", error);
        
        // Call the callback anyway to prevent blocking the UI
        if (onInitialized) {
          onInitialized();
        }
      }
    };
    
    // Initialize immediately
    initializeHeroImages();
  }, [onInitialized]);
  
  // This component doesn't render anything
  return null;
};
