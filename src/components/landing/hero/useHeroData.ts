
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
      }, 8000);

      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const fetchHeroSlides = async () => {
    try {
      if (!supabase) {
        setSlides([]);
        setMediaFiles({});
        setIsLoading(false);
        return;
      }
      
      // Fetch hero slides
      const { data: slidesData, error: slidesError } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('visible', true)
        .eq('section_id', 'homepage-main')
        .order('slide_order', { ascending: true });

      if (slidesError) {
        throw slidesError;
      }

      if (slidesData && slidesData.length > 0) {
        setSlides(slidesData);

        // Fetch media files for slides that have media_id
        const mediaIds = slidesData
          .filter(slide => slide.media_id)
          .map(slide => slide.media_id);

        if (mediaIds.length > 0) {
          let foundMedia: MediaFile[] = [];

          // Try media_library table first
          const { data: mediaLibraryData } = await supabase
            .from('media_library')
            .select('id, file_url, title')
            .in('id', mediaIds);

          if (mediaLibraryData && mediaLibraryData.length > 0) {
            foundMedia = mediaLibraryData.filter(item => item.file_url);
          }

          // If no media found in media_library, try site_images
          if (foundMedia.length === 0) {
            const { data: siteImagesData } = await supabase
              .from('site_images')
              .select('id, file_url, name')
              .in('id', mediaIds);

            if (siteImagesData && siteImagesData.length > 0) {
              foundMedia = siteImagesData
                .filter(item => item.file_url)
                .map(item => ({
                  id: item.id,
                  file_url: item.file_url,
                  title: item.name || 'Untitled'
                }));
            }
          }

          // If still no media found, try products table
          if (foundMedia.length === 0) {
            const { data: productData } = await supabase
              .from('products')
              .select('id, image_url, name')
              .in('id', mediaIds)
              .not('image_url', 'is', null);

            if (productData && productData.length > 0) {
              foundMedia = productData
                .filter(item => item.image_url)
                .map(item => ({
                  id: item.id,
                  file_url: item.image_url,
                  title: item.name || 'Untitled'
                }));
            }
          }

          // Create media map from found media
          if (foundMedia.length > 0) {
            const mediaMap = foundMedia.reduce((acc, media) => {
              if (media.file_url) {
                acc[media.id] = media;
              }
              return acc;
            }, {} as Record<string, MediaFile>);
            setMediaFiles(mediaMap);
          } else {
            setMediaFiles({});
          }
        } else {
          setMediaFiles({});
        }
      } else {
        setSlides([]);
        setMediaFiles({});
      }
    } catch (error) {
      // On error, show default hero
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
