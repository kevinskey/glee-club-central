
import React, { memo, useState, useEffect } from "react";
import { useImagePreloader } from "@/hooks/useImagePreloader";
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
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Current Image */}
      <SlideshowImage 
        src={images[currentIndex]} 
        isActive={!isTransitioning}
        transitionDuration={transition}
      />
      
      {/* Next Image */}
      <SlideshowImage 
        src={images[nextIndex]} 
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
  duration = 10000, // 10 seconds between transitions
  transition = 2000, // 2 seconds for the transition effect
  overlayOpacity = 0.5,
}: BackgroundSlideshowProps) {
  const [renderedImages, setRenderedImages] = useState<string[]>([]);
  
  // Simplified image preloading
  useEffect(() => {
    if (images && images.length > 0 && images[0]) {
      setRenderedImages(images);
    }
  }, [images]);

  // Handle empty image array
  if (!renderedImages || renderedImages.length === 0) {
    return <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>;
  }
  
  // For single image (no transitions needed)
  if (renderedImages.length === 1) {
    return <SingleImageBackground image={renderedImages[0]} overlayOpacity={overlayOpacity} />;
  }

  return (
    <SlideshowProvider 
      images={renderedImages}
      duration={duration}
      transition={transition}
      initialLoadComplete={true} // Always consider initial load complete to avoid flashing
    >
      <SlideshowContent 
        images={renderedImages} 
        transition={transition} 
        overlayOpacity={overlayOpacity} 
      />
    </SlideshowProvider>
  );
}
