
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
  let hasValidImage = false;
  
  if (slide.media_id && mediaFiles[slide.media_id]) {
    backgroundImage = mediaFiles[slide.media_id].file_url;
    hasValidImage = true;
    console.log('HeroSlideContent: Using slide image:', backgroundImage);
  } else {
    console.warn('HeroSlideContent: No valid background image found for slide:', slide.title);
    console.warn('HeroSlideContent: media_id:', slide.media_id);
    console.warn('HeroSlideContent: Available media file IDs:', Object.keys(mediaFiles));
    
    // Additional debugging - check if media_id exists but URL is missing
    if (slide.media_id && mediaFiles[slide.media_id] && !mediaFiles[slide.media_id].file_url) {
      console.error('HeroSlideContent: Media file found but no file_url:', mediaFiles[slide.media_id]);
    }
  }

  return (
    <section className="relative min-h-[400px] sm:h-[70vh] sm:min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {hasValidImage ? (
          <>
            <img
              src={backgroundImage}
              alt={slide.title}
              className="w-full h-full object-contain sm:object-cover transition-all duration-1000"
              style={{ 
                objectPosition: 'center center'
              }}
              onLoad={() => {
                console.log('HeroSlideContent: Image loaded successfully:', backgroundImage);
              }}
              onError={(e) => {
                console.error('HeroSlideContent: Failed to load image:', backgroundImage);
                // Hide the broken image and show fallback
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // Show gradient background instead
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-br from-royal-600 via-royal-500 to-powder-500">
                      <div class="absolute inset-0 bg-black/30"></div>
                    </div>
                  `;
                }
              }}
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </>
        ) : (
          // Fallback gradient background
          <div className="w-full h-full bg-gradient-to-br from-royal-600 via-royal-500 to-powder-500">
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        )}
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
      <div className="relative z-10 text-center text-white max-w-[90%] sm:max-w-4xl mx-auto px-4">
        {(slide.show_title !== false) && (
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 transition-all duration-500 leading-tight text-shadow-glass">
            {slide.title}
          </h1>
        )}
        {slide.description && (
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 transition-all duration-500 leading-relaxed text-shadow-glass">
            {slide.description}
          </p>
        )}
        {slide.button_text && slide.button_link && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="glass-button-primary text-base px-8 py-4"
              onClick={() => window.open(slide.button_link, '_blank')}
            >
              {slide.button_text}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
