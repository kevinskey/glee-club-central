
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads an image to Supabase storage and returns the URL
 * @param file The image file to upload
 * @param title Title for the uploaded file (used for naming)
 * @returns URL to the uploaded image or null if upload failed
 */
export const uploadEventImage = async (file: File, title: string): Promise<string | null> => {
  try {
    // Generate a unique filename to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${title.replace(/\s+/g, '-').toLowerCase()}-${uuidv4()}.${fileExt}`;
    const filePath = `calendar_events/${fileName}`;
    
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);
      
    const publicUrl = publicUrlData.publicUrl;
    
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return publicUrl; // Still return the URL even if we can't log it to media library
    }
    
    // Log to media library
    await supabase
      .from('media_library')
      .insert({
        title: `Event Image: ${title}`,
        description: `Calendar event image for "${title}"`,
        file_path: filePath,
        file_url: publicUrl,
        file_type: file.type,
        folder: 'calendar_events',
        size: file.size,
        tags: ['event', 'calendar'],
        uploaded_by: userData.user.id
      });
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadEventImage:', error);
    return null;
  }
};
