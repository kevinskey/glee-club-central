
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
        console.log('🎯 SimpleHero: No slides found');
        setSlides([]);
        return;
      }

      console.log('🎯 SimpleHero: Found slides:', slidesData);

      // Transform slides to SimpleHeroSlide format
      const transformedSlides: SimpleHeroSlide[] = [];

      for (const slide of slidesData) {
        let imageUrl: string | undefined = undefined;

        // If slide has media_id, try to fetch the media file
        if (slide.media_id) {
          console.log('🎯 SimpleHero: Checking media for slide:', slide.title, 'media_id:', slide.media_id);
          
          try {
            const { data: mediaFile, error: mediaError } = await supabase
              .from('media_library')
              .select('file_url')
              .eq('id', slide.media_id)
              .eq('is_public', true)
              .maybeSingle();

            if (mediaError) {
              console.warn('🎯 SimpleHero: Media fetch error for slide:', slide.title, mediaError);
            } else if (mediaFile?.file_url) {
              imageUrl = mediaFile.file_url;
              console.log('🎯 SimpleHero: ✅ Found media URL for slide:', slide.title);
            } else {
              console.log('🎯 SimpleHero: ⚠️ No media found for slide:', slide.title, '- will use gradient');
            }
          } catch (err) {
            console.warn('🎯 SimpleHero: Exception fetching media for slide:', slide.title, err);
          }
        } else {
          console.log('🎯 SimpleHero: No media_id for slide:', slide.title, '- will use gradient');
        }

        transformedSlides.push({
          id: slide.id,
          title: slide.title || 'Spelman College Glee Club',
          description: slide.description || 'A distinguished ensemble with a rich heritage of musical excellence',
          imageUrl,
          buttonText: slide.button_text || undefined,
          buttonLink: slide.button_link || undefined,
          textPosition: (slide.text_position || 'center') as 'top' | 'center' | 'bottom',
          textAlignment: (slide.text_alignment || 'center') as 'left' | 'center' | 'right'
        });
      }

      console.log('🎯 SimpleHero: Final transformed slides:', transformedSlides);
      setSlides(transformedSlides);

    } catch (error) {
      console.error('🎯 SimpleHero: Error fetching hero data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load hero data');
      setSlides([]);
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
