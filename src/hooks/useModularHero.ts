
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MediaFile } from '@/types/media';
import { toast } from 'sonner';

export function useModularHero(category: string) {
  const [images, setImages] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('media_library')
        .select('*')
        .eq('folder', category)
        .like('file_type', 'image%')
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      
      setImages(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching hero images:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addImageToHero = async (mediaId: string) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .update({ 
          folder: category,
          display_order: images.length 
        })
        .eq('id', mediaId);

      if (error) throw error;
      
      toast.success('Image added to hero section');
      await fetchImages();
    } catch (err) {
      console.error('Error adding image to hero:', err);
      toast.error('Failed to add image to hero section');
    }
  };

  const removeImageFromHero = async (mediaId: string) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .update({ 
          folder: 'general',
          display_order: 0 
        })
        .eq('id', mediaId);

      if (error) throw error;
      
      toast.success('Image removed from hero section');
      await fetchImages();
    } catch (err) {
      console.error('Error removing image from hero:', err);
      toast.error('Failed to remove image from hero section');
    }
  };

  const reorderImages = async (reorderedImages: MediaFile[]) => {
    try {
      const updates = reorderedImages.map((image, index) => ({
        id: image.id,
        display_order: index
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('media_library')
          .update({ display_order: update.display_order })
          .eq('id', update.id);

        if (error) throw error;
      }

      toast.success('Hero images reordered');
      await fetchImages();
    } catch (err) {
      console.error('Error reordering images:', err);
      toast.error('Failed to reorder images');
    }
  };

  useEffect(() => {
    if (category) {
      fetchImages();
    }
  }, [category]);

  return {
    images,
    isLoading,
    error,
    fetchImages,
    addImageToHero,
    removeImageFromHero,
    reorderImages
  };
}
