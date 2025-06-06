import React, { useState, useEffect } from 'react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { HeroLoadingState } from './hero/HeroLoadingState';
import { HeroDefaultState } from './hero/HeroDefaultState';
import { HeroSlide } from './hero/HeroSlide';
import { SlideControls } from './hero/SlideControls';

export function HeroSection() {
  const { slides, isLoading, hasError } = useHeroSlides();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(5000);
  const [transition, setTransition] = useState('fade');
  const [autoPlay, setAutoPlay] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 1 && isReady && isPlaying && autoPlay) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, speed);
      return () => clearInterval(timer);
    }
  }, [slides.length, isReady, isPlaying, autoPlay, speed]);

  // Mark as ready when slides are loaded and we have data
  useEffect(() => {
    if (!isLoading && slides.length > 0) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, slides.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!showControls) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'r':
          e.preventDefault();
          handleReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showControls, slides.length]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    if (slides.length > 1) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };
  
  const handlePrevious = () => {
    if (slides.length > 1) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };
  
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };
  
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };
  
  const handleTransitionChange = (newTransition: string) => {
    setTransition(newTransition);
  };
  
  const handleAutoPlayToggle = (enabled: boolean) => {
    setAutoPlay(enabled);
    if (!enabled) {
      setIsPlaying(false);
    }
  };
  
  const handleReset = () => {
    setCurrentSlide(0);
    setIsPlaying(true);
  };

  // Show loading state while fetching
  if (isLoading) {
    return <HeroLoadingState />;
  }

  // Show default state if error or no slides
  if (hasError || slides.length === 0 || !isReady) {
    return <HeroDefaultState />;
  }

  const slide = slides[currentSlide];
  
  return (
    <div className="relative">
      {/* Hero Slide */}
      <div 
        className="transition-opacity duration-500 min-h-[320px]"
        style={{ 
          transitionDuration: transition === 'fade' ? '500ms' : '300ms' 
        }}
      >
        <HeroSlide slide={slide} />
      </div>

      {/* Controls Toggle Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
        title="Toggle slide controls"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Slide Controls Panel */}
      {showControls && (
        <div className="absolute inset-x-0 bottom-0 z-30 bg-black/80 backdrop-blur-sm p-4">
          <SlideControls
            currentSlide={currentSlide}
            totalSlides={slides.length}
            isPlaying={isPlaying}
            speed={speed}
            transition={transition}
            autoPlay={autoPlay}
            onPlay={handlePlay}
            onPause={handlePause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSlideChange={handleSlideChange}
            onSpeedChange={handleSpeedChange}
            onTransitionChange={handleTransitionChange}
            onAutoPlayToggle={handleAutoPlayToggle}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}
