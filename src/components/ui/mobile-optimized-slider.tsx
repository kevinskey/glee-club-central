import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SlideImage {
  id: string;
  src: string;
  srcSet?: string;
  alt: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  link?: string;
  textPosition?: 'top' | 'center' | 'bottom';
  textAlignment?: 'left' | 'center' | 'right';
  isVideo?: boolean;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

interface MobileOptimizedSliderProps {
  slides: SlideImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  preloadAdjacent?: boolean;
  onSlideChange?: (index: number) => void;
  defaultObjectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

export function MobileOptimizedSlider({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className = '',
  aspectRatio = 'video',
  preloadAdjacent = true,
  onSlideChange,
  defaultObjectFit = 'cover'
}: MobileOptimizedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoize aspect ratio classes with better mobile optimization
  const aspectRatioClass = useMemo(() => {
    if (isMobile) {
      switch (aspectRatio) {
        case 'square': return 'aspect-square';
        case 'wide': return 'aspect-[16/9]';
        case 'auto': return 'h-auto min-h-[60vh]';
        default: return 'aspect-[3/2]'; // Less cropping for mobile
      }
    }
    
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'wide': return 'aspect-[21/9]';
      case 'auto': return 'h-auto';
      default: return 'aspect-[4/3]'; // Less cropping for desktop
    }
  }, [aspectRatio, isMobile]);

  // Get object-fit class with top positioning for cover
  const getObjectFitClass = useCallback((objectFit: string) => {
    switch (objectFit) {
      case 'cover': return 'object-cover object-top'; // Added object-top for cropping from bottom
      case 'fill': return 'object-fill';
      case 'scale-down': return 'object-scale-down';
      case 'none': return 'object-none';
      default: return 'object-contain';
    }
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, slides.length, autoPlayInterval]);

  // Preload adjacent images
  useEffect(() => {
    if (!preloadAdjacent) return;

    const indicesToLoad = new Set<number>();
    indicesToLoad.add(currentIndex);
    
    // Add previous and next indices
    if (currentIndex > 0) indicesToLoad.add(currentIndex - 1);
    if (currentIndex < slides.length - 1) indicesToLoad.add(currentIndex + 1);
    
    // For circular navigation
    if (currentIndex === 0 && slides.length > 1) {
      indicesToLoad.add(slides.length - 1);
    }
    if (currentIndex === slides.length - 1 && slides.length > 1) {
      indicesToLoad.add(0);
    }

    setLoadedImages(prev => new Set([...prev, ...indicesToLoad]));
  }, [currentIndex, slides.length, preloadAdjacent]);

  // Navigation handlers with mobile touch support
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev === 0 ? slides.length - 1 : prev - 1);
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Touch handlers for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && slides.length > 1) {
      goToNext();
    }
    if (isRightSwipe && slides.length > 1) {
      goToPrevious();
    }
  };

  // Handle slide change callback
  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  // Handle image load success
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  }, []);

  // Handle image load error
  const handleImageError = useCallback((index: number) => {
    setImageErrors(prev => new Set([...prev, index]));
  }, []);

  // Check if URL is a YouTube embed URL
  const isYouTubeEmbed = useCallback((url: string) => {
    return url?.includes('youtube.com/embed/');
  }, []);

  // Enhance YouTube URL with proper parameters for autoplay
  const enhanceYouTubeUrl = useCallback((url: string) => {
    if (!isYouTubeEmbed(url)) return url;
    
    // Add parameters for better autoplay support
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
  }, [isYouTubeEmbed]);

  // Check if slide has any text content to display
  const hasTextContent = useCallback((slide: SlideImage) => {
    return slide.title?.trim() || slide.subtitle?.trim() || slide.buttonText?.trim();
  }, []);

  // Render slides with cover object-fit and top positioning
  const renderSlide = useCallback((slide: SlideImage, index: number) => {
    const isActive = index === currentIndex;
    const shouldRender = loadedImages.has(index);
    const hasError = imageErrors.has(index);
    const isVideoSlide = slide.isVideo || isYouTubeEmbed(slide.src);
    const showTextOverlay = hasTextContent(slide);
    const objectFitClass = getObjectFitClass(slide.objectFit || defaultObjectFit);

    if (!shouldRender && !isActive) return null;

    return (
      <div
        key={slide.id}
        className={cn(
          'absolute inset-0 transition-opacity duration-500 ease-in-out',
          isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
        )}
      >
        {/* Loading placeholder */}
        {!loadedImages.has(index) && !hasError && !isVideoSlide && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error state */}
        {hasError && !isVideoSlide && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground px-4">
              <div className="text-xl md:text-2xl mb-2">📷</div>
              <p className="text-sm">Image failed to load</p>
            </div>
          </div>
        )}

        {/* Video content */}
        {isVideoSlide ? (
          <iframe
            key={`${slide.id}-${isActive}`}
            src={enhanceYouTubeUrl(slide.src)}
            className="w-full h-full object-cover"
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            loading={slide.priority ? 'eager' : 'lazy'}
            style={{ border: 'none' }}
          />
        ) : (
          /* Image content with top positioning for cropping from bottom */
          <img
            src={slide.src}
            srcSet={slide.srcSet}
            alt={slide.alt}
            loading={slide.priority ? 'eager' : 'lazy'}
            className={cn(
              'w-full h-full transition-opacity duration-300',
              objectFitClass,
              !loadedImages.has(index) ? 'opacity-0' : 'opacity-100'
            )}
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageError(index)}
            sizes="100vw"
          />
        )}

        {/* Text overlay content */}
        {showTextOverlay && (
          <div className={cn(
            'absolute inset-0 bg-black/20 md:bg-black/15 flex justify-center',
            slide.textPosition === 'top' && 'items-start pt-4 sm:pt-8 md:pt-12',
            slide.textPosition === 'bottom' && 'items-end pb-4 sm:pb-8 md:pb-12',
            slide.textPosition !== 'top' && slide.textPosition !== 'bottom' && 'items-center'
          )}>
            <div className={cn(
              'w-full max-w-xs md:max-w-2xl mx-auto px-4',
              slide.textAlignment === 'left' && 'text-left',
              slide.textAlignment === 'right' && 'text-right',
              slide.textAlignment !== 'left' && slide.textAlignment !== 'right' && 'text-center'
            )}>
              <div className="text-white">
                {slide.title && (
                  <h2 className="text-lg md:text-2xl lg:text-4xl font-bold mb-2 drop-shadow-lg leading-tight">
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p className="text-xs md:text-sm lg:text-lg opacity-90 drop-shadow-md mb-3 md:mb-4 leading-relaxed">
                    {slide.subtitle}
                  </p>
                )}
                {slide.buttonText && (
                  <div className="flex justify-center">
                    <Button 
                      size={isMobile ? "sm" : "lg"}
                      className="bg-primary hover:bg-primary/90 text-xs md:text-sm px-4 py-2 md:px-6 md:py-3"
                      onClick={() => slide.link && window.open(slide.link, '_blank')}
                    >
                      {slide.buttonText}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Click handler for links without button text */}
        {slide.link && !slide.buttonText && !showTextOverlay && (
          <div
            className="absolute inset-0 cursor-pointer z-20"
            onClick={() => window.open(slide.link, '_blank')}
            role="button"
            tabIndex={0}
            aria-label={`Open ${slide.title || slide.alt}`}
          />
        )}
      </div>
    );
  }, [currentIndex, loadedImages, imageErrors, handleImageLoad, handleImageError, isYouTubeEmbed, enhanceYouTubeUrl, hasTextContent, getObjectFitClass, defaultObjectFit, isMobile]);

  if (slides.length === 0) {
    return (
      <div className={cn('w-full overflow-hidden bg-muted flex items-center justify-center', aspectRatioClass, className)}>
        <div className="text-center text-muted-foreground">
          <span className="text-sm md:text-base">No slides available</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn('w-full overflow-hidden group', aspectRatioClass, className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => renderSlide(slide, index))}
      </div>

      {/* Mobile-optimized navigation controls */}
      {showControls && slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "icon"}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white border-none transition-opacity",
              isMobile ? "opacity-60 touch-manipulation" : "opacity-0 group-hover:opacity-100"
            )}
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className={cn(isMobile ? "h-4 w-4" : "h-6 w-6")} />
          </Button>

          <Button
            variant="ghost"
            size={isMobile ? "sm" : "icon"}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white border-none transition-opacity",
              isMobile ? "opacity-60 touch-manipulation" : "opacity-0 group-hover:opacity-100"
            )}
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className={cn(isMobile ? "h-4 w-4" : "h-6 w-6")} />
          </Button>

          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-30 bg-black/20 hover:bg-black/40 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          )}
        </>
      )}

      {/* Mobile-optimized slide indicators */}
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-1.5 md:space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                'rounded-full transition-all duration-200 touch-manipulation',
                isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2',
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
