
import React, { memo, useState, useEffect } from "react";
import { SlideshowProvider, useSlideshowContext } from "./SlideshowContext";
import { SlideshowImage } from "./SlideshowImage";

interface BackgroundSlideshowProps {
  images: string[];
  duration?: number;
  transition?: number;
  overlayOpacity?: number;
}

// Memoized content component to prevent unnecessary re-renders
const SlideshowContent = memo(({ 
  images, 
  transition, 
  overlayOpacity 
}: { 
  images: string[]; 
  transition: number;
  overlayOpacity: number;
}) => {
  const { currentIndex, nextIndex, isTransitioning } = useSlideshowContext();
  
  // Use the first image if available
  const currentImage = images[currentIndex] || images[0];
  
  // Use a different image for next if available, otherwise use the first image
  const nextImage = images[nextIndex] || (images.length > 1 ? images[1] : images[0]);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Current Image */}
      <SlideshowImage 
        src={currentImage} 
        isActive={!isTransitioning}
        transitionDuration={transition}
      />
      
      {/* Next Image */}
      <SlideshowImage 
        src={nextImage} 
        isActive={isTransitioning}
        transitionDuration={transition}
      />

      {/* Black overlay with configurable opacity */}
      <div 
        className="absolute inset-0 bg-black" 
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
});

SlideshowContent.displayName = 'SlideshowContent';

// Memoized single image component
const SingleImageBackground = memo(({ image, overlayOpacity }: { image: string; overlayOpacity: number }) => {
  return (
    <div className="absolute inset-0">
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
});

SingleImageBackground.displayName = 'SingleImageBackground';

export function BackgroundSlideshow({
  images,
  duration = 10000,
  transition = 2000,
  overlayOpacity = 0.5,
}: BackgroundSlideshowProps) {
  const [validImages, setValidImages] = useState<string[]>([]);
  
  // Filter out any invalid images
  useEffect(() => {
    if (images && images.length > 0) {
      setValidImages(images.filter(img => img));
    }
  }, [images]);
  
  // Handle empty image array
  if (!validImages || validImages.length === 0) {
    return <div className="absolute inset-0 bg-background/50"></div>;
  }
  
  // For single image (no transitions needed)
  if (validImages.length === 1) {
    return <SingleImageBackground image={validImages[0]} overlayOpacity={overlayOpacity} />;
  }

  return (
    <SlideshowProvider 
      images={validImages}
      duration={duration}
      transition={transition}
      initialLoadComplete={true}
    >
      <SlideshowContent 
        images={validImages} 
        transition={transition} 
        overlayOpacity={overlayOpacity} 
      />
    </SlideshowProvider>
  );
}
