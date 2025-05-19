
import { useState, useEffect, useCallback } from "react";
import { SiteImage, listSiteImages } from "@/utils/siteImages";
import { toast } from "sonner";

export function useSiteImages(category?: string) {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const loadImages = useCallback(async () => {
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
  }, [category]);
  
  useEffect(() => {
    loadImages();
  }, [loadImages]);
  
  const refreshImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listSiteImages(category);
      setImages(data);
      setError(null);
    } catch (err) {
      console.error("Error refreshing site images:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [category]);
  
  return {
    images,
    isLoading,
    error,
    refreshImages
  };
}
