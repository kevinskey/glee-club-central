
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
      
      // Fetch slides, settings, and media in parallel
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
          .maybeSingle(),
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
        setSettings(settingsResult.data || {
          animation_style: 'fade',
          scroll_interval: 5000,
          pause_on_hover: true,
          loop: true
        });
      }
      
      if (mediaResult.error) {
        console.error('🎭 Hero: Error fetching media:', mediaResult.error);
        // Don't throw here, just log and continue with empty media
        setMediaFiles([]);
      } else {
        setMediaFiles(mediaResult.data || []);
      }

      const fetchedSlides = slidesResult.data || [];
      console.log('🎭 Hero: Fetched slides:', fetchedSlides.length);
      console.log('🎭 Hero: Media library count:', mediaResult.data?.length || 0);
      
      // Log slide details for debugging
      fetchedSlides.forEach(slide => {
        console.log(`🎭 Hero: Slide "${slide.title}" - visible: ${slide.visible}, media_id: ${slide.media_id}, section: ${slide.section_id}`);
      });

      setSlides(fetchedSlides);
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

  // Set up real-time subscription for slides changes
  useEffect(() => {
    console.log('🎭 Hero: Setting up real-time subscription for section:', sectionId);
    
    const channel = supabase
      .channel('hero-slides-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hero_slides',
          filter: `section_id=eq.${sectionId}`
        },
        (payload) => {
          console.log('🎭 Hero: Real-time update received:', payload);
          fetchHeroData(); // Refetch data when changes occur
        }
      )
      .subscribe();

    return () => {
      console.log('🎭 Hero: Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
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
