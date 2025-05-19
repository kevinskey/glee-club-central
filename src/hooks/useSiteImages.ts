
import { useState, useEffect } from "react";
import { SiteImage, listSiteImages } from "@/utils/siteImages";
import { toast } from "sonner";

export function useSiteImages(category?: string) {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function loadImages() {
      setIsLoading(true);
      try {
        const data = await listSiteImages(category);
        setImages(data);
        setError(null);
      } catch (err) {
        console.error("Error loading site images:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error("Failed to load site images", {
          description: "Please try again or contact support"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadImages();
  }, [category]);
  
  const refreshImages = async () => {
    setIsLoading(true);
    try {
      const data = await listSiteImages(category);
      setImages(data);
      setError(null);
    } catch (err) {
      console.error("Error refreshing site images:", err);
      toast.error("Failed to refresh site images");
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    images,
    isLoading,
    error,
    refreshImages
  };
}
