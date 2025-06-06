
import React, { useState, useEffect } from 'react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { HeroLoadingState } from './hero/HeroLoadingState';
import { HeroDefaultState } from './hero/HeroDefaultState';
import { HeroSlide } from './hero/HeroSlide';

export function HeroSection() {
  const { slides, isLoading, hasError } = useHeroSlides();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 1 && isReady) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length, isReady]);

  // Mark as ready when slides are loaded and we have data
  useEffect(() => {
    if (!isLoading && slides.length > 0) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, slides.length]);

  // Show loading state while fetching
  if (isLoading) {
    return <HeroLoadingState />;
  }

  // Show default state if error or no slides
  if (hasError || slides.length === 0 || !isReady) {
    return <HeroDefaultState />;
  }

  const slide = slides[currentSlide];
  return <HeroSlide slide={slide} />;
}
