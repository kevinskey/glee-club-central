
import React from 'react';
import { Button } from '@/components/ui/button';
import type { HeroSlide, MediaFile } from './types';

interface HeroSlideContentProps {
  slide: HeroSlide;
  mediaFiles: Record<string, MediaFile>;
}

export function HeroSlideContent({ slide, mediaFiles }: HeroSlideContentProps) {

  const backgroundMedia = slide?.media_id
    ? mediaFiles[slide.media_id]
    : null;

  const backgroundStyle = backgroundMedia 
    ? {
        backgroundImage: `url(${backgroundMedia.file_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  return (
      <section
        className="hero-section relative w-full min-h-[80vh] sm:min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden"
        style={backgroundStyle}
      >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Fallback gradient if no image */}
      {!backgroundMedia && (
        <div className="absolute inset-0 bg-gradient-to-br from-royal-600 via-royal-500 to-powder-500"></div>
      )}
      
      {/* Content */}
      <div className="relative z-10 text-center text-white w-full max-w-[1800px] mx-auto px-6 md:px-8 py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
          {slide?.title || 'Spelman College Glee Club'}
        </h1>
        
        {slide?.description && (
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 opacity-90 leading-relaxed">
            {slide.description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
          {slide?.button_text && slide?.button_link && (
            <Button
              asChild
              size="lg"
              className="bg-white text-royal-600 hover:bg-white/90 text-sm sm:text-base px-4 sm:px-6 md:px-8 py-3 sm:py-4"
            >
              <a href={slide.button_link}>
                {slide.button_text}
              </a>
            </Button>
          )}
          
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/20 text-sm sm:text-base px-4 sm:px-6 md:px-8 py-3 sm:py-4"
          >
            <a href="/contact">
              Get In Touch
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
