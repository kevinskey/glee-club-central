
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export interface SiteImage {
  id: string;
  name: string;
  description?: string;
  file_path: string;
  file_url: string;
  category?: string;
  position?: number;
  created_at: string;
  updated_at: string;
}

export interface UploadSiteImageParams {
  file: File;
  name: string;
  description?: string;
  category?: string;
}

export async function uploadSiteImage({ file, name, description, category = "general" }: UploadSiteImageParams) {
  try {
    const user = supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be logged in to upload images");
    }

    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('site-images')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from('site-images')
      .getPublicUrl(filePath);
      
    if (!urlData) throw new Error("Failed to get public URL");
    
    // Get the highest position value for this category to place new image at the end
    const { data: positionData } = await supabase
      .from('site_images')
      .select('position')
      .eq('category', category)
      .order('position', { ascending: false })
      .limit(1);
      
    const newPosition = positionData && positionData[0]?.position !== undefined 
      ? positionData[0].position + 1 
      : 0;
    
    // Store metadata in the site_images table
    const { error: dbError } = await supabase
      .from('site_images')
      .insert({
        name,
        description,
        file_path: filePath,
        file_url: urlData.publicUrl,
        category,
        position: newPosition
      });
      
    if (dbError) throw dbError;
    
    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath
    };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    toast.error("Upload failed", {
      description: error.message || "An unexpected error occurred"
    });
    return {
      success: false,
      error: error.message
    };
  }
}

export async function listSiteImages(category?: string): Promise<SiteImage[]> {
  try {
    let query = supabase
      .from('site_images')
      .select('*')
      .order('position', { ascending: true });
      
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as SiteImage[];
  } catch (error) {
    console.error("Error fetching site images:", error);
    return [];
  }
}

export async function deleteSiteImage(id: string) {
  try {
    // Get the file path first
    const { data: imageData, error: fetchError } = await supabase
      .from('site_images')
      .select('file_path')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Delete from storage
    if (imageData?.file_path) {
      const { error: storageError } = await supabase
        .storage
        .from('site-images')
        .remove([imageData.file_path]);
        
      if (storageError) throw storageError;
    }
    
    // Delete metadata from database
    const { error: dbError } = await supabase
      .from('site_images')
      .delete()
      .eq('id', id);
      
    if (dbError) throw dbError;
    
    toast.success("Image deleted successfully");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting image:", error);
    toast.error("Delete failed", {
      description: error.message || "An unexpected error occurred"
    });
    return { success: false, error: error.message };
  }
}
