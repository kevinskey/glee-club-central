
import React, { useState, useEffect, useRef } from "react";

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
  // Initialize with first image already showing
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  // Preload images and track loading status
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    const newLoadedImages: Record<string, boolean> = {};
    let loadedCount = 0;
    const totalImages = images.length;
    
    // Mark component as mounted
    isMountedRef.current = true;
    
    // Function to mark image as loaded
    const markImageLoaded = (src: string) => {
      if (!isMountedRef.current) return;
      
      newLoadedImages[src] = true;
      loadedCount++;
      
      if (loadedCount >= Math.min(2, totalImages)) {
        // Once at least first two images are loaded (or all if less than 2), start slideshow
        setLoadedImages(prev => ({ ...prev, ...newLoadedImages }));
        setInitialLoadComplete(true);
      }
      
      if (loadedCount === totalImages) {
        // All images loaded
        setLoadedImages(prev => ({ ...prev, ...newLoadedImages }));
      }
    };
    
    // Preload all images
    images.forEach((src) => {
      // Skip if already loaded
      if (loadedImages[src]) {
        loadedCount++;
        newLoadedImages[src] = true;
        return;
      }
      
      const img = new Image();
      img.src = src;
      
      img.onload = () => markImageLoaded(src);
      
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        markImageLoaded(src);
      };
    });
    
    // Safety timeout to start slideshow even if not all images load
    const safetyTimer = setTimeout(() => {
      if (!isMountedRef.current) return;
      if (!initialLoadComplete && loadedCount > 0) {
        setInitialLoadComplete(true);
        setLoadedImages(prev => ({ ...prev, ...newLoadedImages }));
      }
    }, 2000);
    
    return () => {
      isMountedRef.current = false;
      clearTimeout(safetyTimer);
    };
  }, [images]);
  
  // Set up slideshow with proper timing
  useEffect(() => {
    // Don't start the slideshow until initial load is complete
    if (!initialLoadComplete || !images || images.length <= 1) return;
    
    // Clean up any existing timers
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    
    // Function to handle transitions
    const handleTransition = () => {
      setIsTransitioning(true);
      
      // After transition completes, update to next image
      timerRef.current = window.setTimeout(() => {
        if (!isMountedRef.current) return;
        
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
  }, [initialLoadComplete, images, duration, transition, nextIndex]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);
  
  // Handle empty image array
  if (!images || images.length === 0) {
    return (
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>
    );
  }
  
  // For single image (no transitions needed)
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

  // If images aren't loaded yet, show placeholder
  if (!initialLoadComplete) {
    return (
      <div className="absolute inset-0 bg-background/80"></div>
    );
  }

  // For multiple images with transitions
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
