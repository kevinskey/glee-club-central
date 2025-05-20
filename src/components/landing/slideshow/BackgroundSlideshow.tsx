
import React from "react";

interface BackgroundSlideshowProps {
  images: string[];
  duration?: number;
  transition?: number;
  overlayOpacity?: number;
}

// Simplified slideshow that just displays a single image
export function BackgroundSlideshow({
  images,
  overlayOpacity = 0.5,
}: BackgroundSlideshowProps) {
  // Use the first image only
  const image = images && images.length > 0 ? images[0] : "";

  if (!image) {
    return <div className="absolute inset-0 bg-background/50"></div>;
  }

  return (
    <div className="absolute inset-0">
      {/* Single background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${image}')` }}
      />
      
      {/* Black overlay with configurable opacity */}
      <div 
        className="absolute inset-0 bg-black" 
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
