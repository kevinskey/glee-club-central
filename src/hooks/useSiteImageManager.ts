
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteImage, uploadSiteImage, listSiteImages, deleteSiteImage } from "@/utils/siteImages";

export function useSiteImageManager(category: string = "hero") {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Fetch images for the specified category
  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const imagesList = await listSiteImages(category);
      setImages(imagesList);
      setHasChanges(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a new image
  const addImage = async (file: File, name: string, description?: string) => {
    setIsLoading(true);
    try {
      const result = await uploadSiteImage({
        file,
        name,
        description,
        category
      });
      
      if (result.success) {
        toast.success("Image uploaded successfully");
        await fetchImages();
        return true;
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove an image
  const removeImage = async (imageId: string) => {
    setIsLoading(true);
    try {
      const result = await deleteSiteImage(imageId);
      if (result.success) {
        toast.success("Image removed successfully");
        await fetchImages();
        return true;
      } else {
        throw new Error(result.error || "Delete failed");
      }
    } catch (error: any) {
      toast.error("Delete failed", {
        description: error.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reorder images by updating their positions
  const reorderImages = async (reorderedImages: SiteImage[]) => {
    setImages(reorderedImages);
    setHasChanges(true);
  };
  
  // Save the order of images
  const saveImageOrder = async (imageList: SiteImage[]) => {
    setIsLoading(true);
    try {
      // Create a batch update for all images to update their positions
      for (const [index, image] of imageList.entries()) {
        const { error } = await supabase
          .from('site_images')
          .update({ position: index })
          .eq('id', image.id);
          
        if (error) throw error;
      }
      
      toast.success("Image order updated");
      setHasChanges(false);
      return true;
    } catch (error: any) {
      console.error("Error saving image order:", error);
      toast.error("Failed to save image order");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    images,
    isLoading,
    hasChanges,
    fetchImages,
    addImage,
    removeImage,
    reorderImages,
    saveImageOrder
  };
}
