
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
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
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
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        {(slide.show_title !== false) && (
          <h1 className="text-4xl md:text-6xl font-bold mb-6 transition-all duration-500">
            {slide.title}
          </h1>
        )}
        {slide.description && (
          <p className="text-xl md:text-2xl mb-8 opacity-90 transition-all duration-500">
            {slide.description}
          </p>
        )}
        {slide.button_text && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
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
