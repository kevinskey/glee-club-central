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
  media_id?: string;
}

interface MediaFile {
  id: string;
  file_url: string;
  title: string;
}

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export function TopSlider() {
  const [slides, setSlides] = useState<TopSliderItem[]>([]);
  const [mediaFiles, setMediaFiles] = useState<{ [key: string]: MediaFile }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageDimensions, setImageDimensions] = useState<{ [key: string]: ImageDimensions }>({});
  const [sliderHeight, setSliderHeight] = useState<number>(80); // Default height in pixels

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

  // Load image dimensions when slides change
  useEffect(() => {
    if (slides.length > 0) {
      loadImageDimensions();
    }
  }, [slides, mediaFiles]);

  // Update slider height when current slide changes
  useEffect(() => {
    if (slides.length > 0) {
      updateSliderHeight();
    }
  }, [currentIndex, slides, imageDimensions]);

  const fetchSlides = async () => {
    try {
      console.log('🔍 TopSlider: Fetching visible slides...');
      
      // First, fetch slides
      const { data: slidesData, error: slidesError } = await supabase
        .from('top_slider_items')
        .select('*')
        .eq('visible', true)
        .order('display_order', { ascending: true });

      if (slidesError) {
        console.error('❌ TopSlider: Slides error:', slidesError);
        throw slidesError;
      }

      console.log('📊 TopSlider: Fetched slides:', slidesData);
      
      if (!slidesData || slidesData.length === 0) {
        setSlides([]);
        setIsLoading(false);
        return;
      }

      // Get all unique media IDs from slides
      const mediaIds = slidesData
        .map(slide => slide.media_id)
        .filter(id => id !== null && id !== undefined);

      console.log('🔍 TopSlider: Media IDs to fetch:', mediaIds);

      // Fetch media files if we have media IDs
      let mediaData: MediaFile[] = [];
      if (mediaIds.length > 0) {
        const { data: fetchedMedia, error: mediaError } = await supabase
          .from('media_library')
          .select('id, file_url, title')
          .in('id', mediaIds);

        if (mediaError) {
          console.error('❌ TopSlider: Media error:', mediaError);
        } else {
          mediaData = fetchedMedia || [];
          console.log('📁 TopSlider: Fetched media files:', mediaData);
        }
      }

      // Create media lookup map
      const mediaMap: { [key: string]: MediaFile } = {};
      mediaData.forEach(media => {
        mediaMap[media.id] = media;
      });

      setSlides(slidesData);
      setMediaFiles(mediaMap);
      
      // Reset current index if slides changed
      if (slidesData.length > 0 && currentIndex >= slidesData.length) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('💥 TopSlider: Error fetching slides:', error);
      setSlides([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadImageDimensions = async () => {
    const dimensionsMap: { [key: string]: ImageDimensions } = {};
    
    for (const slide of slides) {
      let imageUrl: string | undefined;
      
      if (slide.media_id && mediaFiles[slide.media_id]) {
        imageUrl = mediaFiles[slide.media_id].file_url;
      } else if (slide.image_url) {
        imageUrl = slide.image_url;
      }
      
      if (imageUrl && !imageDimensions[slide.id]) {
        try {
          const dimensions = await getImageDimensions(imageUrl);
          dimensionsMap[slide.id] = dimensions;
          console.log(`📐 TopSlider: Loaded dimensions for slide ${slide.id}:`, dimensions);
        } catch (error) {
          console.error(`❌ TopSlider: Failed to load dimensions for slide ${slide.id}:`, error);
          // Fallback to default aspect ratio
          dimensionsMap[slide.id] = { width: 16, height: 9, aspectRatio: 16/9 };
        }
      }
    }
    
    if (Object.keys(dimensionsMap).length > 0) {
      setImageDimensions(prev => ({ ...prev, ...dimensionsMap }));
    }
  };

  const getImageDimensions = (imageUrl: string): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight
        });
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  const updateSliderHeight = () => {
    if (slides.length === 0) return;
    
    const currentSlide = slides[currentIndex];
    const dimensions = imageDimensions[currentSlide.id];
    
    if (dimensions) {
      // Calculate height based on viewport width and image aspect ratio
      const viewportWidth = window.innerWidth;
      const maxHeight = Math.min(viewportWidth * 0.3, 300); // Max 30% of viewport width or 300px
      const minHeight = 80; // Minimum height
      
      const calculatedHeight = Math.min(maxHeight, Math.max(minHeight, viewportWidth / dimensions.aspectRatio));
      setSliderHeight(calculatedHeight);
      console.log(`📏 TopSlider: Updated height to ${calculatedHeight}px for slide ${currentSlide.id}`);
    } else {
      // Fallback to default height if no dimensions available
      setSliderHeight(80);
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

  // Handle window resize to recalculate height
  useEffect(() => {
    const handleResize = () => {
      updateSliderHeight();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, slides, imageDimensions]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Don't render anything if loading or no slides
  if (isLoading) {
    return (
      <div className="relative w-full bg-blue-600 flex items-center justify-center transition-all duration-300 h-16 sm:h-20 lg:h-24">
        <div className="text-white text-xs sm:text-sm">Loading slides...</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return null; // Don't show the slider if no slides are available
  }

  const currentSlide = slides[currentIndex];
  
  // Determine the background image source with improved logic
  let backgroundImage: string | undefined;
  
  if (currentSlide.media_id && mediaFiles[currentSlide.media_id]) {
    backgroundImage = mediaFiles[currentSlide.media_id].file_url;
    console.log('🎨 TopSlider: Using media library image:', backgroundImage);
  } else if (currentSlide.image_url) {
    backgroundImage = currentSlide.image_url;
    console.log('🎨 TopSlider: Using direct image URL:', backgroundImage);
  }
  
  console.log('🎨 TopSlider: Final background setup:', {
    slideId: currentSlide.id,
    mediaId: currentSlide.media_id,
    hasMediaFile: currentSlide.media_id ? !!mediaFiles[currentSlide.media_id] : false,
    imageUrl: currentSlide.image_url,
    finalBackgroundImage: backgroundImage,
    backgroundColor: currentSlide.background_color,
    height: sliderHeight
  });

  return (
    <div 
      className="relative w-full overflow-hidden shadow-sm transition-all duration-500 ease-in-out h-16 sm:h-20 lg:h-24 max-h-[25vh]"
    >
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          backgroundColor: currentSlide.background_color || '#4F46E5',
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Add overlay for better text readability when background image is present */}
        {backgroundImage && (
          <div className="absolute inset-0 bg-black/40" />
        )}
        
        <div className="relative h-full flex items-center justify-between px-3 sm:px-6 lg:px-8">
          <div className="flex-1 text-center px-8 sm:px-12">
            <h2 
              className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-0.5 sm:mb-1 line-clamp-2"
              style={{ color: currentSlide.text_color || '#FFFFFF' }}
            >
              {currentSlide.title}
            </h2>
            {currentSlide.description && (
              <p 
                className="text-xs sm:text-sm opacity-90 line-clamp-1 sm:line-clamp-2"
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
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hidden sm:flex min-h-[36px] text-xs"
              onClick={() => window.open(currentSlide.link_url, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              <span className="hidden md:inline">Learn More</span>
              <span className="md:hidden">More</span>
            </Button>
          )}
        </div>

        {slides.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-black/20 hover:bg-black/40 text-white min-h-[32px] min-w-[32px] sm:min-h-[40px] sm:min-w-[40px]"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-black/20 hover:bg-black/40 text-white min-h-[32px] min-w-[32px] sm:min-h-[40px] sm:min-w-[40px]"
              onClick={goToNext}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all min-h-[12px] min-w-[12px] sm:min-h-[16px] sm:min-w-[16px] ${
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
