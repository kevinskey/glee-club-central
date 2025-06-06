
import React, { useState, useEffect } from 'react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { HeroLoadingState } from './hero/HeroLoadingState';
import { HeroDefaultState } from './hero/HeroDefaultState';
import { HeroSlide } from './hero/HeroSlide';

export function HeroSection() {
  const { slides, isLoading, hasError } = useHeroSlides();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  if (isLoading) {
    return <HeroLoadingState />;
  }

  if (hasError || slides.length === 0) {
    return <HeroDefaultState />;
  }

  const slide = slides[currentSlide];
  return <HeroSlide slide={slide} />;
}
