
import React, { useState, useEffect } from "react";

interface BackgroundSlideshowProps {
  images: string[];
  duration?: number;
  transition?: number;
}

export function BackgroundSlideshow({
  images,
  duration = 3000,
  transition = 1000,
}: BackgroundSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    const intervalId = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % images.length);
        setIsTransitioning(false);
      }, transition);
      
    }, duration + transition);

    return () => clearInterval(intervalId);
  }, [currentImageIndex, nextImageIndex, images, duration, transition]);

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
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${images[currentImageIndex]}')`,
          opacity: isTransitioning ? 0 : 1,
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${images[nextImageIndex]}')`,
          opacity: isTransitioning ? 1 : 0,
        }}
      />
    </div>
  );
}
