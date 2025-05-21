
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates hero image selections based on featured media library images
 */
export async function updateHeroImageWithFeaturedMedia() {
  try {
    // Fetch media items that are tagged as 'featured'
    const { data: featuredMedia, error } = await supabase
      .from('media_library')
      .select('*')
      .containedBy('tags', ['featured', 'hero'])
      .eq('is_public', true)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // If there are featured media items, update the site_images table
    if (featuredMedia && featuredMedia.length > 0) {
      // For each featured media item, check if it already exists in site_images
      for (let i = 0; i < featuredMedia.length; i++) {
        const media = featuredMedia[i];
        
        // Check if this image already exists in site_images
        const { data: existingImage, error: checkError } = await supabase
          .from('site_images')
          .select('id')
          .eq('file_url', media.file_url)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" which is expected
          console.error("Error checking existing site image:", checkError);
          continue;
        }
        
        // If not found, add to site_images
        if (!existingImage) {
          const { error: insertError } = await supabase
            .from('site_images')
            .insert({
              name: media.title,
              description: media.description,
              category: 'hero',
              file_path: media.file_path,
              file_url: media.file_url,
              position: i,
              uploaded_by: media.uploaded_by
            });
            
          if (insertError) {
            console.error("Error inserting site image:", insertError);
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error updating hero images with featured media:", error);
    return false;
  }
}

/**
 * Updates hero images from calendar event images
 */
export async function updateHeroImageWithEvents(events: any[]) {
  try {
    // Filter out events with images
    const eventsWithImages = events.filter(event => 
      event.image_url && event.image_url.trim() !== ''
    );
    
    if (eventsWithImages.length === 0) return true;
    
    // For each event with an image, check if it's in site_images
    for (let i = 0; i < eventsWithImages.length; i++) {
      const event = eventsWithImages[i];
      
      // Check if this image already exists in site_images
      const { data: existingImage, error: checkError } = await supabase
        .from('site_images')
        .select('id')
        .eq('file_url', event.image_url)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing site image:", checkError);
        continue;
      }
      
      // If not found, add to site_images
      if (!existingImage) {
        const { error: insertError } = await supabase
          .from('site_images')
          .insert({
            name: `Event: ${event.title}`,
            description: event.description || `Image for event: ${event.title}`,
            category: 'hero',
            file_path: `events/${event.id}`,  // This is a virtual path
            file_url: event.image_url,
            position: i + 50,  // Add offset to position so events come after manual uploads
            uploaded_by: event.user_id
          });
          
        if (insertError) {
          console.error("Error inserting site image:", insertError);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error updating hero images with events:", error);
    return false;
  }
}
