
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

  // Always show only the first image with no cropping
  const displayImage = images[0];

  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
      <img
        src={displayImage}
        alt="Background slide"
        className="w-full h-full object-contain"
        style={{ 
          objectPosition: 'center center',
          objectFit: 'contain'
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
