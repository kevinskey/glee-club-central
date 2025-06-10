
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
}

interface OptimizedSliderProps {
  slides: SlideImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  preloadAdjacent?: boolean;
  onSlideChange?: (index: number) => void;
}

export function OptimizedSlider({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className = '',
  aspectRatio = 'video',
  preloadAdjacent = true,
  onSlideChange
}: OptimizedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Memoize aspect ratio classes
  const aspectRatioClass = useMemo(() => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'wide': return 'aspect-[21/9]';
      case 'auto': return 'h-auto';
      default: return 'aspect-video';
    }
  }, [aspectRatio]);

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

  // Navigation handlers
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

  // Render slides (only visible + adjacent for performance)
  const renderSlide = useCallback((slide: SlideImage, index: number) => {
    const isActive = index === currentIndex;
    const shouldRender = loadedImages.has(index);
    const hasError = imageErrors.has(index);
    const isVideoSlide = slide.isVideo || isYouTubeEmbed(slide.src);

    if (!shouldRender && !isActive) {
      return null;
    }

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
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error state */}
        {hasError && !isVideoSlide && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-2xl mb-2">📷</div>
              <p>Image failed to load</p>
            </div>
          </div>
        )}

        {/* Video content (YouTube or other video) */}
        {isVideoSlide ? (
          <iframe
            src={slide.src}
            className="w-full h-full object-cover"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            loading={slide.priority ? 'eager' : 'lazy'}
          />
        ) : (
          /* Regular image content */
          <img
            src={slide.src}
            srcSet={slide.srcSet}
            alt={slide.alt}
            loading={slide.priority ? 'eager' : 'lazy'}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              !loadedImages.has(index) ? 'opacity-0' : 'opacity-100'
            )}
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageError(index)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        )}

        {/* Overlay content */}
        {(slide.title || slide.subtitle) && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className={cn(
              'text-center text-white p-4 max-w-2xl mx-auto',
              slide.textPosition === 'top' && 'items-start',
              slide.textPosition === 'bottom' && 'items-end',
              slide.textAlignment === 'left' && 'text-left',
              slide.textAlignment === 'right' && 'text-right'
            )}>
              {slide.title && (
                <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                  {slide.title}
                </h2>
              )}
              {slide.subtitle && (
                <p className="text-sm md:text-lg opacity-90 drop-shadow-md mb-4">
                  {slide.subtitle}
                </p>
              )}
              {slide.buttonText && (
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => slide.link && window.open(slide.link, '_blank')}
                >
                  {slide.buttonText}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Click handler for links without button text */}
        {slide.link && !slide.buttonText && (
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
  }, [currentIndex, loadedImages, imageErrors, handleImageLoad, handleImageError, isYouTubeEmbed]);

  if (slides.length === 0) {
    return (
      <div className={cn('relative overflow-hidden bg-muted', aspectRatioClass, className)}>
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          No slides available
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden group', aspectRatioClass, className)}>
      {/* Slides container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => renderSlide(slide, index))}
      </div>

      {/* Navigation controls */}
      {showControls && slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Play/Pause button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-30 bg-black/20 hover:bg-black/40 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </>
      )}

      {/* Slide indicators */}
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
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

      {/* Keyboard navigation */}
      <div
        className="absolute inset-0 z-0"
        tabIndex={0}
        onKeyDown={(e) => {
          switch (e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              goToPrevious();
              break;
            case 'ArrowRight':
              e.preventDefault();
              goToNext();
              break;
            case ' ':
              e.preventDefault();
              togglePlayPause();
              break;
          }
        }}
        aria-label="Slider navigation"
      />
    </div>
  );
}
