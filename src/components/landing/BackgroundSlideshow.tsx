
import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";

interface BackgroundSlideshowProps {
  images: string[];
  duration?: number;
  transition?: number;
  overlayOpacity?: number;
}

export function BackgroundSlideshow({
  images,
  duration = 10000, // 10 seconds between transitions
  transition = 2000, // 2 seconds for the transition effect
  overlayOpacity = 0.5,
}: BackgroundSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Initial load state setup
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    // Initialize the loaded state array with false for each image
    setImagesLoaded(new Array(images.length).fill(false));
    
    // Reset loaded state when image array changes
    return () => {
      setAllImagesLoaded(false);
    };
  }, [images]);

  // Preload all images
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    const newImagesLoaded = [...imagesLoaded];
    
    // Preload each image
    images.forEach((src, index) => {
      if (newImagesLoaded[index]) return; // Skip already loaded images
      
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        newImagesLoaded[index] = true;
        setImagesLoaded(newImagesLoaded);
        
        // Check if all images are loaded
        if (newImagesLoaded.every(loaded => loaded)) {
          setAllImagesLoaded(true);
        }
      };
      
      img.onerror = () => {
        // Mark as loaded even on error to prevent endless loading state
        console.error(`Failed to load image: ${src}`);
        newImagesLoaded[index] = true;
        setImagesLoaded(newImagesLoaded);
        
        // Check if all image attempts are complete
        if (newImagesLoaded.every(loaded => loaded)) {
          setAllImagesLoaded(true);
        }
      };
    });
  }, [images, imagesLoaded]);
  
  // Set up slideshow transition when images are loaded
  useEffect(() => {
    // Don't start transitions until images are loaded
    if (!allImagesLoaded) return;
    
    // Clear any existing timers
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    
    // Special case: if we have only one image, don't set up transitions
    if (!images || images.length <= 1) return;

    // Function to handle transitions
    const handleTransition = () => {
      setIsTransitioning(true);
      
      // After transition completes, update to next image
      timerRef.current = window.setTimeout(() => {
        const newCurrentIndex = nextIndex;
        const newNextIndex = (nextIndex + 1) % images.length;
        
        setCurrentIndex(newCurrentIndex);
        setNextIndex(newNextIndex);
        setIsTransitioning(false);
      }, transition);
    };

    // Set up interval for consistent timing between transitions
    intervalRef.current = window.setInterval(handleTransition, duration);
    
    return () => {
      // Clean up timers
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [allImagesLoaded, images, duration, transition, nextIndex]);

  // Show loading state if no images are available
  if (!images || images.length === 0) {
    return (
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Show loading indicator if images aren't loaded yet
  if (!allImagesLoaded) {
    return (
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Special case for single image (no transitions needed)
  if (images.length === 1) {
    return (
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('${images[0]}')`,
          }}
        />
        {/* Black overlay with configurable opacity */}
        <div 
          className="absolute inset-0 bg-black" 
          style={{ opacity: overlayOpacity }}
        />
      </div>
    );
  }

  // For multiple images, set up the transition between images
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Current Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity"
        style={{
          backgroundImage: `url('${images[currentIndex]}')`,
          opacity: isTransitioning ? 0 : 1,
          transitionProperty: 'opacity',
          transitionDuration: `${transition}ms`,
          transitionTimingFunction: 'ease',
        }}
      />
      
      {/* Next Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity"
        style={{
          backgroundImage: `url('${images[nextIndex]}')`,
          opacity: isTransitioning ? 1 : 0,
          transitionProperty: 'opacity',
          transitionDuration: `${transition}ms`,
          transitionTimingFunction: 'ease',
        }}
      />

      {/* Black overlay with configurable opacity */}
      <div 
        className="absolute inset-0 bg-black" 
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
