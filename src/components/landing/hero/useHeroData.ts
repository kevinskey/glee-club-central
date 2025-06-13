
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HeroSlide, MediaFile } from './types';

export function useHeroData() {
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

  return {
    slides,
    mediaFiles,
    currentIndex,
    isLoading
  };
}
