
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
      console.log('useHeroData: Starting to fetch hero slides...');
      
      // Fetch hero slides
      const { data: slidesData, error: slidesError } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('visible', true)
        .eq('section_id', 'homepage-main')
        .order('slide_order', { ascending: true });

      if (slidesError) {
        console.error('useHeroData: Error fetching slides:', slidesError);
        setSlides([]);
        setIsLoading(false);
        return;
      }

      console.log('useHeroData: Fetched slides:', slidesData?.length || 0);

      if (slidesData && slidesData.length > 0) {
        setSlides(slidesData);

        // Get unique media IDs from slides that have them
        const mediaIds = [...new Set(
          slidesData
            .filter(slide => slide.media_id)
            .map(slide => slide.media_id)
        )];

        console.log('useHeroData: Media IDs to fetch:', mediaIds);

        if (mediaIds.length > 0) {
          // First try media_library table
          const { data: mediaData, error: mediaError } = await supabase
            .from('media_library')
            .select('id, file_url, title')
            .in('id', mediaIds);

          let mediaMap: Record<string, MediaFile> = {};

          if (mediaError) {
            console.error('useHeroData: Error fetching from media_library:', mediaError);
          } else if (mediaData && mediaData.length > 0) {
            mediaMap = mediaData.reduce((acc, media) => {
              acc[media.id] = {
                id: media.id,
                file_url: media.file_url,
                title: media.title
              };
              return acc;
            }, {} as Record<string, MediaFile>);
            
            console.log('useHeroData: Media map created from media_library:', Object.keys(mediaMap).length, 'files');
          }

          // If we didn't get all media files, try site_images for the missing ones
          const missingIds = mediaIds.filter(id => !mediaMap[id]);
          
          if (missingIds.length > 0) {
            console.log('useHeroData: Trying site_images for missing IDs:', missingIds);
            
            const { data: siteImagesData, error: siteImagesError } = await supabase
              .from('site_images')
              .select('id, file_url, name')
              .in('id', missingIds);

            if (siteImagesError) {
              console.error('useHeroData: Error fetching from site_images:', siteImagesError);
            } else if (siteImagesData && siteImagesData.length > 0) {
              const siteImagesMap = siteImagesData.reduce((acc, media) => {
                acc[media.id] = {
                  id: media.id,
                  file_url: media.file_url,
                  title: media.name
                };
                return acc;
              }, {} as Record<string, MediaFile>);
              
              // Merge with existing media map
              mediaMap = { ...mediaMap, ...siteImagesMap };
              console.log('useHeroData: Added from site_images, total media files:', Object.keys(mediaMap).length);
            }
          }

          console.log('useHeroData: Final media map keys:', Object.keys(mediaMap));
          setMediaFiles(mediaMap);
        } else {
          console.log('useHeroData: No media IDs found in slides');
          setMediaFiles({});
        }
      } else {
        console.log('useHeroData: No visible hero slides found, will show default');
        setSlides([]);
        setMediaFiles({});
      }
    } catch (error) {
      console.error('useHeroData: Error in fetchHeroSlides:', error);
      setSlides([]);
      setMediaFiles({});
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
