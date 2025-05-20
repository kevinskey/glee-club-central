
import { useState, useEffect, useRef, useCallback } from "react";

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
 * Optimized to prevent unnecessary re-renders
 */
export function useImagePreloader({
  images,
  minImagesToLoad = 1,
  timeout = 1000
}: UseImagePreloaderProps): UseImagePreloaderResult {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const isMountedRef = useRef(true);
  const loadedCountRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const processedImages = useRef<Record<string, boolean>>({});
  
  // Memoize the markImageLoaded function to prevent recreating it on each render
  const markImageLoaded = useCallback((src: string) => {
    if (!isMountedRef.current) return;
    
    // Skip if already processed
    if (processedImages.current[src]) return;
    processedImages.current[src] = true;
    
    loadedCountRef.current++;
    
    if (loadedCountRef.current >= Math.min(minImagesToLoad, images.length || 1)) {
      // Once at least minimum images are loaded (or all if less than min), start slideshow
      setLoadedImages(prev => ({ ...prev, [src]: true }));
      setInitialLoadComplete(true);
      setIsLoading(false);
    }
    
    if (images && loadedCountRef.current === images.length) {
      // All images loaded
      setLoadedImages(prev => ({ ...prev, [src]: true }));
    }
  }, [images, minImagesToLoad]);
  
  useEffect(() => {
    // Reset state if image array changes
    if (images !== undefined && images.length === 0) {
      setInitialLoadComplete(true);
      setIsLoading(false);
      return;
    }

    // Guard against undefined or empty images
    if (!images || images.length === 0) {
      return;
    }
    
    // Mark component as mounted
    isMountedRef.current = true;
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Reset loaded count if images change
    loadedCountRef.current = 0;
    processedImages.current = {};
    
    // Preload all images
    const validImages = images.filter(src => src);
    
    validImages.forEach((src) => {
      // Skip if already loaded
      if (loadedImages[src]) {
        loadedCountRef.current++;
        processedImages.current[src] = true;
        return;
      }
      
      const img = new Image();
      
      img.onload = () => markImageLoaded(src);
      
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        markImageLoaded(src);
      };
      
      img.src = src;
    });
    
    // Safety timeout to start slideshow even if not all images load
    timerRef.current = window.setTimeout(() => {
      if (!isMountedRef.current) return;
      if (!initialLoadComplete && loadedCountRef.current > 0) {
        console.log("Safety timeout fired, images partially loaded");
        setInitialLoadComplete(true);
        setIsLoading(false);
      }
    }, timeout);
    
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [images, minImagesToLoad, timeout, loadedImages, markImageLoaded, initialLoadComplete]);
  
  return { loadedImages, initialLoadComplete, isLoading };
}
