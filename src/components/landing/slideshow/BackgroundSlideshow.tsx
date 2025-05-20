
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
  const { initialLoadComplete, isLoading } = useImagePreloader({ 
    images,
    minImagesToLoad: 1,
    timeout: 1000
  });

  // Set the rendered images once we have valid data
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

  // If images aren't loaded yet, show placeholder with smooth transition
  if (!initialLoadComplete || isLoading) {
    return (
      <div className="absolute inset-0 bg-background/80 transition-opacity duration-500 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <SlideshowProvider 
      images={renderedImages}
      duration={duration}
      transition={transition}
      initialLoadComplete={initialLoadComplete}
    >
      <SlideshowContent 
        images={renderedImages} 
        transition={transition} 
        overlayOpacity={overlayOpacity} 
      />
    </SlideshowProvider>
  );
}
