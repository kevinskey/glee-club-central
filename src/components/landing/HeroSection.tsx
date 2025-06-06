import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BackgroundSlideshow } from './slideshow/BackgroundSlideshow';
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
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load image dimensions for mobile height calculation
  useEffect(() => {
    if (slides.length > 0 && isMobile) {
      const currentSlideData = slides[currentSlide];
      if (currentSlideData?.background_image_url) {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const screenWidth = window.innerWidth;
          const calculatedHeight = screenWidth / aspectRatio;
          // Cap at reasonable mobile heights
          const maxMobileHeight = window.innerHeight * 0.7;
          const minMobileHeight = 300;
          setImageHeight(Math.min(maxMobileHeight, Math.max(minMobileHeight, calculatedHeight)));
        };
        img.src = currentSlideData.background_image_url;
      } else {
        setImageHeight(null);
      }
    } else {
      setImageHeight(null);
    }
  }, [slides, currentSlide, isMobile]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data, error } = await supabase
          .from('slide_designs')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (error) throw error;
        setSlides(data || []);
      } catch (error) {
        console.error('Error fetching hero slides:', error);
      } finally {
        setIsLoading(false);
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

  // Responsive height classes with mobile image height support
  const getResponsiveHeightClass = (height?: string) => {
    // On mobile with image height calculated, use that
    if (isMobile && imageHeight) {
      return '';
    }
    
    switch (height) {
      case 'tiny': return 'h-[25vh] min-h-[200px]';
      case 'small': return 'h-[40vh] min-h-[300px]';
      case 'medium': return 'h-[60vh] min-h-[400px]';
      case 'full': return 'h-screen';
      case 'large':
      default:
        return 'h-[50vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] xl:h-[80vh] max-h-[600px] min-h-[400px]';
    }
  };

  const getDynamicStyle = (height?: string) => {
    if (isMobile && imageHeight) {
      return { height: `${imageHeight}px` };
    }
    return {};
  };

  if (isLoading) {
    return (
      <div className={`relative ${getResponsiveHeightClass()} bg-gray-200 dark:bg-gray-800 animate-pulse pt-20 overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Loading hero content...</div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className={`relative ${getResponsiveHeightClass()} bg-gradient-to-br from-glee-spelman to-glee-spelman/80 pt-20 overflow-hidden`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center text-center px-4 sm:px-8 lg:px-20">
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6">
              Welcome to Glee World
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 opacity-90">
              The official hub for Spelman College Glee Club
            </p>
            <div className="text-xs sm:text-sm opacity-75">
              Configure hero slides in the admin dashboard to customize this section
            </div>
          </div>
        </div>
      </div>
    );
  }

  const slide = slides[currentSlide];
  
  const getTextPositionClass = (position?: string) => {
    switch (position) {
      case 'top': return 'items-start pt-24 sm:pt-28 lg:pt-32';
      case 'bottom': return 'items-end pb-12 sm:pb-16 lg:pb-20';
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

  // Check if we should show text overlay
  const showTextOverlay = slide.design_data?.showText !== false && 
    (slide.title || slide.description || slide.design_data?.buttonText);

  // Get image display settings from admin configuration
  const objectFit = slide.design_data?.objectFit || 'contain';
  const objectPosition = slide.design_data?.objectPosition || 'center center';
  const overlayOpacity = slide.design_data?.overlayOpacity || 20;

  return (
    <div 
      className={`relative ${getResponsiveHeightClass(slide.design_data?.height)} overflow-hidden cursor-pointer pt-20`}
      style={getDynamicStyle(slide.design_data?.height)}
      onClick={() => handleSlideClick(slide)}
    >
      {/* Background with admin-configurable display settings */}
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
        <div className={`relative h-full flex ${getTextPositionClass(slide.design_data?.textPosition)} justify-center px-4 sm:px-8 lg:px-20`}>
          <div className={`max-w-4xl mx-auto text-white ${getTextAlignmentClass(slide.design_data?.textAlignment)} space-y-4 sm:space-y-6`}>
            {slide.title && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold animate-fade-in leading-tight drop-shadow-lg">
                {slide.title}
              </h1>
            )}
            
            {slide.description && (
              <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 animate-fade-in max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                {slide.description}
              </p>
            )}

            {slide.design_data?.buttonText && slide.link_url && (
              <div className="pt-2 sm:pt-4">
                <Button 
                  size="lg" 
                  className="animate-fade-in bg-white text-gray-900 hover:bg-gray-100 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 shadow-lg"
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
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(index);
                }}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
