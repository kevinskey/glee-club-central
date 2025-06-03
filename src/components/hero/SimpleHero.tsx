
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SimpleHeroSlide {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  textPosition: 'top' | 'center' | 'bottom';
  textAlignment: 'left' | 'center' | 'right';
}

interface SimpleHeroProps {
  slides?: SimpleHeroSlide[];
  autoPlay?: boolean;
  interval?: number;
  showNavigation?: boolean;
  height?: string;
  className?: string;
}

const DEFAULT_SLIDES: SimpleHeroSlide[] = [
  {
    id: '1',
    title: 'Spelman College Glee Club',
    description: 'A distinguished ensemble with a rich heritage of musical excellence',
    textPosition: 'center',
    textAlignment: 'center'
  }
];

export function SimpleHero({ 
  slides = DEFAULT_SLIDES,
  autoPlay = true,
  interval = 5000,
  showNavigation = true,
  height = '70vh',
  className = ''
}: SimpleHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 1 && isPlaying && autoPlay) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [slides.length, isPlaying, autoPlay, interval]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(autoPlay);

  if (!slides || slides.length === 0) {
    return (
      <div 
        className={cn("relative w-full overflow-hidden", className)}
        style={{ height }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple">
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Spelman College Glee Club
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              A distinguished ensemble with a rich heritage of musical excellence
            </p>
          </div>
        </div>
      </div>
    );
  }

  const slide = slides[currentSlide];

  const getPositionClasses = () => {
    let positionClass = '';
    switch (slide.textPosition) {
      case 'top':
        positionClass = 'items-start pt-16';
        break;
      case 'bottom':
        positionClass = 'items-end pb-16';
        break;
      default:
        positionClass = 'items-center';
    }

    let alignmentClass = '';
    switch (slide.textAlignment) {
      case 'left':
        alignmentClass = 'justify-start text-left';
        break;
      case 'right':
        alignmentClass = 'justify-end text-right';
        break;
      default:
        alignmentClass = 'justify-center text-center';
    }

    return `${positionClass} ${alignmentClass}`;
  };

  const renderButton = () => {
    if (!slide.buttonText || !slide.buttonLink) return null;

    const isExternal = slide.buttonLink.startsWith('http');
    
    if (isExternal) {
      return (
        <Button 
          size="lg" 
          className="bg-blue-500 hover:bg-blue-600 text-white"
          asChild
        >
          <a href={slide.buttonLink} target="_blank" rel="noopener noreferrer">
            {slide.buttonText}
          </a>
        </Button>
      );
    }

    return (
      <Button 
        size="lg" 
        className="bg-blue-500 hover:bg-blue-600 text-white"
        asChild
      >
        <Link to={slide.buttonLink}>
          {slide.buttonText}
        </Link>
      </Button>
    );
  };

  return (
    <div 
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {slide.imageUrl ? (
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('🎯 SimpleHero: Image failed to load:', slide.imageUrl);
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple" />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className={cn("relative z-10 h-full flex px-6 md:px-12", getPositionClasses())}>
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {slide.title}
          </h1>
          {slide.description && (
            <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl">
              {slide.description}
            </p>
          )}
          {renderButton()}
        </div>
      </div>

      {/* Navigation */}
      {showNavigation && slides.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 z-20"
            onClick={goToPrevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 z-20"
            onClick={goToNextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  index === currentSlide 
                    ? "bg-white" 
                    : "bg-white/50 hover:bg-white/75"
                )}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
