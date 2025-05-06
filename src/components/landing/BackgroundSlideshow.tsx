
import React, { useState, useEffect } from "react";

interface BackgroundSlideshowProps {
  images: string[];
  duration?: number;
  transition?: number;
}

export function BackgroundSlideshow({
  images,
  duration = 7000,
  transition = 1500,
}: BackgroundSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    // Set up the main interval for changing images
    const intervalId = setInterval(() => {
      // Start transition
      setIsTransitioning(true);
      
      // After transition completes, update the indices
      const transitionTimerId = setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setNextImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, transition);
      
      return () => clearTimeout(transitionTimerId);
    }, duration);

    // Initialize next image index on mount
    setNextImageIndex((currentImageIndex + 1) % images.length);

    return () => clearInterval(intervalId);
  }, [images, duration, transition, currentImageIndex]);

  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${images[0]}')` }}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1500"
        style={{
          backgroundImage: `url('${images[currentImageIndex]}')`,
          opacity: isTransitioning ? 0 : 1,
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1500"
        style={{
          backgroundImage: `url('${images[nextImageIndex]}')`,
          opacity: isTransitioning ? 1 : 0,
        }}
      />
    </div>
  );
}
