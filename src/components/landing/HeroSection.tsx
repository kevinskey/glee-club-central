
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
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const QUERY_TIMEOUT = 2000; // Reduced to 2 seconds

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
      setHasError(false);
      return;
    }

    try {
      console.log('🎭 HeroSection: Fetching slides...');
      
      // Create an AbortController for better timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);

      const { data, error } = await supabase
        .from('slide_designs')
        .select('id, title, description, background_image_url, background_color, link_url, design_data')
        .eq('is_active', true)
        .order('display_order')
        .limit(3) // Further reduced limit
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

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
      if (slidesCache && slidesCache.length > 0) {
        console.log('🎭 HeroSection: Falling back to expired cache');
        setSlides(slidesCache);
        setHasError(false);
      } else {
        setSlides([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Set a maximum loading time before showing fallback
    const maxLoadingTime = setTimeout(() => {
      if (isLoading) {
        console.log('🎭 HeroSection: Max loading time reached, showing fallback');
        setIsLoading(false);
        setHasError(true);
      }
    }, 3000);

    fetchSlidesWithCache();

    return () => clearTimeout(maxLoadingTime);
  }, [fetchSlidesWithCache]);

  // Auto-advance slides
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
        return 'h-[280px] sm:h-[400px] md:h-[550px]'; // Slightly smaller default
    }
  }, []);

  const getTextPositionClass = useMemo(() => (position?: string) => {
    switch (position) {
      case 'top': return 'items-start pt-4 sm:pt-8 md:pt-12';
      case 'bottom': return 'items-end pb-4 sm:pb-8 md:pb-12';
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

  // Fast loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="relative w-full h-[280px] sm:h-[400px] md:h-[550px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">
              Loading hero...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show default hero when no slides or error
  if (hasError || slides.length === 0) {
    return (
      <div className="w-full">
        <div className="relative w-full h-[280px] sm:h-[400px] md:h-[550px] bg-gradient-to-br from-glee-spelman to-glee-spelman/90 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl mx-auto text-white space-y-3 sm:space-y-4 md:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Welcome to Glee World
              </h1>
              <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
                The official hub for Spelman College Glee Club
              </p>
              <p className="text-sm sm:text-base italic opacity-80">
                "To Amaze and Inspire"
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
        {/* Background */}
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
              onError={(e) => {
                console.log('🚨 HeroSection: Image failed to load');
                // Hide image on error
                e.currentTarget.style.display = 'none';
              }}
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

        {/* Content */}
        {showTextOverlay && (
          <div className={`relative h-full flex ${getTextPositionClass(slide.design_data?.textPosition)} justify-center px-4`}>
            <div className={`max-w-4xl mx-auto text-white ${getTextAlignmentClass(slide.design_data?.textAlignment)} space-y-2 sm:space-y-3 md:space-y-4`}>
              {slide.title && (
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
              )}
              
              {slide.description && (
                <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                  {slide.description}
                </p>
              )}

              {slide.design_data?.buttonText && slide.link_url && (
                <div className="pt-2 sm:pt-3">
                  <Button 
                    size="default"
                    className="bg-white text-gray-900 hover:bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 shadow-lg text-sm sm:text-base font-medium"
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
