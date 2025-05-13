
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload an event image to Supabase Storage
 * @param file The image file to upload
 * @param eventTitle The title of the event (used for naming)
 * @returns URL of the uploaded image, or null if upload failed
 */
export async function uploadEventImage(file: File, eventTitle: string): Promise<string | null> {
  try {
    if (!file) {
      console.error("No file provided for upload");
      return null;
    }
    
    // Generate unique filename to prevent overwrites
    const fileExt = file.name.split('.').pop();
    const sanitizedEventName = eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
    const uniqueFileName = `events/${sanitizedEventName}-${uuidv4().substring(0, 8)}.${fileExt}`;
    
    // Upload file to the media_library bucket
    const { data, error } = await supabase.storage
      .from('media_library')
      .upload(uniqueFileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Error uploading event image:", error);
      return null;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media_library')
      .getPublicUrl(uniqueFileName);
    
    return publicUrl;
  } catch (err) {
    console.error("Unexpected error in uploadEventImage:", err);
    return null;
  }
}

/**
 * Delete an event image from Supabase Storage
 * @param imageUrl The URL of the image to delete
 * @returns Boolean indicating success
 */
export async function deleteEventImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlPattern = /.*\/storage\/v1\/object\/public\/media_library\/(.*)/;
    const match = imageUrl.match(urlPattern);
    
    if (!match || !match[1]) {
      console.error("Invalid image URL format");
      return false;
    }
    
    const filePath = match[1];
    
    // Delete the file
    const { error } = await supabase.storage
      .from('media_library')
      .remove([filePath]);
    
    if (error) {
      console.error("Error deleting event image:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Unexpected error in deleteEventImage:", err);
    return false;
  }
}
