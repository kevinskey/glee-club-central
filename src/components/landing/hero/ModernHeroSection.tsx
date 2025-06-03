
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
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
  enableAutoplay?: boolean;
}

export function ModernHeroSection({ 
  sectionId = "homepage-main",
  showNavigation = true,
  enableAutoplay = true
}: ModernHeroSectionProps) {
  const isMobile = useIsMobile();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(enableAutoplay);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
      console.log('🎭 Hero: Fetching data for section:', sectionId);
      
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
          .limit(1)
          .single(),
        supabase
          .from('media_library')
          .select('id, file_url, file_type, title')
          .eq('is_public', true)
      ]);

      if (slidesResult.error) {
        console.error('🎭 Hero: Error fetching slides:', slidesResult.error);
        throw slidesResult.error;
      }
      
      // Settings error is not critical, use defaults
      if (settingsResult.error) {
        console.warn('🎭 Hero: Error fetching settings, using defaults:', settingsResult.error);
        setSettings({
          animation_style: 'fade',
          scroll_interval: 5000,
          pause_on_hover: true,
          loop: true
        });
      } else {
        setSettings(settingsResult.data);
      }
      
      if (mediaResult.error) {
        console.error('🎭 Hero: Error fetching media:', mediaResult.error);
        throw mediaResult.error;
      }

      const fetchedSlides = slidesResult.data || [];
      const fetchedMedia = mediaResult.data || [];

      console.log('🎭 Hero: Fetched slides:', fetchedSlides.length);
      console.log('🎭 Hero: Fetched media files:', fetchedMedia.length);

      setMediaFiles(fetchedMedia);
      setSlides(fetchedSlides);
      
      // Reset current slide if we have slides
      if (fetchedSlides.length > 0) {
        setCurrentSlide(0);
      }
    } catch (error) {
      console.error('🎭 Hero: Error fetching hero data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load hero data');
      // Don't set fallback slides here, let the component show the error state
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

  const isYouTubeEmbed = (url: string) => {
    return url?.includes('youtube.com/embed/');
  };

  const renderButton = (slide: HeroSlide) => {
    if (!slide.button_text || !slide.button_link) return null;

    const buttonClasses = "bg-glee-spelman hover:bg-glee-spelman/90 text-white w-auto px-6";

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

  const renderBackgroundMedia = () => {
    const currentSlideData = slides[currentSlide];
    
    // Check if media_id is a YouTube embed URL
    if (currentSlideData.media_id && isYouTubeEmbed(currentSlideData.media_id)) {
      return (
        <iframe
          key={currentSlideData.id}
          src={currentSlideData.media_id}
          className={cn("absolute inset-0 w-full h-full object-cover pointer-events-none", getAnimationClass())}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      );
    }

    // Handle regular media files
    const currentMedia = currentSlideData.media_id ? mediaFiles.find(m => m.id === currentSlideData.media_id) : null;
    
    if (currentMedia && currentMedia.file_url) {
      return currentSlideData.media_type === 'video' ? (
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
        />
      );
    }

    // Fallback gradient background
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    );
  };

  const getPositionClasses = () => {
    if (slides.length === 0) return 'items-center justify-center';
    
    const currentSlideData = slides[currentSlide];
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

  if (isLoading) {
    return (
      <section className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2">Loading hero section...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center max-w-2xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Spelman College Glee Club</h1>
            <p className="text-lg md:text-xl mb-6">A distinguished ensemble with a rich heritage of musical excellence</p>
            <p className="text-sm opacity-75">Error loading hero content: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center max-w-2xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Spelman College Glee Club</h1>
            <p className="text-lg md:text-xl mb-6">A distinguished ensemble with a rich heritage of musical excellence</p>
            <p className="text-sm opacity-75">No hero slides configured for {sectionId}</p>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className="relative w-full h-full overflow-hidden" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Media */}
      <div className="absolute inset-0">
        {renderBackgroundMedia()}
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
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

      {/* Navigation Controls (only show if multiple slides and navigation enabled) */}
      {slides.length > 1 && showNavigation && !isMobile && (
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

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200",
                  index === currentSlide 
                    ? "bg-white" 
                    : "bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
