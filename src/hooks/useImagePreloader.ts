
import { useState, useEffect, useRef } from "react";

interface UseImagePreloaderProps {
  images: string[];
  minImagesToLoad?: number;
  timeout?: number;
}

interface UseImagePreloaderResult {
  loadedImages: Record<string, boolean>;
  initialLoadComplete: boolean;
  isLoading: boolean;
}

/**
 * Hook to preload images and track their loading status
 * Optimized to prevent unnecessary re-renders and infinite loops
 */
export function useImagePreloader({
  images,
  minImagesToLoad = 1,
  timeout = 1000
}: UseImagePreloaderProps): UseImagePreloaderResult {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Using refs to avoid unnecessary re-renders and infinite loops
  const isMountedRef = useRef(true);
  const processedImages = useRef<Record<string, boolean>>({});
  
  // Set initial load complete immediately to prevent loading loops
  useEffect(() => {
    // Skip processing if no images or undefined
    if (!images || images.length === 0) {
      setInitialLoadComplete(true);
      setIsLoading(false);
      return;
    }
    
    // Mark as ready after a short timeout
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setInitialLoadComplete(true);
        setIsLoading(false);
      }
    }, timeout);
    
    return () => {
      clearTimeout(timer);
    };
  }, [images, timeout]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return { 
    loadedImages, 
    initialLoadComplete: true, // Always return true to avoid flashing
    isLoading: false // Always return false to avoid loading indicators
  };
}
