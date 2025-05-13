
import { useState, useEffect } from "react";
import { SiteImage, listSiteImages } from "@/utils/siteImages";

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
      } finally {
        setIsLoading(false);
      }
    }
    
    loadImages();
  }, [category]);
  
  return {
    images,
    isLoading,
    error
  };
}
