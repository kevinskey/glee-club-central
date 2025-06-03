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
  height = "200px", // Increased from 120px to 200px
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
        className={cn("w-full bg-gradient-to-r from-blue-500 to-purple-600", className)}
        style={{ height }}
      >
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
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
    <div 
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {youtubeVideoId ? (
          // YouTube video background - mobile-optimized
          <div className="relative w-full h-full">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover pointer-events-none",
                // Remove scale transform on mobile to prevent cropping
                isMobile ? "" : "scale-110"
              )}
              style={isMobile ? {
                // On mobile, use aspect-ratio to maintain proportions without cropping
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              } : {
                // On desktop, keep the scale transform to hide controls
                transform: 'scale(1.2)',
                transformOrigin: 'center center'
              }}
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ) : (
          // Image or color background
          <div 
            className="w-full h-full"
            style={{
              backgroundColor: currentSlideData.background_color || '#4F46E5',
              backgroundImage: currentSlideData.computed_image_url ? `url(${currentSlideData.computed_image_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {currentSlideData.computed_image_url && (
              <div className="absolute inset-0 bg-black/20"></div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <h2 
            className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2"
            style={{ color: currentSlideData.text_color || '#FFFFFF' }}
          >
            {currentSlideData.link_url ? (
              <a 
                href={currentSlideData.link_url}
                className="hover:underline"
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
              className="text-base md:text-lg opacity-90"
              style={{ color: currentSlideData.text_color || '#FFFFFF' }}
            >
              {currentSlideData.description}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-10 w-10 z-20"
            onClick={goToPrevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-10 w-10 z-20"
            onClick={goToNextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dots indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  index === currentSlide 
                    ? "bg-white" 
                    : "bg-white/50 hover:bg-white/75"
                )}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
