
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { SlideDesign } from '@/types/slideDesign';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface CustomSlideRendererProps {
  autoPlay?: boolean;
  interval?: number;
  height?: string;
  className?: string;
}

export function CustomSlideRenderer({ 
  autoPlay = true, 
  interval = 5000, 
  height = "400px",
  className = ""
}: CustomSlideRendererProps) {
  const [slides, setSlides] = useState<SlideDesign[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  const isMobile = useMediaQuery('(max-width: 768px)');

  const fetchSlides = async () => {
    try {
      console.log('🎨 CustomSlideRenderer: Fetching slide designs...');
      
      const { data, error } = await supabase
        .from('slide_designs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ CustomSlideRenderer: Error fetching slides:', error);
        throw error;
      }

      console.log('✅ CustomSlideRenderer: Loaded slides:', data?.length || 0);
      setSlides(data || []);
    } catch (error) {
      console.error('💥 CustomSlideRenderer: Error in fetchSlides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

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

  if (isLoading) {
    return (
      <div 
        className={cn("w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
        style={{ height }}
      >
        <div className="h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    console.log('📭 CustomSlideRenderer: No slides to display');
    return null;
  }

  const currentSlideData = slides[currentSlide];

  const renderTextElements = () => {
    return currentSlideData.design_data.textElements.map((element) => (
      <div
        key={element.id}
        className="absolute pointer-events-none select-none"
        style={{
          left: `${element.position.x}%`,
          top: `${element.position.y}%`,
          transform: 'translate(-50%, -50%)',
          ...element.style,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        {element.text}
      </div>
    ));
  };

  const renderLayoutGrid = () => {
    const { layout_type } = currentSlideData;
    
    if (layout_type === 'half_horizontal') {
      return <div className="absolute top-0 left-1/2 w-px h-full bg-white/20" />;
    }
    
    if (layout_type === 'half_vertical') {
      return <div className="absolute top-1/2 left-0 w-full h-px bg-white/20" />;
    }
    
    if (layout_type === 'quarter') {
      return (
        <>
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/20" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-white/20" />
        </>
      );
    }
    
    return null;
  };

  return (
    <div className={cn("w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      <div 
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
        style={{ height: isMobile ? "300px" : height }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          if (currentSlideData.link_url) {
            window.open(currentSlideData.link_url, '_blank');
          }
        }}
      >
        {/* Background */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full relative"
            style={{
              backgroundColor: currentSlideData.background_color,
              backgroundImage: currentSlideData.background_image_url ? 
                `url(${currentSlideData.background_image_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {currentSlideData.background_image_url && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"></div>
            )}
          </div>
        </div>

        {/* Layout Grid */}
        {renderLayoutGrid()}

        {/* Text Elements */}
        <div className="relative z-10 h-full">
          {renderTextElements()}
        </div>

        {/* Navigation */}
        {slides.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 z-20 backdrop-blur-sm bg-black/20 rounded-full transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevSlide();
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 z-20 backdrop-blur-sm bg-black/20 rounded-full transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                goToNextSlide();
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Dots indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentSlide 
                      ? "bg-white w-8" 
                      : "bg-white/50 hover:bg-white/75"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
