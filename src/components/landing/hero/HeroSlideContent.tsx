
import React from 'react';
import { Button } from '@/components/ui/button';
import { HeroSlide, MediaFile } from './types';

interface HeroSlideContentProps {
  slide: HeroSlide;
  mediaFiles: Record<string, MediaFile>;
}

export function HeroSlideContent({ slide, mediaFiles }: HeroSlideContentProps) {
  // Debug logging
  console.log('HeroSlideContent: Current slide:', slide);
  console.log('HeroSlideContent: Available media files:', mediaFiles);
  console.log('HeroSlideContent: Looking for media_id:', slide.media_id);
  
  let backgroundImage;
  
  if (slide.media_id && mediaFiles[slide.media_id]) {
    backgroundImage = mediaFiles[slide.media_id].file_url;
    console.log('HeroSlideContent: Using slide image:', backgroundImage);
  } else {
    // Instead of using a fallback image, show an error state or placeholder
    console.warn('HeroSlideContent: No valid background image found for slide:', slide.title);
    console.warn('HeroSlideContent: media_id:', slide.media_id);
    console.warn('HeroSlideContent: Available media file IDs:', Object.keys(mediaFiles));
    
    // Use a gradient background instead of a random image
    backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }

  return (
    <section className="relative min-h-[300px] sm:h-[70vh] sm:min-h-[500px] flex items-center justify-center overflow-hidden pb-8 sm:pb-12">
      {/* Background - either image or gradient */}
      <div className="absolute inset-0 sm:relative">
        {backgroundImage.startsWith('linear-gradient') ? (
          <div 
            className="w-full h-full"
            style={{ background: backgroundImage }}
          />
        ) : (
          <img
            src={backgroundImage}
            alt={slide.title}
            className="w-full h-auto min-h-[300px] object-cover sm:w-full sm:h-full sm:object-contain transition-all duration-1000"
            style={{
              objectPosition: 'center center'
            }}
            onError={(e) => {
              console.error('HeroSlideContent: Failed to load image:', backgroundImage);
              // Replace with gradient on error
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              }
            }}
          />
        )}
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
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && !slide.media_id && (
          <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-100 text-sm">
            <p><strong>Debug:</strong> No background image selected for this slide</p>
            <p>Slide ID: {slide.id}</p>
            <p>Go to Admin → Hero Slides to select a background image</p>
          </div>
        )}
      </div>
    </section>
  );
}
