
import React from 'react';
import { Button } from '@/components/ui/button';
import { getTextPositionClass, getTextAlignmentClass } from '@/utils/heroUtils';

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
  const handleClick = () => {
    if (slide.link_url) {
      if (slide.link_url.startsWith('http')) {
        window.open(slide.link_url, '_blank');
      } else {
        window.location.href = slide.link_url;
      }
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden cursor-pointer flex items-center justify-center"
      onClick={handleClick}
    >
      {/* Background */}
      {slide.background_image_url ? (
        <div className="absolute inset-0">
          <img
            src={slide.background_image_url}
            alt={slide.title}
            className="w-full h-full object-cover"
            style={{ 
              objectPosition: slide.design_data?.objectPosition || 'center center'
            }}
          />
          {slide.design_data?.showText !== false && (
            <div 
              className="absolute inset-0 bg-black" 
              style={{ opacity: (slide.design_data?.overlayOpacity || 20) / 100 }}
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
      {slide.design_data?.showText !== false && (
        <div className={`relative z-10 h-full flex ${getTextPositionClass(slide.design_data?.textPosition)} justify-center`}>
          <div className={`max-w-4xl mx-auto text-white ${getTextAlignmentClass(slide.design_data?.textAlignment)} space-y-2 md:space-y-4 px-4`}>
            {slide.title && (
              <h1 className="text-lg md:text-2xl lg:text-4xl font-bold leading-tight drop-shadow-lg">
                {slide.title}
              </h1>
            )}
            
            {slide.description && (
              <p className="text-sm md:text-base lg:text-lg opacity-90 leading-relaxed drop-shadow-md">
                {slide.description}
              </p>
            )}

            {slide.design_data?.buttonText && slide.link_url && (
              <div className="pt-2">
                <Button 
                  size="sm"
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  {slide.design_data.buttonText}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
