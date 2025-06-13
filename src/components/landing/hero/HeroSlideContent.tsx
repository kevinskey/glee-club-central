
import React from 'react';
import { Button } from '@/components/ui/button';
import { HeroSlide, MediaFile } from './types';

interface HeroSlideContentProps {
  slide: HeroSlide;
  mediaFiles: Record<string, MediaFile>;
}

export function HeroSlideContent({ slide, mediaFiles }: HeroSlideContentProps) {
  const backgroundImage = slide.media_id && mediaFiles[slide.media_id] 
    ? mediaFiles[slide.media_id].file_url 
    : '/lovable-uploads/69a9fc5f-3edb-4cf9-bbb0-353dd208e064.png';

  return (
    <section className="relative min-h-[300px] sm:h-[70vh] sm:min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image - Mobile crops to image size, Desktop maintains aspect */}
      <div className="absolute inset-0 sm:relative">
        <img
          src={backgroundImage}
          alt={slide.title}
          className="w-full h-auto min-h-[300px] object-cover sm:w-full sm:h-full sm:object-contain transition-all duration-1000"
          style={{
            objectPosition: 'center center'
          }}
        />
        <div className="absolute inset-0 bg-black/50 sm:bg-black/40"></div>
      </div>
      
      {/* YouTube Video Background (if applicable) */}
      {slide.youtube_url && slide.media_type === 'video' && (
        <div className="absolute inset-0">
          <iframe
            src={`${slide.youtube_url}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
            className="w-full h-full object-cover"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-black/50 sm:bg-black/40"></div>
        </div>
      )}
      
      {/* Content - Mobile Optimized */}
      <div className="relative z-10 text-center text-white max-w-[90%] sm:max-w-4xl mx-auto px-2 sm:px-4 sm:absolute">
        {(slide.show_title !== false) && (
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-6 transition-all duration-500 leading-tight">
            {slide.title}
          </h1>
        )}
        {slide.description && (
          <p className="text-sm sm:text-xl md:text-2xl mb-4 sm:mb-8 opacity-90 transition-all duration-500 leading-relaxed">
            {slide.description}
          </p>
        )}
        {slide.button_text && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="default"
              className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
              onClick={() => slide.button_link && window.open(slide.button_link, '_blank')}
            >
              {slide.button_text}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
