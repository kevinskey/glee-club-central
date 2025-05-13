
import { supabase } from "@/integrations/supabase/client";
import { MediaFile } from "@/types/media";

/**
 * Upload a file to the media library
 */
export const uploadMediaFile = async (
  file: File,
  filePath: string,
  metadata: {
    title: string;
    description?: string;
    category?: string;
    tags?: string[];
    uploadedBy: string;
  }
) => {
  try {
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

    // Insert record in database
    const { data, error: dbError } = await supabase
      .from('media_library')
      .insert({
        title: metadata.title,
        description: metadata.description || null,
        file_path: filePath,
        file_url: publicURLData.publicUrl,
        file_type: file.type,
        uploaded_by: metadata.uploadedBy,
        folder: metadata.category || 'general',
        tags: metadata.tags || [],
        size: file.size // Now properly adding the file size
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insertion error:", dbError);
      throw dbError;
    }

    return data;
  } catch (error) {
    console.error("Upload media file error:", error);
    throw error;
  }
};

/**
 * Delete a media file from the media library
 */
export const deleteMediaFile = async (mediaId: string) => {
  try {
    // Get file path
    const { data: fileData, error: fileError } = await supabase
      .from('media_library')
      .select('file_path')
      .eq('id', mediaId)
      .single();

    if (fileError) throw fileError;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('media-library')
      .remove([fileData.file_path]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from('media_library')
      .delete()
      .eq('id', mediaId);

    if (dbError) throw dbError;

    return true;
  } catch (error) {
    console.error("Delete media file error:", error);
    throw error;
  }
};

/**
 * Get all media files
 */
export const getAllMediaFiles = async (): Promise<MediaFile[]> => {
  try {
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data as MediaFile[];
  } catch (error) {
    console.error("Get all media files error:", error);
    throw error;
  }
};

/**
 * Get media files by category
 */
export const getMediaFilesByCategory = async (category: string): Promise<MediaFile[]> => {
  try {
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .eq('folder', category)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data as MediaFile[];
  } catch (error) {
    console.error("Get media files by category error:", error);
    throw error;
  }
};
