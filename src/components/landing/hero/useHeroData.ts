
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
        // Get unique media IDs from slides that have them
        const mediaIds = [...new Set(
          slidesData
            .filter(slide => slide.media_id)
            .map(slide => slide.media_id)
        )];

        console.log('useHeroData: Media IDs to fetch:', mediaIds);

        if (mediaIds.length > 0) {
          let mediaMap: Record<string, MediaFile> = {};

          // Try media_library first
          try {
            const { data: mediaData, error: mediaError } = await supabase
              .from('media_library')
              .select('id, file_url, title')
              .in('id', mediaIds);

            if (mediaError) {
              console.error('useHeroData: Error fetching from media_library:', mediaError);
            } else if (mediaData && mediaData.length > 0) {
              console.log('useHeroData: Found media files in media_library:', mediaData.length);
              mediaData.forEach(media => {
                mediaMap[media.id] = {
                  id: media.id,
                  file_url: media.file_url,
                  title: media.title
                };
              });
            }
          } catch (error) {
            console.error('useHeroData: Exception fetching from media_library:', error);
          }

          // Try site_images for any missing media files
          const missingIds = mediaIds.filter(id => !mediaMap[id]);
          
          if (missingIds.length > 0) {
            console.log('useHeroData: Trying site_images for missing IDs:', missingIds);
            
            try {
              const { data: siteImagesData, error: siteImagesError } = await supabase
                .from('site_images')
                .select('id, file_url, name')
                .in('id', missingIds);

              if (siteImagesError) {
                console.error('useHeroData: Error fetching from site_images:', siteImagesError);
              } else if (siteImagesData && siteImagesData.length > 0) {
                console.log('useHeroData: Found media files in site_images:', siteImagesData.length);
                siteImagesData.forEach(media => {
                  mediaMap[media.id] = {
                    id: media.id,
                    file_url: media.file_url,
                    title: media.name
                  };
                });
              }
            } catch (error) {
              console.error('useHeroData: Exception fetching from site_images:', error);
            }
          }

          console.log('useHeroData: Final media map with', Object.keys(mediaMap).length, 'files');
          setMediaFiles(mediaMap);

          // Filter out slides that don't have valid media files
          const validSlides = slidesData.filter(slide => {
            if (!slide.media_id) return false; // Slide needs a media_id
            return mediaMap[slide.media_id]; // Media file must exist
          });

          console.log('useHeroData: Valid slides with media:', validSlides.length);

          if (validSlides.length > 0) {
            setSlides(validSlides);
          } else {
            console.log('useHeroData: No valid slides with media found, showing empty');
            setSlides([]);
          }
        } else {
          console.log('useHeroData: No media IDs found in slides, showing empty');
          setSlides([]);
          setMediaFiles({});
        }
      } else {
        console.log('useHeroData: No visible hero slides found');
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
