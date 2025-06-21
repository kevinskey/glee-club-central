
import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useHeroSlides } from "@/hooks/useHeroSlides";
import { supabase } from "@/integrations/supabase/client";

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

  // Load spacing settings
  useEffect(() => {
    const loadSpacingSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_settings')
          .select('spacing_settings')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading spacing settings:', error);
          return;
        }

        if (data?.spacing_settings) {
          setSpacingSettings({ ...defaultSpacingSettings, ...data.spacing_settings });
        }
      } catch (error) {
        console.error('Error loading spacing settings:', error);
      }
    };

    loadSpacingSettings();
  }, []);

  // Fallback images if no slides are configured
  const fallbackImages = [
    "/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png",
    "/lovable-uploads/1536a1d1-51f6-4121-8f53-423d37672f2e.png",
    "/lovable-uploads/312fd1a4-7f46-4000-8711-320383aa565a.png",
  ];

  const displaySlides = visibleSlides.length > 0 ? visibleSlides : fallbackImages.map((src, index) => ({
    id: `fallback-${index}`,
    title: `Slide ${index + 1}`,
    description: '',
    media_id: '',
    slide_order: index,
    visible: true,
    section_id: 'homepage-main',
    created_at: '',
    updated_at: '',
    media: { 
      id: `fallback-${index}`,
      file_url: src,
      title: `Fallback Image ${index + 1}`,
      file_type: 'image/png'
    }
  }));

  if (loading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading slides...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <Carousel className="w-full h-full" opts={{ loop: true }} showArrows>
        <CarouselContent className="h-full">
          {displaySlides.map((slide, idx) => (
            <CarouselItem key={slide.id} className="relative w-full h-full">
              {slide.media_type === 'video' && slide.youtube_url ? (
                <iframe
                  src={slide.youtube_url}
                  className="w-full h-full object-cover"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img 
                  src={slide.media?.file_url || fallbackImages[0]} 
                  alt={slide.title || `Slide ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                />
              )}
              
              {/* Text Overlay */}
              {(slide.title || slide.description || slide.button_text) && (
                <div className={`absolute inset-0 bg-black/30 flex items-center ${
                  slide.text_position === 'top' ? 'justify-start pt-16' :
                  slide.text_position === 'bottom' ? 'justify-end pb-16' :
                  'justify-center'
                }`}>
                  <div className={`text-white px-4 max-w-4xl ${
                    slide.text_alignment === 'left' ? 'text-left' :
                    slide.text_alignment === 'right' ? 'text-right' :
                    'text-center'
                  }`}>
                    {slide.show_title !== false && slide.title && (
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                        {slide.title}
                      </h2>
                    )}
                    {slide.description && (
                      <p className="text-lg md:text-xl lg:text-2xl mb-6 drop-shadow-lg">
                        {slide.description}
                      </p>
                    )}
                    {slide.button_text && slide.button_link && (
                      <a
                        href={slide.button_link}
                        className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        {slide.button_text}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white" />
        <CarouselNext className="right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white" />
      </Carousel>
    </div>
  );
}
