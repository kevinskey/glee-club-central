
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  media_id: string;
  button_text?: string;
  button_link?: string;
  slide_order: number;
  visible: boolean;
  section_id: string;
  text_position?: string;
  text_alignment?: string;
  show_title?: boolean;
  media_type?: string;
  youtube_url?: string;
  created_at: string;
  updated_at: string;
  media?: {
    id: string;
    file_url: string;
    title: string;
    file_type: string;
  };
}

export const useHeroSlides = (sectionId: string = 'homepage-main') => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false); // Changed from true to false
  const [error, setError] = useState<string | null>(null);

  const fetchHeroSlides = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        console.warn('useHeroSlides: Supabase not configured');
        setSlides([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('hero_slides')
        .select(`
          *,
          media_library!inner(
            id,
            file_url,
            title,
            file_type
          )
        `)
        .eq('section_id', sectionId)
        .order('slide_order', { ascending: true });

      if (fetchError) {
        console.error('Error fetching hero slides:', fetchError);
        setSlides([]); // Set empty array instead of throwing
        return;
      }

      const formattedSlides = data?.map(slide => ({
        ...slide,
        media: slide.media_library ? {
          id: slide.media_library.id,
          file_url: slide.media_library.file_url,
          title: slide.media_library.title,
          file_type: slide.media_library.file_type
        } : undefined
      })) || [];

      setSlides(formattedSlides);
    } catch (err) {
      console.error('Error fetching hero slides:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch hero slides');
      setSlides([]); // Ensure we have an empty array on error
      toast.error('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  const updateSlideVisibility = async (slideId: string, visible: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ visible })
        .eq('id', slideId);

      if (error) throw error;

      setSlides(prev => prev.map(slide => 
        slide.id === slideId ? { ...slide, visible } : slide
      ));

      toast.success(`Slide ${visible ? 'shown' : 'hidden'} successfully`);
    } catch (err) {
      console.error('Error updating slide visibility:', err);
      toast.error('Failed to update slide visibility');
    }
  };

  const updateSlideOrder = async (slideId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ slide_order: newOrder })
        .eq('id', slideId);

      if (error) throw error;

      await fetchHeroSlides(); // Refresh to get updated order
      toast.success('Slide order updated successfully');
    } catch (err) {
      console.error('Error updating slide order:', err);
      toast.error('Failed to update slide order');
    }
  };

  useEffect(() => {
    fetchHeroSlides();
  }, [sectionId]);

  return {
    slides,
    loading,
    error,
    fetchHeroSlides,
    updateSlideVisibility,
    updateSlideOrder,
    visibleSlides: slides.filter(slide => slide.visible),
    totalSlides: slides.length
  };
};
