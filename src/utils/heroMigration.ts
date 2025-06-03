
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function migrateHeroImages() {
  try {
    console.log('🔄 Starting hero images migration...');
    
    // Get existing hero images from media library
    const { data: heroMedia, error: mediaError } = await supabase
      .from('media_library')
      .select('*')
      .eq('is_hero', true)
      .eq('is_public', true)
      .order('display_order', { ascending: true });

    if (mediaError) {
      console.error('Error fetching hero media:', mediaError);
      throw mediaError;
    }

    if (!heroMedia || heroMedia.length === 0) {
      console.log('No hero images found in media library');
      return { success: true, migrated: 0 };
    }

    console.log(`Found ${heroMedia.length} hero images to migrate`);

    // Check if slides already exist for homepage-main
    const { data: existingSlides } = await supabase
      .from('hero_slides')
      .select('id')
      .eq('section_id', 'homepage-main');

    if (existingSlides && existingSlides.length > 0) {
      console.log('Hero slides already exist, skipping migration');
      return { success: true, migrated: 0, skipped: true };
    }

    // Create hero slides from media library images
    const slidesToInsert = heroMedia.map((media, index) => ({
      section_id: 'homepage-main',
      media_id: media.id,
      media_type: 'image',
      title: media.title || `Hero Image ${index + 1}`,
      description: media.description || 'Welcome to Spelman College Glee Club',
      text_position: 'center',
      text_alignment: 'center',
      visible: true,
      slide_order: index,
      button_text: index === 0 ? 'Learn More' : null,
      button_link: index === 0 ? '/about' : null
    }));

    const { error: insertError } = await supabase
      .from('hero_slides')
      .insert(slidesToInsert);

    if (insertError) {
      console.error('Error inserting hero slides:', insertError);
      throw insertError;
    }

    console.log(`✅ Successfully migrated ${heroMedia.length} hero images to slides`);
    
    return { 
      success: true, 
      migrated: heroMedia.length 
    };

  } catch (error) {
    console.error('Hero migration failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
