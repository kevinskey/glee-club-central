import React, { useEffect, useState } from "react";
import { useHeroSlides } from "@/hooks/useHeroSlides";
import { Button } from "@/components/ui/button";

interface SpacingSettings {
  topPadding: number;
  bottomPadding: number;
  leftPadding: number;
  rightPadding: number;
  topMargin: number;
  bottomMargin: number;
  minHeight: number;
  maxHeight: number;
}

const defaultSpacingSettings: SpacingSettings = {
  topPadding: 0,
  bottomPadding: 0,
  leftPadding: 0,
  rightPadding: 0,
  topMargin: 0,
  bottomMargin: 0,
  minHeight: 100,
  maxHeight: 100
};

export function HeroSlider() {
  const { visibleSlides, loading, error } = useHeroSlides('homepage-main');
  const [spacingSettings, setSpacingSettings] = useState<SpacingSettings>(defaultSpacingSettings);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Fallback images if no slides are configured
  const fallbackImages = [
    "/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png",
    "/lovable-uploads/1536a1d1-51f6-4121-8f53-423d37672f2e.png",
    "/lovable-uploads/312fd1a4-7f46-4000-8711-320383aa565a.png",
  ];

  // Determine which slides to use - prioritize database slides over fallback
  const actualSlides = visibleSlides.length > 0 ? visibleSlides : [];
  
  // Only use fallback if there are no visible slides from database AND we're not loading
  const shouldUseFallback = !loading && actualSlides.length === 0;
  
  const displaySlides = shouldUseFallback ? [
    {
      id: 'fallback-1',
      title: 'Spelman College Glee Club',
      description: 'To Amaze and Inspire',
      media_id: '',
      slide_order: 0,
      visible: true,
      section_id: 'homepage-main',
      created_at: '',
      updated_at: '',
      media: { 
        id: 'fallback',
        file_url: fallbackImages[0],
        title: 'Fallback Image',
        file_type: 'image/png'
      },
      button_text: 'Learn More',
      button_link: '/about',
      show_title: true,
      text_position: 'center',
      text_alignment: 'center'
    }
  ] : actualSlides;

  // Ensure currentSlideIndex is valid
  const validSlideIndex = Math.min(currentSlideIndex, displaySlides.length - 1);
  const currentSlide = displaySlides[validSlideIndex];

  // Check if current slide has any text content
  const hasTextContent = currentSlide && (
    (currentSlide.show_title !== false && currentSlide.title) ||
    currentSlide.description ||
    currentSlide.button_text
  );

  // Auto-advance slides
  useEffect(() => {
    if (displaySlides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % displaySlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [displaySlides.length]);

  // Reset slide index if slides change
  useEffect(() => {
    if (currentSlideIndex >= displaySlides.length) {
      setCurrentSlideIndex(0);
    }
  }, [displaySlides.length, currentSlideIndex]);

  console.log('Hero Slider Debug:', {
    loading,
    error,
    visibleSlidesCount: visibleSlides.length,
    actualSlidesCount: actualSlides.length,
    shouldUseFallback,
    displaySlidesCount: displaySlides.length,
    currentIndex: currentSlideIndex,
    validIndex: validSlideIndex,
    currentSlide: currentSlide?.title,
    media_url: currentSlide?.media?.file_url,
    youtube_url: currentSlide?.youtube_url,
    hasTextContent
  });

  if (loading) {
    return (
      <div className="w-full h-[200px] md:h-[400px] lg:h-[600px] bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading hero slides...</div>
      </div>
    );
  }

  if (error) {
    console.error('Hero slider error:', error);
  }

  if (!currentSlide) {
    return (
      <div className="w-full h-[200px] md:h-[400px] lg:h-[600px] bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">No slides available</div>
      </div>
    );
  }

  // Determine the background media source
  const getMediaSource = () => {
    if (currentSlide.media_type === 'video' && currentSlide.youtube_url) {
      return { type: 'video', url: currentSlide.youtube_url };
    }
    
    const imageUrl = currentSlide.media?.file_url || fallbackImages[0];
    return { type: 'image', url: imageUrl };
  };

  const mediaSource = getMediaSource();

  return (
    <section className="relative w-full h-[200px] md:h-[400px] lg:h-[600px] overflow-hidden">
      {/* Background Image or Video */}
      {mediaSource.type === 'video' ? (
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={mediaSource.url}
            className="w-full h-full border-0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={currentSlide.title}
          />
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={mediaSource.url}
            alt={currentSlide.title || 'Hero Image'} 
            className="w-full h-full object-contain md:object-cover object-center" 
            onError={(e) => {
              console.error('Hero image failed to load:', mediaSource.url);
              // Try fallback image
              if (e.currentTarget.src !== fallbackImages[0]) {
                e.currentTarget.src = fallbackImages[0];
              }
            }}
          />
        </div>
      )}
      
      {/* Conditional dark overlay for better text readability */}
      {hasTextContent && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      
      {/* Content */}
      {hasTextContent && (
        <div className={`absolute inset-0 flex items-center ${
          currentSlide.text_position === 'top' ? 'justify-start pt-8 sm:pt-12 md:pt-16 lg:pt-20' :
          currentSlide.text_position === 'bottom' ? 'justify-end pb-8 sm:pb-12 md:pb-16 lg:pb-20' :
          'justify-center'
        }`}>
          <div className={`text-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-6xl w-full ${
            currentSlide.text_alignment === 'left' ? 'text-left' :
            currentSlide.text_alignment === 'right' ? 'text-right' :
            'text-center'
          }`}>
            {currentSlide.show_title !== false && currentSlide.title && (
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 drop-shadow-lg leading-tight">
                {currentSlide.title}
              </h1>
            )}
            {currentSlide.description && (
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-6 sm:mb-8 md:mb-10 drop-shadow-lg max-w-4xl mx-auto leading-relaxed">
                {currentSlide.description}
              </p>
            )}
            {currentSlide.button_text && currentSlide.button_link && (
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-gray-100 font-semibold px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl lg:text-2xl"
              >
                <a href={currentSlide.button_link}>
                  {currentSlide.button_text}
                </a>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Slide indicators if multiple slides */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {displaySlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                index === validSlideIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => setCurrentSlideIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
          <div>DB Slides: {visibleSlides.length}</div>
          <div>Display: {displaySlides.length}</div>
          <div>Current: {validSlideIndex + 1}</div>
          <div>Fallback: {shouldUseFallback ? 'Yes' : 'No'}</div>
          <div>Has Text: {hasTextContent ? 'Yes' : 'No'}</div>
          <div>Media: {mediaSource.type}</div>
        </div>
      )}
    </section>
  );
}
