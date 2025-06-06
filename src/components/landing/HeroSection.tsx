
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

  // Mobile-first responsive height classes - much shorter on mobile
  const getResponsiveHeightClass = (height?: string) => {
    switch (height) {
      case 'tiny': return 'h-[150px] md:h-[200px]';
      case 'small': return 'h-[200px] md:h-[300px]';
      case 'medium': return 'h-[250px] md:h-[400px]';
      case 'full': return 'h-[300px] md:h-screen';
      case 'large':
      default:
        return 'h-[280px] md:h-[500px]';
    }
  };

  const getTextPositionClass = (position?: string) => {
    switch (position) {
      case 'top': return 'items-start pt-8 md:pt-16';
      case 'bottom': return 'items-end pb-8 md:pb-16';
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
        <div className="relative w-full h-[280px] md:h-[500px] bg-gray-200 dark:bg-gray-800 animate-pulse overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400">Loading hero content...</div>
          </div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    console.log('🎭 HeroSection: No slides found, showing default content');
    return (
      <div className="w-full">
        <div className="relative w-full h-[280px] md:h-[500px] bg-gradient-to-br from-glee-spelman to-glee-spelman/80 overflow-hidden">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full flex items-center justify-center text-center">
            <div className="max-w-4xl mx-auto text-white px-4">
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6">
                Welcome to Glee World
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90">
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

  // Get image display settings from admin configuration - default to cover for full width
  const objectFit = slide.design_data?.objectFit || 'cover';
  const objectPosition = slide.design_data?.objectPosition || 'center center';
  const overlayOpacity = slide.design_data?.overlayOpacity || 20;

  return (
    <div className="w-full">
      <div 
        className={`relative w-full ${getResponsiveHeightClass(slide.design_data?.height)} overflow-hidden cursor-pointer`}
        onClick={() => handleSlideClick(slide)}
      >
        {/* Background with admin-configurable display settings - Full Width */}
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

        {/* Content - Only show if text is enabled */}
        {showTextOverlay && (
          <div className={`relative h-full flex ${getTextPositionClass(slide.design_data?.textPosition)} justify-center`}>
            <div className={`max-w-4xl mx-auto text-white ${getTextAlignmentClass(slide.design_data?.textAlignment)} space-y-3 md:space-y-6 px-4`}>
              {slide.title && (
                <h1 className="text-xl md:text-3xl lg:text-5xl font-bold animate-fade-in leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
              )}
              
              {slide.description && (
                <p className="text-sm md:text-lg lg:text-xl opacity-90 animate-fade-in max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                  {slide.description}
                </p>
              )}

              {slide.design_data?.buttonText && slide.link_url && (
                <div className="pt-2 md:pt-4">
                  <Button 
                    size="default"
                    className="animate-fade-in bg-white text-gray-900 hover:bg-gray-100 px-4 md:px-8 py-2 md:py-4 shadow-lg text-sm md:text-base"
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

        {/* Navigation - Only show if multiple slides */}
        {slides.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10"
            >
              <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10"
            >
              <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
