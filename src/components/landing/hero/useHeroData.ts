
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
          // First try media_library table
          let { data: mediaData, error: mediaError } = await supabase
            .from('media_library')
            .select('id, file_url, title')
            .in('id', mediaIds);

          if (mediaError) {
            console.error('useHeroData: Error fetching from media_library:', mediaError);
          }

          // If no results from media_library, try site_images table
          if (!mediaData || mediaData.length === 0) {
            console.log('useHeroData: No media found in media_library, trying site_images...');
            const { data: siteImagesData, error: siteImagesError } = await supabase
              .from('site_images')
              .select('id, file_url, name')
              .in('id', mediaIds);

            if (siteImagesError) {
              console.error('useHeroData: Error fetching from site_images:', siteImagesError);
            } else if (siteImagesData) {
              // Map site_images data to match MediaFile interface
              mediaData = siteImagesData.map(item => ({
                id: item.id,
                file_url: item.file_url,
                title: item.name || 'Untitled'
              }));
              console.log('useHeroData: Found media in site_images:', mediaData);
            }
          }

          // If still no results, try products table (for product images)
          if (!mediaData || mediaData.length === 0) {
            console.log('useHeroData: No media found in site_images, trying products...');
            const { data: productData, error: productError } = await supabase
              .from('products')
              .select('id, image_url, name')
              .in('id', mediaIds)
              .not('image_url', 'is', null);

            if (productError) {
              console.error('useHeroData: Error fetching from products:', productError);
            } else if (productData) {
              // Map products data to match MediaFile interface
              mediaData = productData.map(item => ({
                id: item.id,
                file_url: item.image_url,
                title: item.name || 'Untitled'
              }));
              console.log('useHeroData: Found media in products:', mediaData);
            }
          }

          if (mediaData && mediaData.length > 0) {
            const mediaMap = mediaData.reduce((acc, media) => {
              if (media.file_url) {
                acc[media.id] = media;
              }
              return acc;
            }, {} as Record<string, MediaFile>);
            
            console.log('useHeroData: Media map created:', mediaMap);
            setMediaFiles(mediaMap);
          } else {
            console.warn('useHeroData: No media files found in any table');
            
            // Debug: Let's check what's actually in the media_library table
            const { data: allMedia, error: allMediaError } = await supabase
              .from('media_library')
              .select('id, title, file_url')
              .limit(10);
            
            console.log('useHeroData: Debug - Sample media_library entries:', allMedia);
            if (allMediaError) {
              console.error('useHeroData: Debug - Error fetching sample media:', allMediaError);
            }
          }
        } else {
          console.warn('useHeroData: No media IDs found in slides - slides may not have background images');
        }
      } else {
        console.log('useHeroData: No visible hero slides found, will show default hero');
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
