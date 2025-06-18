
import React from 'react';
import { Button } from '@/components/ui/button';
import { HeroSlide, MediaFile } from './types';
import { useIsPad } from '@/hooks/useIsPad';

interface HeroSlideContentProps {
  slide: HeroSlide;
  mediaFiles: Record<string, MediaFile>;
}

export function HeroSlideContent({ slide, mediaFiles }: HeroSlideContentProps) {
  const isPad = useIsPad();
  
  // Debug logging
  console.log('HeroSlideContent: Current slide:', slide);
  console.log('HeroSlideContent: Available media files:', mediaFiles);
  console.log('HeroSlideContent: Looking for media_id:', slide.media_id);
  console.log('HeroSlideContent: isPad:', isPad);
  
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

  // Check if there's any text content to display
  const hasTextContent = (slide.show_title !== false && slide.title) || 
                        slide.description || 
                        (slide.button_text && slide.button_link);

  // Get position classes based on text_position
  const getPositionClasses = (position: string = 'center') => {
    const positionMap = {
      'top-left': 'items-start justify-start',
      'top-center': 'items-start justify-center',
      'top-right': 'items-start justify-end',
      'center-left': 'items-center justify-start',
      'center': 'items-center justify-center',
      'center-right': 'items-center justify-end',
      'bottom-left': 'items-end justify-start',
      'bottom-center': 'items-end justify-center',
      'bottom-right': 'items-end justify-end'
    };
    return positionMap[position] || positionMap['center'];
  };

  // Get text alignment based on position
  const getTextAlignment = (position: string = 'center') => {
    if (position.includes('left')) return 'text-left';
    if (position.includes('right')) return 'text-right';
    return 'text-center';
  };

  return (
    <section className="relative w-full h-[30vh] sm:h-[45vh] md:h-[52vh] lg:h-[60vh] flex overflow-hidden">
      {/* Background Image or Video */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        {hasValidImage ? (
          <>
            <img
              src={backgroundImage}
              alt={slide.title}
              className="w-full h-full object-contain transition-all duration-1000"
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
                      ${hasTextContent ? '<div class="absolute inset-0 bg-black/50"></div>' : ''}
                    </div>
                  `;
                }
              }}
            />
            {hasTextContent && <div className="absolute inset-0 bg-black/50"></div>}
          </>
        ) : (
          // Fallback gradient background
          <div className="w-full h-full bg-gradient-to-br from-royal-600 via-royal-500 to-powder-500">
            {hasTextContent && <div className="absolute inset-0 bg-black/50"></div>}
          </div>
        )}
      </div>
      
      {/* YouTube Video Background (if applicable) */}
      {slide.youtube_url && slide.media_type === 'video' && (
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={`${slide.youtube_url}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
            className="w-full h-full object-cover"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          {hasTextContent && <div className="absolute inset-0 bg-black/50"></div>}
        </div>
      )}
      
      {/* Content with dynamic positioning */}
      {hasTextContent && (
        <div className={`relative z-10 w-full h-full flex ${getPositionClasses(slide.text_position)} p-6 sm:p-10`}>
          <div className={`text-white max-w-[90%] sm:max-w-4xl ${getTextAlignment(slide.text_position)}`}>
            {(slide.show_title !== false) && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 transition-all duration-500 leading-tight text-shadow-glass">
                {slide.title}
              </h1>
            )}
            {slide.description && (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 transition-all duration-500 leading-relaxed text-shadow-glass">
                {slide.description}
              </p>
            )}
            {slide.button_text && slide.button_link && (
              <div className={`flex gap-4 sm:gap-6 ${getTextAlignment(slide.text_position) === 'text-left' ? 'justify-start' : getTextAlignment(slide.text_position) === 'text-right' ? 'justify-end' : 'justify-center'}`}>
                <Button
                  asChild
                  size="lg"
                  className="glass-button-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
                >
                  <a
                    href={slide.button_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {slide.button_text}
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
