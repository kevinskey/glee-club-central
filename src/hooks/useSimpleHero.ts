
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SimpleHeroSlide {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  textPosition: 'top' | 'center' | 'bottom';
  textAlignment: 'left' | 'center' | 'right';
}

export function useSimpleHero(sectionId: string = 'homepage-main') {
  const [slides, setSlides] = useState<SimpleHeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlides = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🎯 SimpleHero: Fetching slides for section:', sectionId);
      
      // Fetch slides from hero_slides table
      const { data: slidesData, error: slidesError } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('section_id', sectionId)
        .eq('visible', true)
        .order('slide_order', { ascending: true });

      if (slidesError) {
        console.error('🎯 SimpleHero: Error fetching slides:', slidesError);
        throw slidesError;
      }

      if (!slidesData || slidesData.length === 0) {
        console.log('🎯 SimpleHero: No slides found, using defaults');
        setSlides([]);
        return;
      }

      // Get media files for slides that have media_id
      const mediaIds = slidesData
        .filter(slide => slide.media_id)
        .map(slide => slide.media_id);

      let mediaFiles = [];
      if (mediaIds.length > 0) {
        const { data: mediaData, error: mediaError } = await supabase
          .from('media_library')
          .select('id, file_url, title')
          .in('id', mediaIds)
          .eq('is_public', true);

        if (!mediaError && mediaData) {
          mediaFiles = mediaData;
        }
      }

      // Transform slides to SimpleHeroSlide format
      const transformedSlides: SimpleHeroSlide[] = slidesData.map(slide => {
        const mediaFile = slide.media_id 
          ? mediaFiles.find(m => m.id === slide.media_id)
          : null;

        return {
          id: slide.id,
          title: slide.title || 'Spelman College Glee Club',
          description: slide.description || 'A distinguished ensemble with a rich heritage of musical excellence',
          imageUrl: mediaFile?.file_url,
          buttonText: slide.button_text || undefined,
          buttonLink: slide.button_link || undefined,
          textPosition: slide.text_position as 'top' | 'center' | 'bottom',
          textAlignment: slide.text_alignment as 'left' | 'center' | 'right'
        };
      });

      console.log('🎯 SimpleHero: Transformed slides:', transformedSlides);
      setSlides(transformedSlides);

    } catch (error) {
      console.error('🎯 SimpleHero: Error fetching hero data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load hero data');
      setSlides([]); // Use empty array to show default content
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, [sectionId]);

  return {
    slides,
    isLoading,
    error,
    refetch: fetchSlides
  };
}
