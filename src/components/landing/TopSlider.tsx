import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface MediaLibraryItem {
  id: string;
  file_url: string;
  title: string;
}

interface TopSliderItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  youtube_url?: string;
  media_id?: string;
  link_url?: string;
  background_color?: string;
  text_color?: string;
  visible: boolean;
  display_order: number;
  media_library?: MediaLibraryItem;
  computed_image_url?: string;
}

interface TopSliderProps {
  autoPlay?: boolean;
  interval?: number;
  height?: string;
  className?: string;
}

// Function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export function TopSlider({ 
  autoPlay = true, 
  interval = 5000, 
  height = "400px", // Apple Music-style height
  className = ""
}: TopSliderProps) {
  const [slides, setSlides] = useState<TopSliderItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  // Use media query to detect mobile devices
  const isMobile = useMediaQuery('(max-width: 768px)');

  const fetchSlides = async () => {
    try {
      console.log('🔍 TopSlider: Starting to fetch slides...');
      
      const { data, error } = await supabase
        .from('top_slider_items')
        .select(`
          *,
          media_library!left(
            id,
            file_url,
            title
          )
        `)
        .eq('visible', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ TopSlider: Error fetching slides:', error);
        throw error;
      }

      console.log('📊 TopSlider: Raw data from database:', data);

      // Process slides to include media library images
      const processedSlides = data?.map(slide => {
        const computed_image_url = slide.media_library?.file_url || slide.image_url;
        console.log(`🖼️ TopSlider: Processing slide "${slide.title}":`, {
          media_library: slide.media_library,
          image_url: slide.image_url,
          computed_image_url
        });
        
        return {
          ...slide,
          computed_image_url
        };
      }) || [];

      console.log('✅ TopSlider: Processed slides:', processedSlides);
      setSlides(processedSlides);
    } catch (error) {
      console.error('💥 TopSlider: Error in fetchSlides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 TopSlider: Component mounted, fetching slides...');
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
    console.log('⏳ TopSlider: Still loading...');
    return (
      <div 
        className={cn("w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4", className)}
        style={{ height }}
      >
        <div className="h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    console.log('📭 TopSlider: No slides to display');
    return null; // Don't render anything if no slides
  }

  console.log(`🎬 TopSlider: Rendering slider with ${slides.length} slides, current: ${currentSlide}`);

  const currentSlideData = slides[currentSlide];
  const youtubeVideoId = currentSlideData.youtube_url ? getYouTubeVideoId(currentSlideData.youtube_url) : null;

  console.log('🎯 TopSlider: Current slide data:', {
    title: currentSlideData.title,
    youtube_url: currentSlideData.youtube_url,
    youtubeVideoId,
    computed_image_url: currentSlideData.computed_image_url
  });

  return (
    <div className={cn("w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4", className)}>
      <div 
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
        style={{ height: isMobile ? "300px" : height }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background */}
        <div className="absolute inset-0">
          {youtubeVideoId ? (
            // YouTube video background - Apple Music style
            <div className="relative w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                allow="autoplay; encrypted-media"
                allowFullScreen={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"></div>
            </div>
          ) : (
            // Image or color background
            <div 
              className="w-full h-full relative"
              style={{
                backgroundColor: currentSlideData.background_color || '#4F46E5',
                backgroundImage: currentSlideData.computed_image_url ? `url(${currentSlideData.computed_image_url})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {currentSlideData.computed_image_url && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"></div>
              )}
            </div>
          )}
        </div>

        {/* Content - Apple Music style positioning */}
        <div className="relative z-10 h-full flex items-end pb-8 px-6 sm:px-8 md:px-12">
          <div className="max-w-3xl">
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
              style={{ 
                color: currentSlideData.text_color || '#FFFFFF',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {currentSlideData.link_url ? (
                <a 
                  href={currentSlideData.link_url}
                  className="hover:opacity-80 transition-opacity"
                  target={currentSlideData.link_url.startsWith('http') ? '_blank' : '_self'}
                  rel={currentSlideData.link_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {currentSlideData.title}
                </a>
              ) : (
                currentSlideData.title
              )}
            </h2>
            {currentSlideData.description && (
              <p 
                className="text-lg sm:text-xl md:text-2xl opacity-90 leading-relaxed"
                style={{ 
                  color: currentSlideData.text_color || '#FFFFFF',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {currentSlideData.description}
              </p>
            )}
          </div>
        </div>

        {/* Navigation - Apple Music style */}
        {slides.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 z-20 backdrop-blur-sm bg-black/20 rounded-full transition-all duration-200 hover:scale-110"
              onClick={goToPrevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 z-20 backdrop-blur-sm bg-black/20 rounded-full transition-all duration-200 hover:scale-110"
              onClick={goToNextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Dots indicator - Apple Music style */}
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
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
