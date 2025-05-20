
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
 */
export function useImagePreloader({
  images,
  minImagesToLoad = 2,
  timeout = 1500
}: UseImagePreloaderProps): UseImagePreloaderResult {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    if (!images || images.length === 0) {
      setInitialLoadComplete(true);
      setIsLoading(false);
      return;
    }
    
    const newLoadedImages: Record<string, boolean> = {};
    let loadedCount = 0;
    const totalImages = images.length;
    
    // Mark component as mounted
    isMountedRef.current = true;
    
    // Function to mark image as loaded
    const markImageLoaded = (src: string) => {
      if (!isMountedRef.current) return;
      
      newLoadedImages[src] = true;
      loadedCount++;
      
      if (loadedCount >= Math.min(minImagesToLoad, totalImages)) {
        // Once at least minimum images are loaded (or all if less than min), start slideshow
        setLoadedImages(prev => ({ ...prev, ...newLoadedImages }));
        setInitialLoadComplete(true);
        setIsLoading(false);
      }
      
      if (loadedCount === totalImages) {
        // All images loaded
        setLoadedImages(prev => ({ ...prev, ...newLoadedImages }));
      }
    };
    
    // Preload all images
    images.forEach((src) => {
      // Skip if already loaded
      if (loadedImages[src]) {
        loadedCount++;
        newLoadedImages[src] = true;
        return;
      }
      
      const img = new Image();
      img.src = src;
      
      img.onload = () => markImageLoaded(src);
      
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        markImageLoaded(src);
      };
    });
    
    // Safety timeout to start slideshow even if not all images load
    const safetyTimer = setTimeout(() => {
      if (!isMountedRef.current) return;
      if (!initialLoadComplete && loadedCount > 0) {
        setInitialLoadComplete(true);
        setLoadedImages(prev => ({ ...prev, ...newLoadedImages }));
        setIsLoading(false);
      }
    }, timeout);
    
    return () => {
      isMountedRef.current = false;
      clearTimeout(safetyTimer);
    };
  }, [images, minImagesToLoad, timeout, loadedImages]);
  
  return { loadedImages, initialLoadComplete, isLoading };
}
