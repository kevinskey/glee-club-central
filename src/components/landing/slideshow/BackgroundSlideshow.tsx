
import React, { memo } from "react";
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

export function BackgroundSlideshow({
  images,
  duration = 10000, // 10 seconds between transitions
  transition = 2000, // 2 seconds for the transition effect
  overlayOpacity = 0.5,
}: BackgroundSlideshowProps) {
  const { initialLoadComplete, isLoading } = useImagePreloader({ 
    images,
    minImagesToLoad: 2,
    timeout: 1500
  });

  // Handle empty image array
  if (!images || images.length === 0) {
    return <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>;
  }
  
  // For single image (no transitions needed)
  if (images.length === 1) {
    return <SingleImageBackground image={images[0]} overlayOpacity={overlayOpacity} />;
  }

  // If images aren't loaded yet, show placeholder with smooth transition
  if (!initialLoadComplete || isLoading) {
    return <div className="absolute inset-0 bg-background/80 transition-opacity duration-500"></div>;
  }

  return (
    <SlideshowProvider 
      images={images}
      duration={duration}
      transition={transition}
      initialLoadComplete={initialLoadComplete}
    >
      <SlideshowContent 
        images={images} 
        transition={transition} 
        overlayOpacity={overlayOpacity} 
      />
    </SlideshowProvider>
  );
}
