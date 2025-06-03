
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Cleans up hero slides that reference deleted media files
 */
export async function cleanupOrphanedHeroSlides() {
  try {
    console.log('🧹 Starting hero slides cleanup...');
    
    // Get all hero slides that have media_id
    const { data: heroSlides, error: slidesError } = await supabase
      .from('hero_slides')
      .select('id, media_id, title')
      .not('media_id', 'is', null);

    if (slidesError) throw slidesError;

    if (!heroSlides || heroSlides.length === 0) {
      console.log('🧹 No hero slides with media found');
      return { cleaned: 0, checked: 0 };
    }

    // Get all existing media files
    const { data: mediaFiles, error: mediaError } = await supabase
      .from('media_library')
      .select('id');

    if (mediaError) throw mediaError;

    const existingMediaIds = new Set(mediaFiles?.map(m => m.id) || []);
    
    // Find orphaned slides (slides that reference non-existent media)
    const orphanedSlides = heroSlides.filter(slide => {
      // Skip YouTube embeds (they contain URLs, not UUIDs)
      if (slide.media_id?.includes('youtube.com/embed/')) {
        return false;
      }
      return !existingMediaIds.has(slide.media_id);
    });

    console.log(`🧹 Found ${orphanedSlides.length} orphaned slides out of ${heroSlides.length} total`);

    if (orphanedSlides.length === 0) {
      return { cleaned: 0, checked: heroSlides.length };
    }

    // Clean up orphaned slides by setting media_id to null instead of deleting
    const orphanedIds = orphanedSlides.map(s => s.id);
    const { error: updateError } = await supabase
      .from('hero_slides')
      .update({ 
        media_id: null,
        updated_at: new Date().toISOString()
      })
      .in('id', orphanedIds);

    if (updateError) throw updateError;

    console.log(`🧹 Cleaned up ${orphanedSlides.length} orphaned hero slides`);
    
    return { 
      cleaned: orphanedSlides.length, 
      checked: heroSlides.length,
      orphanedSlides: orphanedSlides.map(s => ({ id: s.id, title: s.title, media_id: s.media_id }))
    };

  } catch (error) {
    console.error('🧹 Error cleaning up hero slides:', error);
    throw error;
  }
}

/**
 * Removes specific media references from hero slides
 */
export async function removeMediaFromHeroSlides(mediaId: string) {
  try {
    console.log(`🧹 Removing media ${mediaId} from hero slides...`);
    
    const { data: affectedSlides, error: selectError } = await supabase
      .from('hero_slides')
      .select('id, title')
      .eq('media_id', mediaId);

    if (selectError) throw selectError;

    if (!affectedSlides || affectedSlides.length === 0) {
      console.log(`🧹 No hero slides reference media ${mediaId}`);
      return { updated: 0 };
    }

    const { error: updateError } = await supabase
      .from('hero_slides')
      .update({ 
        media_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('media_id', mediaId);

    if (updateError) throw updateError;

    console.log(`🧹 Updated ${affectedSlides.length} hero slides to remove deleted media reference`);
    
    return { 
      updated: affectedSlides.length,
      affectedSlides: affectedSlides.map(s => ({ id: s.id, title: s.title }))
    };

  } catch (error) {
    console.error('🧹 Error removing media from hero slides:', error);
    throw error;
  }
}

/**
 * Validates and repairs hero slide media references
 */
export async function validateHeroSlideMedia() {
  try {
    const result = await cleanupOrphanedHeroSlides();
    
    if (result.cleaned > 0) {
      toast.success(`Cleaned up ${result.cleaned} broken hero slide references`, {
        description: `Checked ${result.checked} slides and fixed broken media links`
      });
    }
    
    return result;
  } catch (error) {
    console.error('🧹 Error validating hero slide media:', error);
    toast.error('Failed to validate hero slide media references');
    throw error;
  }
}
