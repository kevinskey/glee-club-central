
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Upload an event image to the media library
 */
export const uploadEventImage = async (
  file: File,
  eventName: string
): Promise<string | null> => {
  try {
    // Get the current user ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No authenticated user found");
      toast.error("You must be logged in to upload images");
      return null;
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `event-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `events/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media-library')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: publicURLData } = supabase.storage
      .from('media-library')
      .getPublicUrl(filePath);

    if (!publicURLData) throw new Error("Failed to get public URL");

    // Insert record in media_library table
    const { data, error: dbError } = await supabase
      .from('media_library')
      .insert({
        title: `Event Image: ${eventName}`,
        description: `Image for event: ${eventName}`,
        file_path: filePath,
        file_url: publicURLData.publicUrl,
        file_type: file.type,
        folder: 'events',
        size: file.size,
        uploaded_by: user.id,  // Add the required uploaded_by field with the current user ID
        tags: ['event', 'calendar']  // Add some default tags
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insertion error:", dbError);
      throw dbError;
    }

    return publicURLData.publicUrl;
  } catch (error) {
    console.error("Upload event image error:", error);
    toast.error("Failed to upload image");
    return null;
  }
};
