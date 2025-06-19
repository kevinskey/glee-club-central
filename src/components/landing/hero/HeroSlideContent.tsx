
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  cta_text?: string;
  cta_url?: string;
  media_id?: string;
  is_active: boolean;
  order_index: number;
}

interface MediaFile {
  id: string;
  file_url: string;
  file_type: string;
  file_name: string;
}

interface HeroSlideContentProps {
  slide: HeroSlide;
  mediaFiles: MediaFile[];
}

export function HeroSlideContent({ slide, mediaFiles }: HeroSlideContentProps) {
  console.log('HeroSlideContent: Rendering slide:', slide?.title);
  
  const backgroundMedia = slide?.media_id 
    ? mediaFiles.find(m => m.id === slide.media_id)
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
      className="hero-section relative w-full min-h-[60vh] sm:min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden"
      style={backgroundStyle}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Fallback gradient if no image */}
      {!backgroundMedia && (
        <div className="absolute inset-0 bg-gradient-to-br from-royal-600 via-royal-500 to-powder-500"></div>
      )}
      
      {/* Content */}
      <div className="relative z-10 text-center text-white py-4 px-2 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
          {slide?.title || 'Spelman College Glee Club'}
        </h1>
        
        {slide?.subtitle && (
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3 md:mb-4 opacity-90">
            {slide.subtitle}
          </h2>
        )}
        
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 opacity-90 leading-relaxed">
          {slide?.description || 'To Amaze and Inspire'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
          {slide?.cta_text && slide?.cta_url && (
            <Button
              asChild
              size="lg"
              className="bg-white text-royal-600 hover:bg-white/90 text-sm sm:text-base px-4 sm:px-6 md:px-8 py-3 sm:py-4"
            >
              <a href={slide.cta_url}>
                {slide.cta_text}
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
