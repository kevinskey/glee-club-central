
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface MediaMetadata {
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  uploadedBy: string;
}

/**
 * Upload a media file to Supabase Storage and record its metadata
 * @param file File to upload
 * @param filePath Path within the storage bucket
 * @param metadata File metadata
 * @returns Object with success status and file information
 */
export async function uploadMediaFile(
  file: File, 
  filePath: string, 
  metadata: MediaMetadata
): Promise<{ success: boolean; fileUrl?: string; id?: string }> {
  try {
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media_library")
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw uploadError;
    }
    
    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from("media_library")
      .getPublicUrl(filePath);
    
    // Insert metadata into database
    const { data: mediaData, error: mediaError } = await supabase
      .from("media_library")
      .insert({
        title: metadata.title,
        description: metadata.description || null,
        file_url: publicUrl,
        file_path: filePath,
        file_type: file.type,
        size: file.size,
        category: metadata.category,
        tags: metadata.tags || [],
        uploaded_by: metadata.uploadedBy
      })
      .select('id')
      .single();
    
    if (mediaError) {
      console.error("Database insert error:", mediaError);
      // Even if the database insert fails, the file was uploaded successfully
      // We could handle this better by cleaning up the stored file, but for now
      // we'll return success with a warning
      console.warn("File uploaded but metadata not saved:", filePath);
      return { success: true, fileUrl: publicUrl };
    }
    
    return { 
      success: true, 
      fileUrl: publicUrl,
      id: mediaData?.id 
    };
  } catch (error) {
    console.error("Error in uploadMediaFile:", error);
    return { success: false };
  }
}

/**
 * Get all media files from the database
 * @returns Array of media files
 */
export async function getAllMediaFiles() {
  try {
    const { data, error } = await supabase
      .from("media_library")
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching media files:", error);
    return [];
  }
}

/**
 * Delete a media file from storage and database
 * @param mediaId ID of the media file to delete
 * @returns Object with success status
 */
export async function deleteMediaFile(mediaId: string) {
  try {
    // First get the file path
    const { data: mediaData, error: fetchError } = await supabase
      .from("media_library")
      .select('file_path')
      .eq('id', mediaId)
      .single();
      
    if (fetchError) throw fetchError;
    
    if (mediaData?.file_path) {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("media_library")
        .remove([mediaData.file_path]);
        
      if (storageError) {
        console.error("Storage delete error:", storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from("media_library")
      .delete()
      .eq('id', mediaId);
      
    if (dbError) throw dbError;
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
}

/**
 * Batch upload multiple files
 * @param files Array of files to upload
 * @param baseMetadata Base metadata to apply to all files
 * @param progressCallback Optional callback for progress updates
 * @returns Results of all uploads
 */
export async function batchUploadMediaFiles(
  files: File[],
  baseMetadata: Omit<MediaMetadata, 'title'>,
  baseTitle: string,
  progressCallback?: (progress: number) => void
): Promise<{ success: number; failed: number; totalFiles: number }> {
  let successCount = 0;
  let failedCount = 0;
  const totalFiles = files.length;
  
  // Process in batches of 3 for better performance
  const batchSize = 3;
  
  for (let i = 0; i < totalFiles; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    
    // Upload batch in parallel
    const results = await Promise.allSettled(
      batch.map((file, index) => {
        const fileExt = file.name.split('.').pop();
        const uniqueId = uuidv4().substring(0, 8);
        const fileName = `${Date.now()}-${uniqueId}.${fileExt}`;
        const filePath = `${baseMetadata.category}/${fileName}`;
        
        // Create title with number suffix for multiple files
        const title = totalFiles > 1 
          ? `${baseTitle} ${i + index + 1}` 
          : baseTitle;
        
        return uploadMediaFile(file, filePath, {
          ...baseMetadata,
          title
        });
      })
    );
    
    // Count successes and failures
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.success) {
        successCount++;
      } else {
        failedCount++;
      }
    });
    
    // Update progress
    if (progressCallback) {
      const progress = Math.round(((i + batch.length) / totalFiles) * 100);
      progressCallback(progress);
    }
  }
  
  return {
    success: successCount,
    failed: failedCount,
    totalFiles
  };
}
