
import React from 'react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { HeroLoadingState } from './hero/HeroLoadingState';
import { HeroDefaultState } from './hero/HeroDefaultState';
import { OptimizedSlider } from '@/components/ui/optimized-slider';

export function HeroSection() {
  const { slides, isLoading, hasError } = useHeroSlides();

  // Show loading state while fetching
  if (isLoading) {
    return <HeroLoadingState />;
  }

  // Show default state if error or no slides
  if (hasError || slides.length === 0) {
    return <HeroDefaultState />;
  }

  // Transform slides data for OptimizedSlider
  const optimizedSlides = slides.map(slide => ({
    id: slide.id,
    src: slide.background_image_url || '/placeholder-hero.jpg',
    srcSet: slide.background_image_url ? 
      `${slide.background_image_url}?w=600&h=338&fit=crop&crop=center 600w, ${slide.background_image_url}?w=1200&h=675&fit=crop&crop=center 1200w` : 
      undefined,
    alt: slide.title,
    title: slide.title,
    subtitle: slide.description,
    link: slide.link_url,
    priority: true // First slide gets priority loading
  }));

  return (
    <div className="relative w-full">
      <OptimizedSlider
        slides={optimizedSlides}
        aspectRatio="video"
        autoPlay={true}
        autoPlayInterval={5000}
        showControls={true}
        showIndicators={true}
        preloadAdjacent={true}
        className="h-[60vh] min-h-[400px] max-h-[600px]"
      />
    </div>
  );
}
