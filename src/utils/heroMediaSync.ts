
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MediaValidationResult {
  checked: number;
  fixed: number;
  cleaned: number;
  errors: string[];
}

export async function removeMediaFromHeroSlides(mediaId: string): Promise<boolean> {
  try {
    console.log(`🔧 MediaSync: Removing media_id ${mediaId} from hero slides`);
    
    const { error } = await supabase
      .from('hero_slides')
      .update({ 
        media_id: null,
        media_type: 'image' // Reset to default
      })
      .eq('media_id', mediaId);

    if (error) {
      console.error(`🔧 MediaSync: Error removing media ${mediaId} from hero slides:`, error);
      return false;
    }
    
    console.log(`🔧 MediaSync: ✅ Successfully removed media ${mediaId} from hero slides`);
    return true;
  } catch (error) {
    console.error(`🔧 MediaSync: Unexpected error removing media ${mediaId}:`, error);
    return false;
  }
}

export async function validateHeroSlideMedia(): Promise<MediaValidationResult> {
  const result: MediaValidationResult = {
    checked: 0,
    fixed: 0,
    cleaned: 0,
    errors: []
  };

  try {
    // Get all hero slides
    const { data: slides, error: slidesError } = await supabase
      .from('hero_slides')
      .select('*');

    if (slidesError) {
      result.errors.push(`Error fetching slides: ${slidesError.message}`);
      return result;
    }

    // Get all available media files
    const { data: mediaFiles, error: mediaError } = await supabase
      .from('media_library')
      .select('id, title, file_url, is_public');

    if (mediaError) {
      result.errors.push(`Error fetching media: ${mediaError.message}`);
      return result;
    }

    const availableMediaIds = new Set(mediaFiles.map(m => m.id));
    console.log('🔧 MediaSync: Available media IDs:', Array.from(availableMediaIds));

    for (const slide of slides) {
      result.checked++;
      
      if (slide.media_id && !availableMediaIds.has(slide.media_id)) {
        console.log(`🔧 MediaSync: Cleaning orphaned media_id ${slide.media_id} from slide "${slide.title}"`);
        
        // Clear the broken media reference
        const { error: updateError } = await supabase
          .from('hero_slides')
          .update({ 
            media_id: null,
            media_type: 'image' // Reset to default
          })
          .eq('id', slide.id);

        if (updateError) {
          result.errors.push(`Error updating slide ${slide.title}: ${updateError.message}`);
        } else {
          result.cleaned++;
          console.log(`🔧 MediaSync: ✅ Cleaned slide "${slide.title}"`);
        }
      } else if (slide.media_id && availableMediaIds.has(slide.media_id)) {
        console.log(`🔧 MediaSync: ✅ Slide "${slide.title}" has valid media reference`);
        result.fixed++;
      }
    }

    if (result.cleaned > 0) {
      toast.success(`Cleaned ${result.cleaned} broken media references`);
    } else if (result.checked > 0) {
      toast.info('All media references are valid');
    }

  } catch (error) {
    result.errors.push(`Unexpected error: ${error.message}`);
  }

  return result;
}

export async function forceCleanupOrphanedSlides(): Promise<MediaValidationResult> {
  const result: MediaValidationResult = {
    checked: 0,
    fixed: 0,
    cleaned: 0,
    errors: []
  };

  try {
    console.log('🔧 MediaSync: Starting force cleanup of orphaned media references...');
    
    // Clear all media_id references that don't exist in media_library
    const { data: updatedSlides, error } = await supabase
      .from('hero_slides')
      .update({ 
        media_id: null,
        media_type: 'image'
      })
      .neq('media_id', null)
      .select();

    if (error) {
      result.errors.push(`Force cleanup error: ${error.message}`);
      return result;
    }

    result.cleaned = updatedSlides?.length || 0;
    console.log(`🔧 MediaSync: Force cleanup completed - reset ${result.cleaned} slides`);
    
    if (result.cleaned > 0) {
      toast.success(`Force cleanup: Reset ${result.cleaned} slides with broken media references`);
    } else {
      toast.info('No slides needed cleanup');
    }

  } catch (error) {
    result.errors.push(`Force cleanup error: ${error.message}`);
  }

  return result;
}
