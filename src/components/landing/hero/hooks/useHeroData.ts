
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HeroSlide, HeroSettings, MediaFile } from '../types';

export function useHeroData(sectionId: string) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🎭 Hero: Fetching data for section:', sectionId);
      
      // Fetch slides without automatic cleanup to prevent loops
      const [slidesResult, settingsResult, mediaResult] = await Promise.all([
        supabase
          .from('hero_slides')
          .select('*')
          .eq('section_id', sectionId)
          .eq('visible', true)
          .order('slide_order', { ascending: true }),
        supabase
          .from('hero_settings')
          .select('*')
          .limit(1)
          .single(),
        supabase
          .from('media_library')
          .select('id, file_url, file_type, title')
          .eq('is_public', true)
      ]);

      if (slidesResult.error) {
        console.error('🎭 Hero: Error fetching slides:', slidesResult.error);
        throw slidesResult.error;
      }
      
      // Settings error is not critical, use defaults
      if (settingsResult.error) {
        console.warn('🎭 Hero: Error fetching settings, using defaults:', settingsResult.error);
        setSettings({
          animation_style: 'fade',
          scroll_interval: 5000,
          pause_on_hover: true,
          loop: true
        });
      } else {
        setSettings(settingsResult.data);
      }
      
      if (mediaResult.error) {
        console.error('🎭 Hero: Error fetching media:', mediaResult.error);
        throw mediaResult.error;
      }

      const fetchedSlides = slidesResult.data || [];
      const fetchedMedia = mediaResult.data || [];

      console.log('🎭 Hero: Visible slides fetched:', fetchedSlides.length);
      console.log('🎭 Hero: Media library count:', fetchedMedia.length);

      // Filter out slides that have invalid media references, but don't auto-clean
      const validSlides = fetchedSlides.filter(slide => {
        if (!slide.media_id) {
          console.log('🎭 Hero: Slide has no media_id, keeping:', slide.id);
          return true; // Allow slides without media
        }
        
        if (slide.media_id.includes('youtube.com/embed/')) {
          console.log('🎭 Hero: YouTube embed slide, keeping:', slide.id);
          return true; // Allow YouTube embeds
        }
        
        const mediaExists = fetchedMedia.some(media => media.id === slide.media_id);
        if (!mediaExists) {
          console.warn(`🎭 Hero: Slide ${slide.id} (${slide.title}) has invalid media reference ${slide.media_id} - hiding from display`);
        }
        return mediaExists;
      });

      console.log('🎭 Hero: Valid slides after filtering:', validSlides.length);

      setMediaFiles(fetchedMedia);
      setSlides(validSlides);
    } catch (error) {
      console.error('🎭 Hero: Error fetching hero data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load hero data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, [sectionId]);

  return {
    slides,
    settings,
    mediaFiles,
    isLoading,
    error,
    refetch: fetchHeroData
  };
}
