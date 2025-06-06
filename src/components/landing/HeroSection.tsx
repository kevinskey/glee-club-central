
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideData {
  id: string;
  title: string;
  description?: string;
  background_image_url?: string;
  background_color?: string;
  link_url?: string;
  design_data?: {
    buttonText?: string;
    textPosition?: 'top' | 'center' | 'bottom';
    textAlignment?: 'left' | 'center' | 'right';
    showText?: boolean;
    height?: 'tiny' | 'small' | 'medium' | 'full' | 'large';
    objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
    objectPosition?: string;
    overlayOpacity?: number;
  };
}

export function HeroSection() {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  console.log('🎭 HeroSection: Component mounted, isLoading:', isLoading);
  console.log('🎭 HeroSection: Slides data:', slides);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        console.log('🎭 HeroSection: Fetching slides from database...');
        const { data, error } = await supabase
          .from('slide_designs')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (error) {
          console.error('🚨 HeroSection: Database error:', error);
          throw error;
        }
        
        console.log('🎭 HeroSection: Database response:', data);
        setSlides(data || []);
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        setSlides([]);
      } finally {
        setIsLoading(false);
        console.log('🎭 HeroSection: Loading complete');
      }
    };

    fetchSlides();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSlideClick = (slide: SlideData) => {
    if (slide.link_url) {
      window.open(slide.link_url, '_blank');
    }
  };

  // Enhanced mobile-first responsive height classes
  const getResponsiveHeightClass = (height?: string) => {
    switch (height) {
      case 'tiny': return 'h-[200px] sm:h-[250px] md:h-[300px]';
      case 'small': return 'h-[250px] sm:h-[300px] md:h-[400px]';
      case 'medium': return 'h-[300px] sm:h-[400px] md:h-[500px]';
      case 'full': return 'h-[350px] sm:h-[500px] md:h-screen';
      case 'large':
      default:
        return 'h-[320px] sm:h-[450px] md:h-[600px]';
    }
  };

  const getTextPositionClass = (position?: string) => {
    switch (position) {
      case 'top': return 'items-start pt-6 sm:pt-12 md:pt-16';
      case 'bottom': return 'items-end pb-6 sm:pb-12 md:pb-16';
      default: return 'items-center';
    }
  };

  const getTextAlignmentClass = (alignment?: string) => {
    switch (alignment) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      default: return 'text-center';
    }
  };

  console.log('🎭 HeroSection: Rendering with isLoading:', isLoading, 'slides.length:', slides.length);

  if (isLoading) {
    console.log('🎭 HeroSection: Showing loading state');
    return (
      <div className="w-full">
        <div className="relative w-full h-[320px] sm:h-[450px] md:h-[600px] bg-gray-200 dark:bg-gray-800 animate-pulse overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400 text-sm sm:text-base">Loading hero content...</div>
          </div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    console.log('🎭 HeroSection: No slides found, showing default content');
    return (
      <div className="w-full">
        <div className="relative w-full h-[320px] sm:h-[450px] md:h-[600px] bg-gradient-to-br from-glee-spelman to-glee-spelman/80 overflow-hidden">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl mx-auto text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
                Welcome to Glee World
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 opacity-90 leading-relaxed">
                The official hub for Spelman College Glee Club
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const slide = slides[currentSlide];
  console.log('🎭 HeroSection: Rendering slide:', slide);
  
  // Check if we should show text overlay
  const showTextOverlay = slide.design_data?.showText !== false && 
    (slide.title || slide.description || slide.design_data?.buttonText);

  // Get image display settings from admin configuration
  const objectFit = slide.design_data?.objectFit || 'cover';
  const objectPosition = slide.design_data?.objectPosition || 'center center';
  const overlayOpacity = slide.design_data?.overlayOpacity || 20;

  return (
    <div className="w-full">
      <div 
        className={`relative w-full ${getResponsiveHeightClass(slide.design_data?.height)} overflow-hidden cursor-pointer`}
        onClick={() => handleSlideClick(slide)}
      >
        {/* Background with responsive handling */}
        {slide.background_image_url ? (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800">
            <img
              src={slide.background_image_url}
              alt={slide.title || 'Hero slide'}
              className="w-full h-full"
              style={{ 
                objectPosition: objectPosition,
                objectFit: objectFit
              }}
              loading="eager"
            />
            {/* Overlay with admin-configurable opacity */}
            {showTextOverlay && (
              <div 
                className="absolute inset-0 bg-black" 
                style={{ opacity: overlayOpacity / 100 }}
              />
            )}
          </div>
        ) : (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: slide.background_color || '#4F46E5' }}
          />
        )}

        {/* Content - Mobile optimized text sizing */}
        {showTextOverlay && (
          <div className={`relative h-full flex ${getTextPositionClass(slide.design_data?.textPosition)} justify-center px-4`}>
            <div className={`max-w-4xl mx-auto text-white ${getTextAlignmentClass(slide.design_data?.textAlignment)} space-y-2 sm:space-y-3 md:space-y-6`}>
              {slide.title && (
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold animate-fade-in leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
              )}
              
              {slide.description && (
                <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 animate-fade-in max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                  {slide.description}
                </p>
              )}

              {slide.design_data?.buttonText && slide.link_url && (
                <div className="pt-2 sm:pt-3 md:pt-4">
                  <Button 
                    size="default"
                    className="animate-fade-in bg-white text-gray-900 hover:bg-gray-100 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 shadow-lg text-sm sm:text-base font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(slide.link_url, '_blank');
                    }}
                  >
                    {slide.design_data.buttonText}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation - Mobile optimized */}
        {slides.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 md:p-3 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10 touch-manipulation"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 md:p-3 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10 touch-manipulation"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>

            {/* Dots indicator - Mobile optimized */}
            <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-colors touch-manipulation ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
