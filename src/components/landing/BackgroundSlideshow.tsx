
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
  overlayOpacity = 0.5, // Changed from 0.7 to 0.5 for lighter overlay
}: BackgroundSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Track image loading status
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    // Initialize image loading status array
    setImagesLoaded(Array(images.length).fill(false));
    
    // Preload images
    images.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImagesLoaded(prev => {
          const newStatus = [...prev];
          newStatus[index] = true;
          return newStatus;
        });
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
      };
    });
  }, [images]);
  
  // Reset component when images change
  useEffect(() => {
    // Clear any existing timers
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    
    // Reset state with the first image
    setCurrentIndex(0);
    setNextIndex(images && images.length > 1 ? 1 : 0);
    setIsTransitioning(false);
    
    // Don't set up transitions if we don't have enough images
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
  }, [images, duration, transition]);

  // Show loading state if no images are available
  if (!images || images.length === 0) {
    return (
      <div className="absolute inset-0 bg-background flex items-center justify-center">
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
