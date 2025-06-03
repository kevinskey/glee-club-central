
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHeroData } from "./hooks/useHeroData";
import { HeroBackgroundMedia } from "./HeroBackgroundMedia";
import { HeroTestControls } from "./HeroTestControls";
import { HeroContent } from "./HeroContent";
import { HeroNavigation } from "./HeroNavigation";
import { TestMode } from "./types";

interface ModernHeroSectionProps {
  sectionId?: string;
  showNavigation?: boolean;
  enableAutoplay?: boolean;
  isResponsive?: boolean;
}

export function ModernHeroSection({ 
  sectionId = "homepage-main",
  showNavigation = true,
  enableAutoplay = true,
  isResponsive = false
}: ModernHeroSectionProps) {
  const isMobile = useIsMobile();
  const { slides, settings, mediaFiles, isLoading, error } = useHeroData(sectionId);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(enableAutoplay);
  const [testMode, setTestMode] = useState<TestMode>(null);

  useEffect(() => {
    if (slides.length > 1 && isPlaying && settings?.scroll_interval && enableAutoplay) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          const nextSlide = prev + 1;
          if (nextSlide >= slides.length) {
            return settings.loop ? 0 : prev;
          }
          return nextSlide;
        });
      }, settings.scroll_interval);

      return () => clearInterval(interval);
    }
  }, [slides.length, isPlaying, settings?.scroll_interval, settings?.loop, enableAutoplay]);

  // Reset current slide if we have slides
  useEffect(() => {
    if (slides.length > 0) {
      setCurrentSlide(0);
    }
  }, [slides.length]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => {
      const newIndex = prev - 1;
      if (newIndex < 0) {
        return settings?.loop ? slides.length - 1 : 0;
      }
      return newIndex;
    });
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => {
      const newIndex = prev + 1;
      if (newIndex >= slides.length) {
        return settings?.loop ? 0 : slides.length - 1;
      }
      return newIndex;
    });
  };

  const handleMouseEnter = () => {
    if (settings?.pause_on_hover) {
      setIsPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (settings?.pause_on_hover) {
      setIsPlaying(true);
    }
  };

  const getResponsiveClasses = () => {
    if (!isResponsive) return '';
    
    const baseClass = testMode ? `test-mode-${testMode}` : '';
    return `${baseClass} responsive-hero`;
  };

  const getTextSizeClasses = () => {
    if (!isResponsive) {
      return {
        title: isMobile ? "text-2xl sm:text-3xl" : "text-4xl md:text-5xl lg:text-6xl",
        description: isMobile ? "text-base sm:text-lg" : "text-lg md:text-xl lg:text-2xl"
      };
    }

    return {
      title: "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl",
      description: "text-sm sm:text-base md:text-lg lg:text-xl"
    };
  };

  const getPositionClasses = () => {
    if (slides.length === 0) return 'items-center justify-center';
    
    const currentSlideData = slides[currentSlide];
    const position = currentSlideData.text_position;
    const alignment = currentSlideData.text_alignment;
    
    let positionClass = '';
    switch (position) {
      case 'top':
        positionClass = isResponsive 
          ? 'items-start pt-4 sm:pt-6 md:pt-8 lg:pt-12' 
          : 'items-start pt-8 md:pt-12';
        break;
      case 'bottom':
        positionClass = isResponsive 
          ? 'items-end pb-4 sm:pb-6 md:pb-8 lg:pb-12' 
          : 'items-end pb-8 md:pb-12';
        break;
      default:
        positionClass = 'items-center';
    }

    let alignmentClass = '';
    switch (alignment) {
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

  if (isLoading) {
    return (
      <section className={cn("relative w-full h-full overflow-hidden", getResponsiveClasses())}>
        <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2">Loading hero section...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn("relative w-full h-full overflow-hidden", getResponsiveClasses())}>
        <HeroBackgroundMedia currentSlide={null} mediaFiles={mediaFiles} settings={settings} />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className={cn("font-bold mb-4", getTextSizeClasses().title)}>
              Spelman College Glee Club
            </h1>
            <p className={cn("mb-6", getTextSizeClasses().description)}>
              A distinguished ensemble with a rich heritage of musical excellence
            </p>
            <p className="text-sm opacity-75">Error loading hero content: {error}</p>
          </div>
        </div>
        <HeroTestControls isResponsive={isResponsive} testMode={testMode} setTestMode={setTestMode} />
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className={cn("relative w-full h-full overflow-hidden", getResponsiveClasses())}>
        <HeroBackgroundMedia currentSlide={null} mediaFiles={mediaFiles} settings={settings} />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className={cn("font-bold mb-4", getTextSizeClasses().title)}>
              Spelman College Glee Club
            </h1>
            <p className={cn("mb-6", getTextSizeClasses().description)}>
              A distinguished ensemble with a rich heritage of musical excellence
            </p>
            <p className="text-sm opacity-75">Setting up hero slides for {sectionId}...</p>
          </div>
        </div>
        <HeroTestControls isResponsive={isResponsive} testMode={testMode} setTestMode={setTestMode} />
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];
  const textSizes = getTextSizeClasses();

  return (
    <section 
      className={cn("relative w-full h-full overflow-hidden", getResponsiveClasses())} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Media */}
      <div className="absolute inset-0">
        <HeroBackgroundMedia 
          currentSlide={currentSlideData} 
          mediaFiles={mediaFiles} 
          settings={settings} 
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content overlay */}
      <HeroContent 
        slide={currentSlideData}
        textSizes={textSizes}
        positionClasses={getPositionClasses()}
        isMobile={isMobile}
      />

      {/* Test Mode Controls */}
      <HeroTestControls 
        isResponsive={isResponsive} 
        testMode={testMode} 
        setTestMode={setTestMode} 
      />

      {/* Navigation Controls */}
      <HeroNavigation 
        slidesCount={slides.length}
        showNavigation={showNavigation}
        isMobile={isMobile}
        onPrevSlide={goToPrevSlide}
        onNextSlide={goToNextSlide}
      />
    </section>
  );
}
