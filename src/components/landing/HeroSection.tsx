
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

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

// Cache for slides to avoid repeated database calls
let slidesCache: SlideData[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function HeroSection() {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchSlidesWithCache = useCallback(async () => {
    const now = Date.now();
    
    // Check if we have valid cached data
    if (slidesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('🎭 HeroSection: Using cached slides');
      setSlides(slidesCache);
      setIsLoading(false);
      return;
    }

    try {
      console.log('🎭 HeroSection: Fetching slides with timeout protection...');
      
      // Use a Promise.race to implement our own timeout
      const fetchPromise = supabase
        .from('slide_designs')
        .select('id, title, description, background_image_url, background_color, link_url, design_data')
        .eq('is_active', true)
        .order('display_order')
        .limit(5); // Limit to reduce query complexity

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 3000)
      );

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) {
        console.error('🚨 HeroSection: Database error:', error);
        throw error;
      }
      
      console.log('🎭 HeroSection: Successfully fetched', data?.length || 0, 'slides');
      const slideData = data || [];
      
      // Update cache
      slidesCache = slideData;
      cacheTimestamp = now;
      
      setSlides(slideData);
      setHasError(false);
    } catch (error) {
      console.error('🚨 HeroSection: Error fetching slides:', error);
      setHasError(true);
      
      // Use cached data if available, even if expired
      if (slidesCache) {
        console.log('🎭 HeroSection: Falling back to expired cache');
        setSlides(slidesCache);
      } else {
        setSlides([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlidesWithCache();
  }, [fetchSlidesWithCache]);

  // Auto-advance slides with cleanup
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const handleSlideClick = useCallback((slide: SlideData) => {
    if (slide.link_url) {
      window.open(slide.link_url, '_blank');
    }
  }, []);

  // Memoized style calculations
  const getResponsiveHeightClass = useMemo(() => (height?: string) => {
    switch (height) {
      case 'tiny': return 'h-[200px] sm:h-[250px] md:h-[300px]';
      case 'small': return 'h-[250px] sm:h-[300px] md:h-[400px]';
      case 'medium': return 'h-[300px] sm:h-[400px] md:h-[500px]';
      case 'full': return 'h-[350px] sm:h-[500px] md:h-screen';
      case 'large':
      default:
        return 'h-[320px] sm:h-[450px] md:h-[600px]';
    }
  }, []);

  const getTextPositionClass = useMemo(() => (position?: string) => {
    switch (position) {
      case 'top': return 'items-start pt-6 sm:pt-12 md:pt-16';
      case 'bottom': return 'items-end pb-6 sm:pb-12 md:pb-16';
      default: return 'items-center';
    }
  }, []);

  const getTextAlignmentClass = useMemo(() => (alignment?: string) => {
    switch (alignment) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      default: return 'text-center';
    }
  }, []);

  // Fast loading state with skeleton
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="relative w-full h-[320px] sm:h-[450px] md:h-[600px] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-500 text-sm sm:text-base animate-pulse">
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (hasError && slides.length === 0) {
    return (
      <div className="w-full">
        <div className="relative w-full h-[320px] sm:h-[450px] md:h-[600px] bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className="max-w-md">
              <p className="text-red-800 dark:text-red-200 mb-4">
                Unable to load hero content
              </p>
              <Button 
                onClick={fetchSlidesWithCache}
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-white"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default hero when no slides
  if (slides.length === 0) {
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
  const showTextOverlay = slide.design_data?.showText !== false && 
    (slide.title || slide.description || slide.design_data?.buttonText);

  const objectFit = slide.design_data?.objectFit || 'cover';
  const objectPosition = slide.design_data?.objectPosition || 'center center';
  const overlayOpacity = slide.design_data?.overlayOpacity || 20;

  return (
    <div className="w-full">
      <div 
        className={`relative w-full ${getResponsiveHeightClass(slide.design_data?.height)} overflow-hidden cursor-pointer`}
        onClick={() => handleSlideClick(slide)}
      >
        {/* Optimized background rendering */}
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
              decoding="async"
            />
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

        {/* Optimized content rendering */}
        {showTextOverlay && (
          <div className={`relative h-full flex ${getTextPositionClass(slide.design_data?.textPosition)} justify-center px-4`}>
            <div className={`max-w-4xl mx-auto text-white ${getTextAlignmentClass(slide.design_data?.textAlignment)} space-y-2 sm:space-y-3 md:space-y-6`}>
              {slide.title && (
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
              )}
              
              {slide.description && (
                <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                  {slide.description}
                </p>
              )}

              {slide.design_data?.buttonText && slide.link_url && (
                <div className="pt-2 sm:pt-3 md:pt-4">
                  <Button 
                    size="default"
                    className="bg-white text-gray-900 hover:bg-gray-100 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 shadow-lg text-sm sm:text-base font-medium"
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
      </div>
    </div>
  );
}
