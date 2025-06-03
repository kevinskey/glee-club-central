
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Monitor, Tablet, Smartphone } from "lucide-react";
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
  isResponsive?: boolean;
}

type TestMode = 'desktop' | 'tablet' | 'mobile' | null;

export function ModernHeroSection({ 
  sectionId = "homepage-main",
  showNavigation = true,
  enableAutoplay = true,
  isResponsive = false
}: ModernHeroSectionProps) {
  const isMobile = useIsMobile();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(enableAutoplay);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testMode, setTestMode] = useState<TestMode>(null);

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

    const buttonClasses = "bg-blue-500 hover:bg-blue-600 text-white w-auto px-6";

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

  const getResponsiveClasses = () => {
    if (!isResponsive) return '';
    
    const baseClass = testMode ? `test-mode-${testMode}` : '';
    return `${baseClass} responsive-hero`;
  };

  const getTextSizeClasses = () => {
    if (!isResponsive) {
      return {
        title: isMobile ? "text-2xl sm:text-3xl" : "text-4xl md:text-5xl lg:text-6xl",
        description: isMobile ? "text-base sm:text-lg" : "text-lg md:text-xl lg:text-2xl"
      };
    }

    return {
      title: "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl",
      description: "text-sm sm:text-base md:text-lg lg:text-xl"
    };
  };

  const getPositionClasses = () => {
    if (slides.length === 0) return 'items-center justify-center';
    
    const currentSlideData = slides[currentSlide];
    const position = currentSlideData.text_position;
    const alignment = currentSlideData.text_alignment;
    
    let positionClass = '';
    switch (position) {
      case 'top':
        positionClass = isResponsive 
          ? 'items-start pt-4 sm:pt-6 md:pt-8 lg:pt-12' 
          : 'items-start pt-8 md:pt-12';
        break;
      case 'bottom':
        positionClass = isResponsive 
          ? 'items-end pb-4 sm:pb-6 md:pb-8 lg:pb-12' 
          : 'items-end pb-8 md:pb-12';
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

  const renderBackgroundMedia = () => {
    const currentSlideData = slides[currentSlide];
    
    console.log('🎭 Hero: Rendering background for slide:', currentSlideData);
    
    if (currentSlideData?.media_id && isYouTubeEmbed(currentSlideData.media_id)) {
      return (
        <iframe
          key={currentSlideData.id}
          src={currentSlideData.media_id}
          className={cn(
            "absolute inset-0 w-full h-full pointer-events-none object-cover",
            getAnimationClass()
          )}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      );
    }

    const currentMedia = currentSlideData?.media_id ? mediaFiles.find(m => m.id === currentSlideData.media_id) : null;
    
    if (currentMedia && currentMedia.file_url) {
      return currentSlideData.media_type === 'video' ? (
        <video
          key={currentMedia.id}
          src={currentMedia.file_url}
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            getAnimationClass()
          )}
          autoPlay
          muted
          loop
          playsInline
          style={{ aspectRatio: '16/9' }}
        />
      ) : (
        <img
          key={currentMedia.id}
          src={currentMedia.file_url}
          alt={currentMedia.title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            getAnimationClass()
          )}
          style={{ aspectRatio: '16/9' }}
        />
      );
    }

    // Default placeholder background with fixed SVG
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Default placeholder pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full bg-repeat" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
      </div>
    );
  };

  const renderTestModeControls = () => {
    if (!isResponsive) return null;

    return (
      <div className="absolute top-4 right-4 z-30 flex gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
        <Button
          variant={testMode === 'desktop' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTestMode(testMode === 'desktop' ? null : 'desktop')}
          className="text-white hover:text-black"
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant={testMode === 'tablet' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTestMode(testMode === 'tablet' ? null : 'tablet')}
          className="text-white hover:text-black"
        >
          <Tablet className="h-4 w-4" />
        </Button>
        <Button
          variant={testMode === 'mobile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTestMode(testMode === 'mobile' ? null : 'mobile')}
          className="text-white hover:text-black"
        >
          <Smartphone className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className={cn("relative w-full h-full overflow-hidden", getResponsiveClasses())}>
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
      <section className={cn("relative w-full h-full overflow-hidden", getResponsiveClasses())}>
        {renderBackgroundMedia()}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className={cn("font-bold mb-4", getTextSizeClasses().title)}>
              Spelman College Glee Club
            </h1>
            <p className={cn("mb-6", getTextSizeClasses().description)}>
              A distinguished ensemble with a rich heritage of musical excellence
            </p>
            <p className="text-sm opacity-75">Error loading hero content: {error}</p>
          </div>
        </div>
        {renderTestModeControls()}
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className={cn("relative w-full h-full overflow-hidden", getResponsiveClasses())}>
        {renderBackgroundMedia()}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className={cn("font-bold mb-4", getTextSizeClasses().title)}>
              Spelman College Glee Club
            </h1>
            <p className={cn("mb-6", getTextSizeClasses().description)}>
              A distinguished ensemble with a rich heritage of musical excellence
            </p>
            <p className="text-sm opacity-75">Setting up hero slides for {sectionId}...</p>
          </div>
        </div>
        {renderTestModeControls()}
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];
  const textSizes = getTextSizeClasses();

  return (
    <section 
      className={cn("relative w-full h-full overflow-hidden", getResponsiveClasses())} 
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
      <div className={cn(
        "relative z-10 h-full flex px-4 sm:px-6 md:px-8 lg:px-12", 
        getPositionClasses()
      )}>
        <div className="max-w-4xl mx-auto w-full">
          <h1 className={cn(
            "font-bold text-white mb-2 md:mb-4 leading-tight",
            textSizes.title
          )}>
            {currentSlideData.title}
          </h1>
          <p className={cn(
            "text-white/90 mb-3 md:mb-6 max-w-2xl leading-relaxed",
            currentSlideData.text_alignment === 'center' ? 'mx-auto' : '',
            textSizes.description
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

      {/* Test Mode Controls */}
      {renderTestModeControls()}

      {/* Navigation Controls */}
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
        </>
      )}
    </section>
  );
}
