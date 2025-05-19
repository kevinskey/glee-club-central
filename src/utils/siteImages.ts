
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export interface SiteImage {
  id: string;
  name: string;
  description?: string;
  file_path: string;
  file_url: string;
  category?: string;
  position: number;
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
    const { data: positionData, error: positionError } = await supabase
      .from('site_images')
      .select('position')
      .eq('category', category)
      .order('position', { ascending: false })
      .limit(1);
      
    const newPosition = (positionData && positionData.length > 0 && positionData[0]?.position !== undefined) 
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

// Seed default hero images if none exist
export async function seedDefaultHeroImages() {
  try {
    // Check if we already have hero images
    const { data: existingImages } = await supabase
      .from('site_images')
      .select('*')
      .eq('category', 'hero');
      
    // If we already have images, don't seed
    if (existingImages && existingImages.length > 0) {
      return;
    }
    
    // Default images from uploads
    const defaultImages = [
      {
        name: "Glee Club Group Portrait",
        path: "/lovable-uploads/92a39fc3-43b7-4240-982b-bff85ae2fdca.png",
        description: "The Spelman College Glee Club in formal attire on campus"
      },
      {
        name: "Choir Formation",
        path: "/lovable-uploads/eaea8db1-e2e0-4022-b6ce-a5ece2f64448.png",
        description: "Spelman College Glee Club members in performance formation"
      },
      {
        name: "Ensemble Performance",
        path: "/lovable-uploads/1536a1d1-51f6-4121-8f53-423d37672f2e.png",
        description: "Members performing as a small ensemble"
      },
      {
        name: "Solo Performance",
        path: "/lovable-uploads/daf81087-d822-4f6c-9859-43580f9a3971.png", 
        description: "Soloist performing with the Glee Club"
      },
      {
        name: "Holiday Concert",
        path: "/lovable-uploads/a1d9a510-4276-40df-bfb5-86a441d06e4f.png",
        description: "Glee Club Holiday concert performance"
      }
    ];
    
    // Insert default images
    for (let i = 0; i < defaultImages.length; i++) {
      const img = defaultImages[i];
      await supabase
        .from('site_images')
        .insert({
          name: img.name,
          description: img.description,
          file_path: img.path,
          file_url: img.path, // For uploaded images, path and URL are the same
          category: 'hero',
          position: i
        });
    }
    
    return true;
  } catch (error) {
    console.error("Error seeding default hero images:", error);
    return false;
  }
}
