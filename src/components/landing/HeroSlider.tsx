
import React, { useEffect, useState } from "react";
import { useHeroSlides } from "@/hooks/useHeroSlides";
import { Button } from "@/components/ui/button";

export function HeroSlider() {
  const { visibleSlides, loading, error } = useHeroSlides('homepage-main');
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

  // Ensure currentSlideIndex is always valid
  const validSlideIndex = Math.max(0, Math.min(currentSlideIndex, displaySlides.length - 1));
  const currentSlide = displaySlides[validSlideIndex];

  // Reset slide index when slides change to prevent accessing invalid indices
  useEffect(() => {
    if (displaySlides.length > 0 && currentSlideIndex >= displaySlides.length) {
      setCurrentSlideIndex(0);
    }
  }, [displaySlides.length, currentSlideIndex]);

  // Auto-advance slides
  useEffect(() => {
    if (displaySlides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % displaySlides.length);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [displaySlides.length]);

  if (loading) {
    return (
      <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading hero slides...</div>
      </section>
    );
  }

  if (error) {
    console.error('Hero slider error:', error);
    return (
      <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Unable to load hero content</div>
      </section>
    );
  }

  if (!currentSlide) {
    return (
      <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">No slides available</div>
      </section>
    );
  }

  // Check if current slide has any text content
  const hasTextContent = currentSlide && (
    (currentSlide.show_title !== false && currentSlide.title) ||
    currentSlide.description ||
    currentSlide.button_text
  );

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
    <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
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
            className="w-full h-full object-cover object-center" 
            onError={(e) => {
              console.error('Hero image failed to load:', mediaSource.url);
              if (e.currentTarget.src !== fallbackImages[0]) {
                e.currentTarget.src = fallbackImages[0];
              }
            }}
            onLoad={() => {
              console.log('Hero image loaded successfully:', mediaSource.url);
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
        <div className={`absolute inset-0 flex items-center z-10 ${
          currentSlide.text_position === 'top' ? 'justify-start pt-16' :
          currentSlide.text_position === 'bottom' ? 'justify-end pb-16' :
          'justify-center'
        }`}>
          <div className={`text-white px-8 lg:px-16 max-w-6xl w-full ${
            currentSlide.text_alignment === 'left' ? 'text-left' :
            currentSlide.text_alignment === 'right' ? 'text-right' :
            'text-center'
          }`}>
            {currentSlide.show_title !== false && currentSlide.title && (
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg leading-tight">
                {currentSlide.title}
              </h1>
            )}
            {currentSlide.description && (
              <p className="text-lg md:text-2xl lg:text-3xl mb-8 drop-shadow-lg max-w-4xl mx-auto leading-relaxed">
                {currentSlide.description}
              </p>
            )}
            {currentSlide.button_text && currentSlide.button_link && (
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-4 text-lg shadow-lg"
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
