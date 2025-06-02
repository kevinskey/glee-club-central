import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Play, Pause } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroSlide {
  id: string;
  media_id?: string;
  media_type: 'image' | 'video';
  title: string;
  description: string;
  button_text?: string;
  button_link?: string;
  text_position: 'top' | 'center' | 'bottom';
  text_alignment: 'left' | 'center' | 'right';
  visible: boolean;
  slide_order: number;
  section_id?: string;
}

interface HeroSettings {
  animation_style: 'fade' | 'slide' | 'zoom' | 'none';
  scroll_interval: number;
  pause_on_hover: boolean;
  loop: boolean;
}

interface MediaFile {
  id: string;
  file_url: string;
  file_type: string;
  title: string;
}

interface ModernHeroSectionProps {
  sectionId?: string;
  showNavigation?: boolean;
  showPlayPause?: boolean;
  showCounter?: boolean;
  showDots?: boolean;
  enableAutoplay?: boolean;
}

export function ModernHeroSection({ 
  sectionId = "homepage-main",
  showNavigation = true,
  showPlayPause = true,
  showCounter = true,
  showDots = true,
  enableAutoplay = true
}: ModernHeroSectionProps) {
  const isMobile = useIsMobile();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(enableAutoplay);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHeroData();
  }, [sectionId]);

  useEffect(() => {
    if (slides.length > 1 && isPlaying && settings?.scroll_interval && enableAutoplay) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          const nextSlide = prev + 1;
          if (nextSlide >= slides.length) {
            return settings.loop ? 0 : prev;
          }
          return nextSlide;
        });
      }, settings.scroll_interval);

      return () => clearInterval(interval);
    }
  }, [slides.length, isPlaying, settings?.scroll_interval, settings?.loop, enableAutoplay]);

  const fetchHeroData = async () => {
    try {
      setIsLoading(true);
      console.log('🎭 Hero: Fetching hero data for section:', sectionId);
      
      // Fetch slides, settings, and media files in parallel
      const [slidesResult, settingsResult, mediaResult] = await Promise.all([
        supabase
          .from('hero_slides')
          .select('*')
          .eq('section_id', sectionId)
          .eq('visible', true)
          .order('slide_order', { ascending: true }),
        supabase
          .from('hero_settings')
          .select('*')
          .single(),
        supabase
          .from('media_library')
          .select('id, file_url, file_type, title')
      ]);

      console.log('🎭 Hero: Slides result:', slidesResult);
      console.log('🎭 Hero: Settings result:', settingsResult);
      console.log('🎭 Hero: Media result:', mediaResult);

      if (slidesResult.error) {
        console.error('🎭 Hero: Error fetching slides:', slidesResult.error);
        throw slidesResult.error;
      }
      if (settingsResult.error) {
        console.error('🎭 Hero: Error fetching settings:', settingsResult.error);
        throw settingsResult.error;
      }
      if (mediaResult.error) {
        console.error('🎭 Hero: Error fetching media:', mediaResult.error);
        throw mediaResult.error;
      }

      const fetchedSlides = slidesResult.data || [];
      const fetchedMedia = mediaResult.data || [];
      
      console.log('🎭 Hero: Fetched slides:', fetchedSlides);
      console.log('🎭 Hero: Fetched media files:', fetchedMedia);

      // Set media files first
      setMediaFiles(fetchedMedia);
      
      // If no media files found but we have slides with media_ids, try to fetch them specifically
      if (fetchedMedia.length === 0 && fetchedSlides.some(slide => slide.media_id)) {
        console.log('🎭 Hero: No media files found but slides have media_ids, trying specific queries...');
        
        const mediaIds = fetchedSlides
          .filter(slide => slide.media_id)
          .map(slide => slide.media_id);
        
        console.log('🎭 Hero: Looking for media IDs:', mediaIds);
        
        if (mediaIds.length > 0) {
          const specificMediaResult = await supabase
            .from('media_library')
            .select('id, file_url, file_type, title')
            .in('id', mediaIds);
          
          console.log('🎭 Hero: Specific media query result:', specificMediaResult);
          
          if (specificMediaResult.data && specificMediaResult.data.length > 0) {
            setMediaFiles(specificMediaResult.data);
          } else {
            // Try one more time with all fields and no filters
            const allMediaResult = await supabase
              .from('media_library')
              .select('*');
            
            console.log('🎭 Hero: All media query result:', allMediaResult);
            
            if (allMediaResult.data) {
              setMediaFiles(allMediaResult.data);
            }
          }
        }
      }

      setSlides(fetchedSlides);
      setSettings(settingsResult.data);
    } catch (error) {
      console.error('🎭 Hero: Error fetching hero data:', error);
      // Fallback to default content
      setSlides([{
        id: 'fallback',
        media_type: 'image',
        title: 'Spelman College Glee Club',
        description: 'A distinguished ensemble with a rich heritage of musical excellence',
        text_position: 'center',
        text_alignment: 'center',
        visible: true,
        slide_order: 0,
        section_id: sectionId
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => {
      const newIndex = prev - 1;
      if (newIndex < 0) {
        return settings?.loop ? slides.length - 1 : 0;
      }
      return newIndex;
    });
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => {
      const newIndex = prev + 1;
      if (newIndex >= slides.length) {
        return settings?.loop ? 0 : slides.length - 1;
      }
      return newIndex;
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMouseEnter = () => {
    if (settings?.pause_on_hover) {
      setIsPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (settings?.pause_on_hover) {
      setIsPlaying(true);
    }
  };

  const isExternalLink = (url: string) => {
    return url?.startsWith('http://') || url?.startsWith('https://');
  };

  const renderButton = (slide: HeroSlide) => {
    if (!slide.button_text || !slide.button_link) return null;

    const buttonClasses = "bg-indigo-500 hover:bg-indigo-600 text-white w-auto px-6";

    if (isExternalLink(slide.button_link)) {
      return (
        <Button size={isMobile ? "default" : "lg"} className={buttonClasses} asChild>
          <a href={slide.button_link} target="_blank" rel="noopener noreferrer">
            {slide.button_text} <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </Button>
      );
    }

    return (
      <Button size={isMobile ? "default" : "lg"} className={buttonClasses} asChild>
        <Link to={slide.button_link}>
          {slide.button_text} <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </Button>
    );
  };

  if (isLoading) {
    return (
      <section className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center max-w-2xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Spelman College Glee Club</h1>
            <p className="text-lg md:text-xl mb-6">A distinguished ensemble with a rich heritage of musical excellence</p>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];
  const currentMedia = currentSlideData.media_id ? mediaFiles.find(m => m.id === currentSlideData.media_id) : null;

  console.log('🎭 Hero: Current slide data:', currentSlideData);
  console.log('🎭 Hero: Current media:', currentMedia);
  console.log('🎭 Hero: Media ID:', currentSlideData.media_id);
  console.log('🎭 Hero: Available media files:', mediaFiles.map(m => ({ id: m.id, title: m.title, url: m.file_url })));

  const getPositionClasses = () => {
    const position = currentSlideData.text_position;
    const alignment = currentSlideData.text_alignment;
    
    let positionClass = '';
    switch (position) {
      case 'top':
        positionClass = 'items-start pt-16 md:pt-20';
        break;
      case 'bottom':
        positionClass = 'items-end pb-16 md:pb-20';
        break;
      default:
        positionClass = 'items-center';
    }

    let alignmentClass = '';
    switch (alignment) {
      case 'left':
        alignmentClass = 'justify-start text-left';
        break;
      case 'right':
        alignmentClass = 'justify-end text-right';
        break;
      default:
        alignmentClass = 'justify-center text-center';
    }

    return `${positionClass} ${alignmentClass}`;
  };

  const getAnimationClass = () => {
    if (!settings?.animation_style || settings.animation_style === 'none') return '';
    
    switch (settings.animation_style) {
      case 'fade':
        return 'transition-opacity duration-1000';
      case 'slide':
        return 'transition-transform duration-700 ease-in-out';
      case 'zoom':
        return 'transition-transform duration-1000 ease-in-out';
      default:
        return '';
    }
  };

  return (
    <section 
      className="relative w-full h-full overflow-hidden" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Media */}
      <div className="absolute inset-0">
        {currentMedia && currentMedia.file_url ? (
          currentSlideData.media_type === 'video' ? (
            <video
              key={currentMedia.id}
              src={currentMedia.file_url}
              className={cn("absolute inset-0 w-full h-full object-cover", getAnimationClass())}
              autoPlay
              muted
              loop
              playsInline
              onError={(e) => {
                console.error('🎭 Hero: Video load error:', e);
                console.error('🎭 Hero: Failed video URL:', currentMedia.file_url);
              }}
              onLoadStart={() => console.log('🎭 Hero: Video loading started for:', currentMedia.file_url)}
              onLoadedData={() => console.log('🎭 Hero: Video loaded successfully for:', currentMedia.file_url)}
            />
          ) : (
            <img
              key={currentMedia.id}
              src={currentMedia.file_url}
              alt={currentMedia.title}
              className={cn("absolute inset-0 w-full h-full object-cover", getAnimationClass())}
              onError={(e) => {
                console.error('🎭 Hero: Image load error:', e);
                console.error('🎭 Hero: Failed image URL:', currentMedia.file_url);
              }}
              onLoad={() => console.log('🎭 Hero: Image loaded successfully for:', currentMedia.file_url)}
            />
          )
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900">
            {(() => {
              console.log('🎭 Hero: No media found, showing gradient background');
              console.log('🎭 Hero: Current slide media_id:', currentSlideData.media_id);
              console.log('🎭 Hero: Available media count:', mediaFiles.length);
              return null;
            })()}
          </div>
        )}
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Content overlay */}
      <div className={cn("relative z-10 h-full flex px-4", getPositionClasses())}>
        <div className="max-w-4xl mx-auto w-full">
          <h1 className={cn(
            "font-bold text-white mb-4 leading-tight",
            isMobile ? "text-2xl sm:text-3xl" : "text-4xl md:text-5xl lg:text-6xl"
          )}>
            {currentSlideData.title}
          </h1>
          <p className={cn(
            "text-white/90 mb-6 max-w-2xl",
            currentSlideData.text_alignment === 'center' ? 'mx-auto' : '',
            isMobile ? "text-base sm:text-lg" : "text-lg md:text-xl lg:text-2xl"
          )}>
            {currentSlideData.description}
          </p>
          <div className={cn(
            "flex gap-3",
            currentSlideData.text_alignment === 'center' ? 'justify-center' : '',
            currentSlideData.text_alignment === 'right' ? 'justify-end' : '',
            isMobile ? 'flex-col sm:flex-row items-center' : 'flex-row items-center'
          )}>
            {renderButton(currentSlideData)}
          </div>
        </div>
      </div>

      {/* Navigation Controls (only show if multiple slides and features enabled) */}
      {slides.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          {showNavigation && !isMobile && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 z-20"
                onClick={goToPrevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 z-20"
                onClick={goToNextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Play/Pause Button */}
          {showPlayPause && enableAutoplay && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white border-0 z-20"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          )}

          {/* Dots Indicator */}
          {showDots && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    index === currentSlide 
                      ? "bg-white" 
                      : "bg-white/50 hover:bg-white/70"
                  )}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}

          {/* Slide Counter */}
          {showCounter && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
              {currentSlide + 1} / {slides.length}
            </div>
          )}
        </>
      )}
    </section>
  );
}
