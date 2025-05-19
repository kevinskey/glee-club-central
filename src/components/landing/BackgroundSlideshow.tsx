
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [allImagesPreloaded, setAllImagesPreloaded] = useState(false);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  // Reset state when image array changes
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    // Initialize the loaded state array with false for each image
    setImagesLoaded(new Array(images.length).fill(false));
    setAllImagesPreloaded(false);
    
    return () => {
      // Clean up any timers when unmounting
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [images]);

  // Preload all images immediately
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    const newImagesLoaded = [...imagesLoaded];
    let loadedCount = 0;
    
    // Preload each image
    images.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        if (!isMountedRef.current) return;
        
        newImagesLoaded[index] = true;
        loadedCount++;
        
        // Update state only when all images are loaded or after a timeout
        if (loadedCount === images.length) {
          setImagesLoaded(newImagesLoaded);
          setAllImagesPreloaded(true);
        }
      };
      
      img.onerror = () => {
        if (!isMountedRef.current) return;
        
        console.error(`Failed to load image: ${src}`);
        newImagesLoaded[index] = true;
        loadedCount++;
        
        // Update state only when all image attempts are complete
        if (loadedCount === images.length) {
          setImagesLoaded(newImagesLoaded);
          setAllImagesPreloaded(true);
        }
      };
    });
    
    // Set a timeout to proceed even if not all images have loaded
    const timeoutId = setTimeout(() => {
      if (!isMountedRef.current) return;
      if (!allImagesPreloaded) {
        console.log("Proceeding with slideshow despite not all images loaded");
        setAllImagesPreloaded(true);
      }
    }, 3000); // Wait max 3 seconds before proceeding anyway
    
    return () => {
      clearTimeout(timeoutId);
      isMountedRef.current = false;
    };
  }, [images, imagesLoaded, allImagesPreloaded]);
  
  // Set up slideshow transition
  useEffect(() => {
    // Don't start transitions until at least the first image is available
    if (!allImagesPreloaded || !images || images.length === 0) return;
    
    // Clean up any existing timers
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    
    // Special case: if we have only one image, don't set up transitions
    if (images.length <= 1) return;

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
  }, [allImagesPreloaded, images, duration, transition, nextIndex]);

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
