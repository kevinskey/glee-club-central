
import React from 'react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { MobileOptimizedSlider } from '@/components/ui/mobile-optimized-slider';

export function HeroSection() {
  const { slides, isLoading, hasError } = useHeroSlides();

  // Show loading state while fetching
  if (isLoading) {
    return (
      <div className="relative w-full h-[50vh] md:h-[60vh] min-h-[300px] md:min-h-[400px] max-h-[600px] bg-muted animate-pulse flex items-center justify-center">
        <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show default state if error or no slides
  if (hasError || slides.length === 0) {
    return (
      <div className="relative w-full h-[50vh] md:h-[60vh] min-h-[300px] md:min-h-[400px] max-h-[600px] bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
        <div className="text-center text-white p-4 max-w-xs md:max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            Spelman College Glee Club
          </h1>
          <p className="text-sm md:text-lg lg:text-xl opacity-90 drop-shadow-md">
            To Amaze and Inspire
          </p>
        </div>
      </div>
    );
  }

  // Transform hero slides data for MobileOptimizedSlider
  const optimizedSlides = slides.map((slide, index) => ({
    id: slide.id,
    src: slide.youtube_url || slide.background_image_url || '/placeholder-hero.jpg',
    srcSet: slide.background_image_url && !slide.youtube_url ? 
      `${slide.background_image_url}?w=600&h=338&fit=crop&crop=center 600w, ${slide.background_image_url}?w=1200&h=675&fit=crop&crop=center 1200w` : 
      undefined,
    alt: slide.title,
    title: slide.title,
    subtitle: slide.description,
    buttonText: slide.button_text,
    link: slide.button_link,
    textPosition: slide.text_position,
    textAlignment: slide.text_alignment,
    isVideo: slide.media_type === 'video' || !!slide.youtube_url,
    priority: index === 0,
    objectFit: slide.object_fit || 'cover'
  }));

  return (
    <div className="relative w-full">
      <MobileOptimizedSlider
        slides={optimizedSlides}
        aspectRatio="video"
        autoPlay={true}
        autoPlayInterval={5000}
        showControls={true}
        showIndicators={true}
        preloadAdjacent={true}
        defaultObjectFit="cover"
        className="h-[50vh] md:h-[60vh] min-h-[300px] md:min-h-[400px] max-h-[600px]"
      />
    </div>
  );
}
