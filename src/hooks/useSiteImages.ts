
import { useState, useEffect, useCallback, useRef } from "react";
import { SiteImage, listSiteImages } from "@/utils/siteImages";

export function useSiteImages(category?: string) {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);
  
  const loadImages = useCallback(async () => {
    // Generate a unique request ID to avoid race conditions
    const requestId = ++requestIdRef.current;
    
    setIsLoading(true);
    
    try {
      const data = await listSiteImages(category);
      
      // Only update state if this is the most recent request and component is still mounted
      if (isMountedRef.current && requestId === requestIdRef.current) {
        setImages(data);
        setError(null);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error loading site images:", err);
      
      // Only update state if this is the most recent request and component is still mounted
      if (isMountedRef.current && requestId === requestIdRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    }
  }, [category]);
  
  useEffect(() => {
    // Set the mounted ref
    isMountedRef.current = true;
    
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
  const refreshImages = useCallback(() => {
    if (!isMountedRef.current) return;
    loadImages();
  }, [loadImages]);
  
  return {
    images,
    isLoading,
    error,
    refreshImages
  };
}
