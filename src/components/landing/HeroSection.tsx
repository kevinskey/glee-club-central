
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
  const [showContent, setShowContent] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 1 && isReady && isPlaying && autoPlay && showContent) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, speed);
      return () => clearInterval(timer);
    }
  }, [slides.length, isReady, isPlaying, autoPlay, speed, showContent]);

  // Mark as ready when slides are loaded and we have data
  useEffect(() => {
    if (!isLoading && slides.length > 0) {
      const timer = setTimeout(() => {
        setIsReady(true);
        // Add a small delay before showing content for smooth fade transition
        setTimeout(() => {
          setShowContent(true);
        }, 100);
      }, 1000); // Show loading for at least 1 second for the fade effect
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

  // Show loading state while fetching or before content is ready
  if (isLoading || !isReady) {
    return <HeroLoadingState />;
  }

  // Show default state if error or no slides
  if (hasError || slides.length === 0) {
    return <HeroDefaultState />;
  }

  const slide = slides[currentSlide];
  
  return (
    <div className="container mx-auto px-4">
      <div className="relative">
        {/* Hero Slide with fade-in animation */}
        <div 
          className={`transition-opacity duration-1000 h-[60vh] min-h-[400px] max-h-[600px] rounded-lg overflow-hidden ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            transitionDuration: transition === 'fade' ? '500ms' : '300ms' 
          }}
        >
          <HeroSlide slide={slide} />
        </div>

        {/* Controls Toggle Button */}
        {showContent && (
          <button
            onClick={() => setShowControls(!showControls)}
            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
            title="Toggle slide controls"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
        )}

        {/* Slide Controls Panel */}
        {showControls && showContent && (
          <div className="absolute inset-x-0 bottom-0 z-30 bg-black/80 backdrop-blur-sm p-4 rounded-b-lg">
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
    </div>
  );
}
