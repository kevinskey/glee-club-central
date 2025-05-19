
import { useState, useEffect, useCallback, useRef } from "react";
import { SiteImage, listSiteImages } from "@/utils/siteImages";

export function useSiteImages(category?: string) {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const fetchAttemptedRef = useRef(false);
  
  const loadImages = useCallback(async () => {
    // Prevent multiple fetch attempts and check if component is still mounted
    if (fetchAttemptedRef.current || !isMountedRef.current) return;
    
    fetchAttemptedRef.current = true;
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
    fetchAttemptedRef.current = false;
    
    // Load images on mount with a slight delay to prevent race conditions
    const timeoutId = setTimeout(() => {
      if (isMountedRef.current) {
        loadImages();
      }
    }, 100);
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      isMountedRef.current = false;
    };
  }, [loadImages]);
  
  // Refresh function that forces a new fetch
  const refreshImages = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setIsLoading(true);
    fetchAttemptedRef.current = false;
    
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
