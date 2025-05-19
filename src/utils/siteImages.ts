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

/**
 * Seeds default hero images
 * @param defaultImages Optional array of image URLs to use
 */
export const seedDefaultHeroImages = async (defaultImages?: string[]) => {
  try {
    const defaultHeroImages = defaultImages || [
      "/lovable-uploads/92a39fc3-43b7-4240-982b-bff85ae2fdca.png",
      "/lovable-uploads/eaea8db1-e2e0-4022-b6ce-a5ece2f64448.png",
      "/lovable-uploads/1536a1d1-51f6-4121-8f53-423d37672f2e.png",
      "/lovable-uploads/daf81087-d822-4f6c-9859-43580f9a3971.png",
      "/lovable-uploads/a1d9a510-4276-40df-bfb5-86a441d06e4f.png"
    ];

    // First check if we have any hero images
    const { data: existingImages } = await supabase
      .from('site_images')
      .select('*')
      .eq('category', 'hero');

    // If we already have images, we'll update them rather than add new ones
    if (existingImages && existingImages.length > 0) {
      console.log(`Found ${existingImages.length} existing hero images, updating...`);
      
      // Update existing images with new URLs
      for (let i = 0; i < Math.min(existingImages.length, defaultHeroImages.length); i++) {
        await supabase
          .from('site_images')
          .update({
            file_url: defaultHeroImages[i],
            updated_at: new Date().toISOString()
          })
          .eq('id', existingImages[i].id);
      }
      
      // Add any additional images if we have more defaults than existing ones
      if (defaultHeroImages.length > existingImages.length) {
        for (let i = existingImages.length; i < defaultHeroImages.length; i++) {
          await supabase
            .from('site_images')
            .insert({
              name: `Hero Image ${i+1}`,
              description: 'Default hero image',
              file_url: defaultHeroImages[i],
              file_path: defaultHeroImages[i].split('/').pop() || '',
              category: 'hero'
            });
        }
      }
    } else {
      // If no existing images, add all defaults
      console.log('No existing hero images found, adding defaults...');
      
      for (let i = 0; i < defaultHeroImages.length; i++) {
        await supabase
          .from('site_images')
          .insert({
            name: `Hero Image ${i+1}`,
            description: 'Default hero image',
            file_url: defaultHeroImages[i],
            file_path: defaultHeroImages[i].split('/').pop() || '',
            category: 'hero'
          });
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error seeding default hero images:', error);
    return { success: false, error };
  }
};
