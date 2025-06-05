
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
  height = "400px",
  className = ""
}: TopSliderProps) {
  const [slides, setSlides] = useState<TopSliderItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
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
        className={cn("w-full", isMobile ? "px-4" : "px-4 sm:px-6 lg:px-8", className)}
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
    return null;
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

  // Mobile horizontal scroll view
  if (isMobile) {
    return (
      <div className={cn("w-full px-4 -mt-2 -mb-2", className)}>
        <div className="overflow-x-auto">
          <div 
            className="flex gap-4 pb-4"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {slides.map((slide, index) => {
              const slideYoutubeVideoId = slide.youtube_url ? getYouTubeVideoId(slide.youtube_url) : null;
              return (
                <div 
                  key={slide.id}
                  className="flex-shrink-0 w-80 relative overflow-hidden rounded-2xl shadow-lg"
                  style={{ 
                    height: "180px",
                    scrollSnapAlign: 'start'
                  }}
                >
                  {/* Background */}
                  <div className="absolute inset-0">
                    {slideYoutubeVideoId ? (
                      <div className="relative w-full h-full">
                        <iframe
                          src={`https://www.youtube.com/embed/${slideYoutubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${slideYoutubeVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                          allow="autoplay; encrypted-media"
                          allowFullScreen={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"></div>
                      </div>
                    ) : slide.computed_image_url ? (
                      <div 
                        className="relative w-full h-full"
                        style={{
                          backgroundImage: `url(${slide.computed_image_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"></div>
                      </div>
                    ) : (
                      <div 
                        className="w-full h-full relative"
                        style={{
                          backgroundColor: slide.background_color || '#4A90E2'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex items-end pb-4 px-4">
                    <div className="max-w-full">
                      <h3 
                        className="text-lg font-bold mb-2 leading-tight"
                        style={{ 
                          color: slide.text_color || '#FFFFFF',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        {slide.link_url ? (
                          <a 
                            href={slide.link_url}
                            className="hover:opacity-80 transition-opacity"
                            target={slide.link_url.startsWith('http') ? '_blank' : '_self'}
                            rel={slide.link_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {slide.title}
                          </a>
                        ) : (
                          slide.title
                        )}
                      </h3>
                      {slide.description && (
                        <p 
                          className="text-sm opacity-90 leading-relaxed"
                          style={{ 
                            color: slide.text_color || '#FFFFFF',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}
                        >
                          {slide.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className={cn("w-full mx-auto max-w-7xl px-2 sm:px-4 lg:px-8", className)}>
      <div 
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
        style={{ height }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background */}
        <div className="absolute inset-0">
          {youtubeVideoId ? (
            <div className="relative w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                allow="autoplay; encrypted-media"
                allowFullScreen={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"></div>
            </div>
          ) : currentSlideData.computed_image_url ? (
            <div 
              className="relative w-full h-full"
              style={{
                backgroundImage: `url(${currentSlideData.computed_image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"></div>
            </div>
          ) : (
            <div 
              className="w-full h-full relative"
              style={{
                backgroundColor: currentSlideData.background_color || '#4A90E2'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-end pb-4 sm:pb-6 md:pb-8 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl">
            <h2 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 leading-tight"
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
                className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed"
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

        {/* Navigation */}
        {slides.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 z-20 backdrop-blur-sm bg-black/20 rounded-full transition-all duration-200 hover:scale-110"
              onClick={goToPrevSlide}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 z-20 backdrop-blur-sm bg-black/20 rounded-full transition-all duration-200 hover:scale-110"
              onClick={goToNextSlide}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>

            {/* Dots indicator */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300",
                    index === currentSlide 
                      ? "bg-white w-6 sm:w-8" 
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
