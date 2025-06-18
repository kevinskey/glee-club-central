
import React from 'react';
import { useHeroData } from './hero/useHeroData';
import { HeroLoading } from './hero/HeroLoading';
import { HeroDefault } from './hero/HeroDefault';
import { HeroSlideContent } from './hero/HeroSlideContent';

export function DynamicHero() {
  const { slides, mediaFiles, currentIndex, isLoading } = useHeroData();

  console.log('DynamicHero: isLoading =', isLoading);
  console.log('DynamicHero: slides =', slides);
  console.log('DynamicHero: mediaFiles =', mediaFiles);

  if (isLoading) {
    console.log('DynamicHero: Showing loading state');
    return <HeroLoading />;
  }

  // If no slides configured, show default hero
  if (slides.length === 0) {
    console.log('DynamicHero: No slides found, showing default hero');
    return <HeroDefault />;
  }

  const currentSlide = slides[currentIndex];
  console.log('DynamicHero: Showing slide content for slide:', currentSlide?.title);

  return (
    <HeroSlideContent 
      slide={currentSlide} 
      mediaFiles={mediaFiles} 
    />
  );
}
