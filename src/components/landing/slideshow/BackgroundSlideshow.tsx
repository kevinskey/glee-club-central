
import React, { useState, useEffect } from "react";

interface BackgroundSlideshowProps {
  images: string[];
  duration?: number;
  transition?: number;
  overlayOpacity?: number;
}

export function BackgroundSlideshow({
  images,
  duration = 7000, // 7 seconds per slide
  transition = 1500, // 1.5 second transition
  overlayOpacity = 0.5,
}: BackgroundSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayedImageIndex, setDisplayedImageIndex] = useState(0);

  // Handle empty images array
  if (!images || images.length === 0) {
    return <div className="absolute inset-0 bg-background/50"></div>;
  }

  // For single image, just display it without animation
  if (images.length === 1) {
    return (
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${images[0]}')` }}
        />
        <div 
          className="absolute inset-0 bg-black" 
          style={{ opacity: overlayOpacity }}
        />
      </div>
    );
  }

  // For multiple images, set up the slideshow
  useEffect(() => {
    // Set a timer to change images
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, duration);

    // Clean up timer on unmount
    return () => clearInterval(interval);
  }, [images.length, duration]);

  // Update the displayed image with a delay to allow for transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedImageIndex(currentImageIndex);
    }, transition);

    return () => clearTimeout(timer);
  }, [currentImageIndex, transition]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Map through all images but only show the current and next ones */}
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity"
          style={{
            backgroundImage: `url('${image}')`,
            opacity: index === displayedImageIndex ? 1 : 0,
            transitionProperty: 'opacity',
            transitionDuration: `${transition}ms`,
            transitionTimingFunction: 'ease',
          }}
        />
      ))}
      
      {/* Overlay with configurable opacity */}
      <div 
        className="absolute inset-0 bg-black" 
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
