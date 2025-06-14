
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

          // Final check - if we still don't have media files, let's see what's available
          if (Object.keys(mediaMap).length === 0) {
            console.warn('useHeroData: No media files found for any IDs. Let me check what media exists...');
            
            // Debug: Check what's actually in the media_library table
            const { data: allMedia, error: allMediaError } = await supabase
              .from('media_library')
              .select('id, title, file_url')
              .limit(10);
              
            if (allMediaError) {
              console.error('useHeroData: Error checking available media:', allMediaError);
            } else {
              console.log('useHeroData: Sample media files available:', allMedia?.map(m => ({ id: m.id, title: m.title })));
            }

            // Also check site_images
            const { data: allSiteImages, error: allSiteError } = await supabase
              .from('site_images')
              .select('id, name, file_url')
              .limit(10);
              
            if (allSiteError) {
              console.error('useHeroData: Error checking available site images:', allSiteError);
            } else {
              console.log('useHeroData: Sample site images available:', allSiteImages?.map(i => ({ id: i.id, name: i.name })));
            }
          }

          console.log('useHeroData: Final media map with', Object.keys(mediaMap).length, 'files');
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
