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
      }, 8000); // Changed from 5000 to 8000 (8 seconds)

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
          let foundMedia: MediaFile[] = [];

          // Try media_library table first
          console.log('useHeroData: Searching media_library table...');
          const { data: mediaLibraryData, error: mediaLibraryError } = await supabase
            .from('media_library')
            .select('id, file_url, title')
            .in('id', mediaIds);

          if (mediaLibraryError) {
            console.error('useHeroData: Error fetching media_library:', mediaLibraryError);
          } else if (mediaLibraryData && mediaLibraryData.length > 0) {
            foundMedia = mediaLibraryData.filter(item => item.file_url);
            console.log('useHeroData: Found media in media_library:', foundMedia);
          }

          // If no media found in media_library, try site_images
          if (foundMedia.length === 0) {
            console.log('useHeroData: Searching site_images table...');
            const { data: siteImagesData, error: siteImagesError } = await supabase
              .from('site_images')
              .select('id, file_url, name')
              .in('id', mediaIds);

            if (siteImagesError) {
              console.error('useHeroData: Error fetching site_images:', siteImagesError);
            } else if (siteImagesData && siteImagesData.length > 0) {
              foundMedia = siteImagesData
                .filter(item => item.file_url)
                .map(item => ({
                  id: item.id,
                  file_url: item.file_url,
                  title: item.name || 'Untitled'
                }));
              console.log('useHeroData: Found media in site_images:', foundMedia);
            }
          }

          // If still no media found, try products table
          if (foundMedia.length === 0) {
            console.log('useHeroData: Searching products table...');
            const { data: productData, error: productError } = await supabase
              .from('products')
              .select('id, image_url, name')
              .in('id', mediaIds)
              .not('image_url', 'is', null);

            if (productError) {
              console.error('useHeroData: Error fetching products:', productError);
            } else if (productData && productData.length > 0) {
              foundMedia = productData
                .filter(item => item.image_url)
                .map(item => ({
                  id: item.id,
                  file_url: item.image_url,
                  title: item.name || 'Untitled'
                }));
              console.log('useHeroData: Found media in products:', foundMedia);
            }
          }

          // If still no media found, let's debug what's in each table
          if (foundMedia.length === 0) {
            console.warn('useHeroData: No media found in any table. Running debug queries...');
            
            // Debug: Check what's actually in media_library
            const { data: allMediaLibrary } = await supabase
              .from('media_library')
              .select('id, title, file_url')
              .limit(5);
            console.log('useHeroData: Sample media_library entries:', allMediaLibrary);

            // Debug: Check what's actually in site_images
            const { data: allSiteImages } = await supabase
              .from('site_images')
              .select('id, name, file_url')
              .limit(5);
            console.log('useHeroData: Sample site_images entries:', allSiteImages);

            // Debug: Check what's actually in products
            const { data: allProducts } = await supabase
              .from('products')
              .select('id, name, image_url')
              .not('image_url', 'is', null)
              .limit(5);
            console.log('useHeroData: Sample products entries:', allProducts);

            // Final attempt: Try broader search for the specific media IDs
            for (const mediaId of mediaIds) {
              console.log(`useHeroData: Searching all tables for media ID: ${mediaId}`);
              
              const { data: specificMedia } = await supabase
                .from('media_library')
                .select('*')
                .eq('id', mediaId);
              
              if (specificMedia && specificMedia.length > 0) {
                console.log(`useHeroData: Found in media_library:`, specificMedia[0]);
              } else {
                console.log(`useHeroData: Media ID ${mediaId} not found in media_library`);
              }
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
            
            console.log('useHeroData: Final media map created:', mediaMap);
            setMediaFiles(mediaMap);
          } else {
            console.warn('useHeroData: No media files found for any media IDs');
            setMediaFiles({});
          }
        } else {
          console.warn('useHeroData: No media IDs found in slides');
          setMediaFiles({});
        }
      } else {
        console.log('useHeroData: No visible hero slides found, will show default hero');
        setSlides([]);
        setMediaFiles({});
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
