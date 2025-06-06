
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { getResponsiveHeightClass, getTextPositionClass, getTextAlignmentClass } from '@/utils/heroUtils';

interface SlideData {
  id: string;
  title: string;
  description?: string;
  background_image_url?: string;
  background_color?: string;
  link_url?: string;
  design_data?: {
    buttonText?: string;
    textPosition?: 'top' | 'center' | 'bottom';
    textAlignment?: 'left' | 'center' | 'right';
    showText?: boolean;
    height?: 'tiny' | 'small' | 'medium' | 'full' | 'large';
    objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
    objectPosition?: string;
    overlayOpacity?: number;
  };
}

interface HeroSlideProps {
  slide: SlideData;
}

export function HeroSlide({ slide }: HeroSlideProps) {
  const handleSlideClick = useCallback(() => {
    if (slide.link_url) {
      window.open(slide.link_url, '_blank');
    }
  }, [slide.link_url]);

  const showTextOverlay = slide.design_data?.showText !== false && 
    (slide.title || slide.description || slide.design_data?.buttonText);

  const objectFit = slide.design_data?.objectFit || 'contain';
  const objectPosition = slide.design_data?.objectPosition || 'center center';
  const overlayOpacity = slide.design_data?.overlayOpacity || 20;

  return (
    <div className="w-full">
      <div 
        className={`relative w-full ${getResponsiveHeightClass(slide.design_data?.height)} overflow-hidden cursor-pointer flex items-center justify-center`}
        onClick={handleSlideClick}
      >
        {/* Background */}
        {slide.background_image_url ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <img
              src={slide.background_image_url}
              alt={slide.title || 'Hero slide'}
              className="w-full h-full object-contain"
              style={{ 
                objectPosition: objectPosition,
                objectFit: objectFit
              }}
              loading="eager"
              decoding="async"
              onError={(e) => {
                console.log('🚨 HeroSection: Image failed to load');
                e.currentTarget.style.display = 'none';
              }}
            />
            {showTextOverlay && (
              <div 
                className="absolute inset-0 bg-black" 
                style={{ opacity: overlayOpacity / 100 }}
              />
            )}
          </div>
        ) : (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: slide.background_color || '#4F46E5' }}
          />
        )}

        {/* Content */}
        {showTextOverlay && (
          <div className={`relative h-full flex ${getTextPositionClass(slide.design_data?.textPosition)} justify-center px-4 z-10`}>
            <div className={`max-w-4xl mx-auto text-white ${getTextAlignmentClass(slide.design_data?.textAlignment)} space-y-2 sm:space-y-3 md:space-y-4`}>
              {slide.title && (
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
              )}
              
              {slide.description && (
                <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                  {slide.description}
                </p>
              )}

              {slide.design_data?.buttonText && slide.link_url && (
                <div className="pt-2 sm:pt-3">
                  <Button 
                    size="default"
                    className="bg-white text-gray-900 hover:bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 shadow-lg text-sm sm:text-base font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(slide.link_url, '_blank');
                    }}
                  >
                    {slide.design_data.buttonText}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
