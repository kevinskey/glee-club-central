
import { CalendarEvent } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates the hero images on the home page with events
 * @param events The list of calendar events
 */
export async function updateHeroImageWithEvents(events: CalendarEvent[]): Promise<void> {
  try {
    // Filter to get only events with images that are concerts or special events
    const eventsWithImages = events.filter(
      event => (event.type === 'concert' || event.type === 'special') && event.image_url
    );
    
    if (eventsWithImages.length === 0) {
      console.log("No events with images found for hero update");
      return;
    }
    
    // Sort by date to get the most recent/upcoming events
    const sortedEvents = eventsWithImages.sort((a, b) => {
      const dateA = new Date(a.start).getTime();
      const dateB = new Date(b.start).getTime();
      return dateA - dateB;
    });
    
    // Get up to 3 events with images for the hero
    const heroEvents = sortedEvents.slice(0, 3);
    
    // Extract image URLs
    const imageUrls = heroEvents.map(event => event.image_url).filter(url => url) as string[];
    
    // Update the hero images in site_images table or create a site setting
    // This could vary based on your implementation - here we'll use site_images table
    if (imageUrls.length > 0) {
      // First check if we have hero images already
      const { data: existingImages } = await supabase
        .from('site_images')
        .select('*')
        .eq('category', 'hero');
      
      // If we have existing hero images, update them
      if (existingImages && existingImages.length > 0) {
        // Update existing records
        for (let i = 0; i < Math.min(existingImages.length, imageUrls.length); i++) {
          await supabase
            .from('site_images')
            .update({
              file_url: imageUrls[i],
              updated_at: new Date().toISOString()
            })
            .eq('id', existingImages[i].id);
        }
        
        // Add new ones if we have more images than existing records
        if (imageUrls.length > existingImages.length) {
          for (let i = existingImages.length; i < imageUrls.length; i++) {
            await supabase
              .from('site_images')
              .insert({
                name: `Hero Image ${i+1}`,
                description: 'Automatically updated from calendar events',
                file_url: imageUrls[i],
                file_path: imageUrls[i].split('/').pop() || '',
                category: 'hero'
              });
          }
        }
      } else {
        // Insert new records if none exist
        for (let i = 0; i < imageUrls.length; i++) {
          await supabase
            .from('site_images')
            .insert({
              name: `Hero Image ${i+1}`,
              description: 'Automatically updated from calendar events',
              file_url: imageUrls[i],
              file_path: imageUrls[i].split('/').pop() || '',
              category: 'hero'
            });
        }
      }
      
      console.log("Hero images updated successfully with event images");
    }
  } catch (error) {
    console.error("Error updating hero images:", error);
  }
}
