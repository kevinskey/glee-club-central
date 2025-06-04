import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHeroData } from "./hooks/useHeroData";
import { HeroBackgroundMedia } from "./HeroBackgroundMedia";
import { HeroContent } from "./HeroContent";
import { HeroNavigation } from "./HeroNavigation";

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
  const { slides, settings, mediaFiles, isLoading, error, refetch } = useHeroData(sectionId);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(enableAutoplay);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasValidSlidesRef = useRef(false);

  // Initialize only when we have valid data
  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
      hasValidSlidesRef.current = slides.length > 0;
      console.log(`🎭 Hero: Initialized section "${sectionId}" with ${slides.length} slides`);
      
      // Reset to first slide when slides change
      if (slides.length > 0) {
        setCurrentSlide(0);
      }
    }
  }, [isLoading, slides.length, sectionId]);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 1 && isPlaying && settings?.scroll_interval && enableAutoplay && isInitialized) {
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
  }, [slides.length, isPlaying, settings?.scroll_interval, settings?.loop, enableAutoplay, isInitialized]);

  // Manual navigation functions
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

  // Pause/resume on hover
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

  // Responsive classes
  const getResponsiveClasses = () => {
    if (!isResponsive) return '';
    return 'responsive-hero';
  };

  const getTextSizeClasses = () => {
    if (!isResponsive) {
      return {
        title: isMobile ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl" : "text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl",
        description: isMobile ? "text-sm sm:text-base md:text-lg" : "text-base md:text-lg lg:text-xl xl:text-2xl"
      };
    }

    return {
      title: "text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl",
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
          ? 'items-start pt-8 sm:pt-12 md:pt-16 lg:pt-20' 
          : 'items-start pt-16 md:pt-20 lg:pt-24';
        break;
      case 'bottom':
        positionClass = isResponsive 
          ? 'items-end pb-8 sm:pb-12 md:pb-16 lg:pb-20' 
          : 'items-end pb-16 md:pb-20 lg:pb-24';
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

  // Show loading state only initially
  if (isLoading && !isInitialized) {
    console.log(`🎭 Hero: Showing loading state for section "${sectionId}"`);
    return (
      <section className={cn("relative w-full h-full overflow-hidden", getResponsiveClasses())}>
        <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2">Loading {sectionId} hero section...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state with fallback content
  if (error && isInitialized) {
    console.log(`🎭 Hero: Showing error state for section "${sectionId}":`, error);
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
            <button 
              onClick={refetch}
              className="text-sm text-white/80 hover:text-white underline"
            >
              Try reloading content
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show slides or default content when initialized
  if (!isInitialized || slides.length === 0) {
    console.log(`🎭 Hero: Showing default content for section "${sectionId}" - no slides available`);
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
            <p className="text-sm text-white/60 mt-4">
              No hero slides configured for this section. Use the admin panel to add content.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];
  const textSizes = getTextSizeClasses();

  console.log(`🎭 Hero: Rendering section "${sectionId}", slide ${currentSlide + 1} of ${slides.length}: "${currentSlideData.title}"`);

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
        
        {/* Reduced dark overlay for better text visibility while keeping image visible */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Content overlay */}
      <HeroContent 
        slide={currentSlideData}
        textSizes={textSizes}
        positionClasses={getPositionClasses()}
        isMobile={isMobile}
        mediaFiles={mediaFiles}
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
