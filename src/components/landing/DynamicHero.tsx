
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  media_id?: string;
  youtube_url?: string;
  media_type?: string;
  visible: boolean;
  show_title?: boolean;
  slide_order: number;
}

interface MediaFile {
  id: string;
  file_url: string;
  title: string;
}

export function DynamicHero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [mediaFiles, setMediaFiles] = useState<Record<string, MediaFile>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const fetchHeroSlides = async () => {
    try {
      // Fetch hero slides
      const { data: slidesData, error: slidesError } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('visible', true)
        .eq('section_id', 'homepage-main')
        .order('slide_order', { ascending: true });

      if (slidesError) throw slidesError;

      if (slidesData && slidesData.length > 0) {
        setSlides(slidesData);

        // Fetch media files for slides that have media_id
        const mediaIds = slidesData
          .filter(slide => slide.media_id)
          .map(slide => slide.media_id);

        if (mediaIds.length > 0) {
          const { data: mediaData, error: mediaError } = await supabase
            .from('media_library')
            .select('id, file_url, title')
            .in('id', mediaIds);

          if (mediaError) throw mediaError;

          if (mediaData) {
            const mediaMap = mediaData.reduce((acc, media) => {
              acc[media.id] = media;
              return acc;
            }, {} as Record<string, MediaFile>);
            setMediaFiles(mediaMap);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  if (isLoading) {
    return (
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-gradient-to-br from-primary to-orange-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  // If no slides configured, show default hero
  if (slides.length === 0) {
    return (
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-gradient-to-br from-primary to-orange-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Spelman College Glee Club
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            To Amaze and Inspire
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Learn More
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Our Music
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const currentSlide = slides[currentIndex];
  const backgroundImage = currentSlide.media_id && mediaFiles[currentSlide.media_id] 
    ? mediaFiles[currentSlide.media_id].file_url 
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
      {currentSlide.youtube_url && currentSlide.media_type === 'video' && (
        <div className="absolute inset-0">
          <iframe
            src={`${currentSlide.youtube_url}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
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
        {(currentSlide.show_title !== false) && (
          <h1 className="text-4xl md:text-6xl font-bold mb-6 transition-all duration-500">
            {currentSlide.title}
          </h1>
        )}
        {currentSlide.description && (
          <p className="text-xl md:text-2xl mb-8 opacity-90 transition-all duration-500">
            {currentSlide.description}
          </p>
        )}
        {currentSlide.button_text && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => currentSlide.button_link && window.open(currentSlide.button_link, '_blank')}
            >
              {currentSlide.button_text}
            </Button>
          </div>
        )}
      </div>

      {/* Navigation arrows (only show if multiple slides) */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white border-none h-12 w-12"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white border-none h-12 w-12"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </section>
  );
}
