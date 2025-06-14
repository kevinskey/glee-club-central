
import React from 'react';
import { useHeroData } from './hero/useHeroData';
import { HeroLoading } from './hero/HeroLoading';
import { HeroDefault } from './hero/HeroDefault';
import { HeroSlideContent } from './hero/HeroSlideContent';

export function DynamicHero() {
  const { slides, mediaFiles, currentIndex, isLoading } = useHeroData();

  if (isLoading) {
    return <HeroLoading />;
  }

  // If no slides configured, show default hero
  if (slides.length === 0) {
    return <HeroDefault />;
  }

  const currentSlide = slides[currentIndex];

  return (
    <HeroSlideContent 
      slide={currentSlide} 
      mediaFiles={mediaFiles} 
    />
  );
}
