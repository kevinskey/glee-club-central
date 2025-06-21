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
  const { visibleSlides, loading } = useHeroSlides('homepage-main');
  const [spacingSettings, setSpacingSettings] = useState<SpacingSettings>(defaultSpacingSettings);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Fallback images if no slides are configured
  const fallbackImages = [
    "/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png",
    "/lovable-uploads/1536a1d1-51f6-4121-8f53-423d37672f2e.png",
    "/lovable-uploads/312fd1a4-7f46-4000-8711-320383aa565a.png",
  ];

  // Use visible slides from database, or fallback slides
  const slides = visibleSlides.length > 0 ? visibleSlides : [
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
      button_link: '/about'
    }
  ];

  const currentSlide = slides[currentSlideIndex];

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  console.log('Hero: Displaying slides:', {
    totalSlides: slides.length,
    currentIndex: currentSlideIndex,
    currentSlide: currentSlide?.title,
    media_url: currentSlide?.media?.file_url,
    youtube_url: currentSlide?.youtube_url
  });

  if (loading) {
    return (
      <div className="w-full min-h-[215px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading hero...</div>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-[215px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background Image or Video */}
      {currentSlide.media_type === 'video' && currentSlide.youtube_url ? (
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={currentSlide.youtube_url}
            className="w-full h-full border-0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={currentSlide.media?.file_url || fallbackImages[0]} 
            alt={currentSlide.title || 'Hero Image'} 
            className="w-full h-full object-contain sm:object-cover object-center" 
            style={{
              width: '100%',
              height: '100%'
            }}
            onError={(e) => {
              console.error('Hero image failed to load:', currentSlide.media?.file_url);
              e.currentTarget.src = fallbackImages[0];
            }}
          />
        </div>
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      {(currentSlide.title || currentSlide.description || currentSlide.button_text) && (
        <div className={`absolute inset-0 flex items-center ${
          currentSlide.text_position === 'top' ? 'justify-start pt-8 sm:pt-12 md:pt-16' :
          currentSlide.text_position === 'bottom' ? 'justify-end pb-8 sm:pb-12 md:pb-16' :
          'justify-center'
        }`}>
          <div className={`text-white px-4 sm:px-6 md:px-8 max-w-4xl w-full ${
            currentSlide.text_alignment === 'left' ? 'text-left' :
            currentSlide.text_alignment === 'right' ? 'text-right' :
            'text-center'
          }`}>
            {currentSlide.show_title !== false && currentSlide.title && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 drop-shadow-lg">
                {currentSlide.title}
              </h1>
            )}
            {currentSlide.description && (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 drop-shadow-lg max-w-3xl mx-auto">
                {currentSlide.description}
              </p>
            )}
            {currentSlide.button_text && currentSlide.button_link && (
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-gray-100 font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg"
              >
                <a href={currentSlide.button_link}>
                  {currentSlide.button_text}
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
