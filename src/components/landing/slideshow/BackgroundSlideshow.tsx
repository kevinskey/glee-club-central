
import React from "react";

interface BackgroundSlideshowProps {
  images: string[];
  duration?: number;
  transition?: number;
  overlayOpacity?: number;
}

export function BackgroundSlideshow({
  images,
  overlayOpacity = 0.5,
}: BackgroundSlideshowProps) {
  // Handle empty images array
  if (!images || images.length === 0) {
    return <div className="absolute inset-0 bg-black/50"></div>;
  }

  // Always show only the first image with improved display
  const displayImage = images[0];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={displayImage}
        alt="Background slide"
        className="w-full h-full object-cover"
        style={{ 
          objectPosition: 'center center',
          objectFit: 'cover'
        }}
      />
      
      {/* Using a consistent black overlay */}
      <div 
        className="absolute inset-0 bg-black" 
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
