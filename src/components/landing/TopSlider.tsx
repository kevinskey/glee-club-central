
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface TopSliderItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  youtube_url?: string;
  link_url?: string;
  background_color?: string;
  text_color?: string;
  visible: boolean;
  display_order: number;
  media_library?: {
    file_url: string;
  };
}

export function TopSlider() {
  const [slides, setSlides] = useState<TopSliderItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
    
    // Set up real-time subscription for slide updates
    const channel = supabase
      .channel('top-slider-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'top_slider_items'
        },
        () => {
          console.log('🔄 TopSlider: Database change detected, refetching slides...');
          fetchSlides();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSlides = async () => {
    try {
      console.log('🔍 TopSlider: Fetching visible slides...');
      
      const { data, error } = await supabase
        .from('top_slider_items')
        .select(`
          id,
          title,
          description,
          image_url,
          youtube_url,
          link_url,
          background_color,
          text_color,
          visible,
          display_order,
          media_library!left(
            file_url
          )
        `)
        .eq('visible', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ TopSlider: Database error:', error);
        throw error;
      }

      console.log('📊 TopSlider: Fetched slides:', data);
      setSlides(data || []);
      
      // Reset current index if slides changed
      if (data && data.length > 0 && currentIndex >= data.length) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('💥 TopSlider: Error fetching slides:', error);
      setSlides([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Don't render anything if loading or no slides
  if (isLoading) {
    return (
      <div className="relative w-full h-16 md:h-20 bg-blue-600 flex items-center justify-center">
        <div className="text-white text-sm">Loading slides...</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return null; // Don't show the slider if no slides are available
  }

  const currentSlide = slides[currentIndex];
  const backgroundImage = currentSlide.media_library?.file_url || currentSlide.image_url;

  return (
    <div className="relative w-full h-16 md:h-20 overflow-hidden shadow-sm">
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          backgroundColor: currentSlide.background_color || '#4F46E5',
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {backgroundImage && (
          <div className="absolute inset-0 bg-black/40" />
        )}
        
        <div className="relative h-full flex items-center justify-between px-4 md:px-8">
          <div className="flex-1 text-center">
            <h2 
              className="text-sm md:text-lg font-semibold mb-1"
              style={{ color: currentSlide.text_color || '#FFFFFF' }}
            >
              {currentSlide.title}
            </h2>
            {currentSlide.description && (
              <p 
                className="text-xs md:text-sm opacity-90"
                style={{ color: currentSlide.text_color || '#FFFFFF' }}
              >
                {currentSlide.description}
              </p>
            )}
          </div>

          {currentSlide.link_url && (
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hidden md:flex"
              onClick={() => window.open(currentSlide.link_url, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Learn More
            </Button>
          )}
        </div>

        {slides.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/20 hover:bg-black/40 text-white"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/20 hover:bg-black/40 text-white"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
