
import { useState, useEffect, useCallback, useRef } from "react";
import { SiteImage, listSiteImages } from "@/utils/siteImages";

export function useSiteImages(category?: string) {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  
  const loadImages = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setIsLoading(true);
    try {
      const data = await listSiteImages(category);
      
      if (isMountedRef.current) {
        setImages(data);
        setError(null);
      }
    } catch (err) {
      console.error("Error loading site images:", err);
      
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [category]);
  
  useEffect(() => {
    // Set the mounted ref
    isMountedRef.current = true;
    
    // Load images on mount
    loadImages();
    
    // Cleanup
    return () => {
      isMountedRef.current = false;
    };
  }, [loadImages]);
  
  const refreshImages = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setIsLoading(true);
    try {
      const data = await listSiteImages(category);
      
      if (isMountedRef.current) {
        setImages(data);
        setError(null);
      }
    } catch (err) {
      console.error("Error refreshing site images:", err);
      
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [category]);
  
  return {
    images,
    isLoading,
    error,
    refreshImages
  };
}
