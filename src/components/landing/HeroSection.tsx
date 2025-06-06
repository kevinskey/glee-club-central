
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
    showText?: boolean; // New field to control text visibility
  };
}

export function HeroSection() {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gray-200 dark:bg-gray-800 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Loading hero content...</div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gradient-to-br from-glee-spelman to-glee-spelman/80">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Welcome to Glee World
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              The official hub for Spelman College Glee Club
            </p>
            <div className="text-sm opacity-75">
              Configure hero slides in the admin dashboard to customize this section
            </div>
          </div>
        </div>
      </div>
    );
  }

  const slide = slides[currentSlide];
  const backgroundImages = slide.background_image_url ? [slide.background_image_url] : [];
  
  const getTextPositionClass = (position?: string) => {
    switch (position) {
      case 'top': return 'items-start pt-20';
      case 'bottom': return 'items-end pb-20';
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

  return (
    <div 
      className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden cursor-pointer"
      onClick={() => handleSlideClick(slide)}
    >
      {/* Background */}
      {slide.background_image_url ? (
        <BackgroundSlideshow 
          images={backgroundImages} 
          overlayOpacity={showTextOverlay ? 0.4 : 0.1}
        />
      ) : (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: slide.background_color || '#4F46E5' }}
        />
      )}

      {/* Content - Only show if text is enabled */}
      {showTextOverlay && (
        <div className={`relative h-full flex ${getTextPositionClass(slide.design_data?.textPosition)} justify-center px-4`}>
          <div className={`max-w-4xl mx-auto text-white ${getTextAlignmentClass(slide.design_data?.textAlignment)}`}>
            {slide.title && (
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
                {slide.title}
              </h1>
            )}
            
            {slide.description && (
              <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
                {slide.description}
              </p>
            )}

            {slide.design_data?.buttonText && slide.link_url && (
              <Button 
                size="lg" 
                className="animate-fade-in bg-white text-gray-900 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(slide.link_url, '_blank');
                }}
              >
                {slide.design_data.buttonText}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(index);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
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
