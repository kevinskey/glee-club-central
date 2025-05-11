
import React, { useState, useEffect } from "react";

interface BackgroundSlideshowProps {
  images: string[];
  duration?: number;
  transition?: number;
}

export function BackgroundSlideshow({
  images,
  duration = 10000, // 10 seconds between transitions
  transition = 2000, // 2 seconds for the transition effect
}: BackgroundSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Don't set up transitions if we don't have enough images
    if (images.length <= 1) return;

    // Calculate the next image index
    const calculateNextIndex = (current: number) => (current + 1) % images.length;

    // Function to handle image transition
    const handleTransition = () => {
      setIsTransitioning(true);
      
      // After transition completes, update the current image
      const transitionTimer = setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex(calculateNextIndex(nextImageIndex));
        setIsTransitioning(false);
      }, transition);
      
      return () => clearTimeout(transitionTimer);
    };

    // Set up interval for consistent timing
    const intervalId = setInterval(handleTransition, duration);
    
    // Initial setup for nextImageIndex
    setNextImageIndex(calculateNextIndex(currentImageIndex));

    // Cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, [images.length, duration, transition, currentImageIndex, nextImageIndex]);

  // If no images provided, don't render anything
  if (!images || images.length === 0) return null;
  
  // Special case for single image (no transitions needed)
  if (images.length === 1) {
    return (
      <div 
        className="absolute inset-0 bg-center"
        style={{ 
          backgroundImage: `url('${images[0]}')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />
    );
  }

  // For multiple images, set up the transition between current and next
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Current Image */}
      <div
        className="absolute inset-0 bg-center transition-opacity"
        style={{
          backgroundImage: `url('${images[currentImageIndex]}')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: isTransitioning ? 0 : 1,
          transitionDuration: `${transition}ms`,
        }}
      />
      {/* Next Image */}
      <div
        className="absolute inset-0 bg-center transition-opacity"
        style={{
          backgroundImage: `url('${images[nextImageIndex]}')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: isTransitioning ? 1 : 0,
          transitionDuration: `${transition}ms`,
        }}
      />
    </div>
  );
}
