
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
      console.log('useHeroData: Fetching hero slides...');
      
      // Fetch hero slides
      const { data: slidesData, error: slidesError } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('visible', true)
        .eq('section_id', 'homepage-main')
        .order('slide_order', { ascending: true });

      if (slidesError) {
        console.error('useHeroData: Error fetching slides:', slidesError);
        throw slidesError;
      }

      console.log('useHeroData: Fetched slides:', slidesData);

      if (slidesData && slidesData.length > 0) {
        setSlides(slidesData);

        // Fetch media files for slides that have media_id
        const mediaIds = slidesData
          .filter(slide => slide.media_id)
          .map(slide => slide.media_id);

        console.log('useHeroData: Media IDs to fetch:', mediaIds);

        if (mediaIds.length > 0) {
          const { data: mediaData, error: mediaError } = await supabase
            .from('media_library')
            .select('id, file_url, title')
            .in('id', mediaIds);

          if (mediaError) {
            console.error('useHeroData: Error fetching media:', mediaError);
            throw mediaError;
          }

          console.log('useHeroData: Fetched media data:', mediaData);

          if (mediaData) {
            const mediaMap = mediaData.reduce((acc, media) => {
              acc[media.id] = media;
              return acc;
            }, {} as Record<string, MediaFile>);
            
            console.log('useHeroData: Media map created:', mediaMap);
            setMediaFiles(mediaMap);
          }
        } else {
          console.warn('useHeroData: No media IDs found in slides - slides may not have background images');
        }
      } else {
        console.log('useHeroData: No visible hero slides found');
      }
    } catch (error) {
      console.error('useHeroData: Error in fetchHeroSlides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    slides,
    mediaFiles,
    currentIndex,
    isLoading,
    refetch: fetchHeroSlides
  };
}
