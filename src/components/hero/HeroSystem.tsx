
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UnifiedText } from "@/components/ui/unified-text";
import { useHeroSlides } from "@/hooks/useHeroSlides";

interface HeroSystemProps {
  sectionId?: string;
  className?: string;
  autoAdvance?: boolean;
  interval?: number;
}

export function HeroSystem({ 
  sectionId = 'homepage-main',
  className = "",
  autoAdvance = true,
  interval = 7000
}: HeroSystemProps) {
  const { visibleSlides, loading, error } = useHeroSlides(sectionId);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback configuration with all required properties
  const fallbackSlide = {
    id: 'fallback',
    title: 'Spelman College Glee Club',
    description: 'To Amaze and Inspire',
    media_id: '',
    slide_order: 0,
    visible: true,
    section_id: sectionId,
    created_at: '',
    updated_at: '',
    media: { 
      id: 'fallback',
      file_url: '/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png',
      title: 'Spelman Glee Club',
      file_type: 'image/png'
    },
    button_text: 'Learn More',
    button_link: '/about',
    show_title: true,
    text_position: 'center',
    text_alignment: 'center',
    media_type: 'image' as const,
    youtube_url: null
  };

  const displaySlides = visibleSlides.length > 0 ? visibleSlides : [fallbackSlide];
  const currentSlide = displaySlides[Math.min(currentIndex, displaySlides.length - 1)];

  // Auto-advance functionality
  useEffect(() => {
    if (!autoAdvance || displaySlides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % displaySlides.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoAdvance, displaySlides.length, interval]);

  // Reset index when slides change
  useEffect(() => {
    if (currentIndex >= displaySlides.length) {
      setCurrentIndex(0);
    }
  }, [displaySlides.length, currentIndex]);

  if (loading) {
    return (
      <div className={`relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-muted animate-pulse flex items-center justify-center ${className}`}>
        <UnifiedText variant="body" color="muted">Loading...</UnifiedText>
      </div>
    );
  }

  if (error) {
    console.error('Hero system error:', error);
    return (
      <div className={`relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-muted flex items-center justify-center ${className}`}>
        <UnifiedText variant="body" color="muted">Unable to load content</UnifiedText>
      </div>
    );
  }

  if (!currentSlide) {
    return (
      <div className={`relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-muted flex items-center justify-center ${className}`}>
        <UnifiedText variant="body" color="muted">No content available</UnifiedText>
      </div>
    );
  }

  const getMediaUrl = () => {
    if (currentSlide.media_type === 'video' && currentSlide.youtube_url) {
      return currentSlide.youtube_url;
    }
    return currentSlide.media?.file_url || fallbackSlide.media.file_url;
  };

  const hasTextContent = currentSlide.show_title !== false && (
    currentSlide.title || currentSlide.description || currentSlide.button_text
  );

  return (
    <section className={`relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden ${className}`}>
      {/* Background Media */}
      {currentSlide.media_type === 'video' && currentSlide.youtube_url ? (
        <iframe
          src={currentSlide.youtube_url}
          className="absolute inset-0 w-full h-full border-0"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={currentSlide.title}
        />
      ) : (
        <img 
          src={getMediaUrl()}
          alt={currentSlide.title || 'Hero Image'} 
          className="absolute inset-0 w-full h-full object-cover object-center" 
          onError={(e) => {
            if (e.currentTarget.src !== fallbackSlide.media.file_url) {
              e.currentTarget.src = fallbackSlide.media.file_url;
            }
          }}
        />
      )}
      
      {/* Content Overlay */}
      {hasTextContent && (
        <>
          <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
          <div className={`absolute inset-0 flex items-center z-10 ${
            currentSlide.text_position === 'top' ? 'justify-start pt-16' :
            currentSlide.text_position === 'bottom' ? 'justify-end pb-16' :
            'justify-center'
          }`}>
            <div className={`text-white px-8 lg:px-16 max-w-6xl w-full ${
              currentSlide.text_alignment === 'left' ? 'text-left' :
              currentSlide.text_alignment === 'right' ? 'text-right' :
              'text-center'
            }`}>
              {currentSlide.show_title !== false && currentSlide.title && (
                <UnifiedText 
                  as="h1" 
                  variant="h1" 
                  className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-2xl leading-tight text-white"
                >
                  {currentSlide.title}
                </UnifiedText>
              )}
              
              {currentSlide.description && (
                <UnifiedText 
                  as="p" 
                  variant="body-large"
                  className="text-lg md:text-2xl lg:text-3xl mb-8 drop-shadow-xl max-w-4xl mx-auto leading-relaxed text-white/95"
                >
                  {currentSlide.description}
                </UnifiedText>
              )}
              
              {currentSlide.button_text && currentSlide.button_link && (
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black dark:hover:bg-white/90 font-semibold px-8 py-4 text-lg shadow-xl"
                >
                  <a href={currentSlide.button_link}>
                    {currentSlide.button_text}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Slide Indicators */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {displaySlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
