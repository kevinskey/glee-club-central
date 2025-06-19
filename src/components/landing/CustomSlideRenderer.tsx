import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useIsPad } from "@/hooks/useIsPad";

interface Slide {
  id: string;
  image: string;
  background_image?: string;
  background_position?: string;
  title?: string;
  subtitle?: string;
  link: string;
  is_active: boolean;
}

export function CustomSlideRenderer() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlides, setCurrentSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState(400);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isPad = useIsPad();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/slides');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSlides(data);
      } catch (error) {
        console.error("Could not fetch slides:", error);
        setSlides([]);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    const activeSlides = slides.filter(slide => slide.is_active);
    setCurrentSlides(activeSlides);
  }, [slides]);

  useEffect(() => {
    const calculateHeight = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setHeight(400);
      } else if (width >= 768) {
        setHeight(300);
      } else {
        setHeight(200);
      }
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);

    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  const goToPrevious = () => {
    if (currentSlides.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + currentSlides.length) % currentSlides.length);
  };

  const goToNext = () => {
    if (currentSlides.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlides.length > 1) {
      goToNext();
    }
    if (isRightSwipe && currentSlides.length > 1) {
      goToPrevious();
    }
  };

  useEffect(() => {
    if (!isPad && currentSlides.length > 0) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % currentSlides.length);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentSlides.length, isPad]);

  return (
    <div className="relative w-full">
      {/* Desktop/iPad View */}
      <div className="hidden md:block">
        <div 
          className="relative w-full overflow-hidden shadow-2xl cursor-pointer select-none"
          style={{ height, margin: 0, padding: 0 }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={!isPad ? goToNext : undefined}
        >
          {currentSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${slide.background_image || slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: slide.background_position || 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {slide.title && (
                  <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p className="text-lg text-white drop-shadow-lg">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          {currentSlides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
              {currentSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile View - Enhanced swipe support */}
      <div className="block md:hidden">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 pb-4 px-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {currentSlides.map((slide) => (
            <div
              key={slide.id}
              className="flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden shadow-lg snap-start relative cursor-pointer select-none"
              style={{
                backgroundImage: `url(${slide.background_image || slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: slide.background_position || 'center',
                backgroundRepeat: 'no-repeat'
              }}
              onClick={() => window.open(slide.link, '_blank')}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {slide.title && (
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p className="text-sm text-white drop-shadow-lg">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
