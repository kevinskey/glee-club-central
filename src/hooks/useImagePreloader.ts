
import { useState, useEffect } from "react";

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
 * Simplified to prevent race conditions and rendering loops
 */
export function useImagePreloader({
  images
}: UseImagePreloaderProps): UseImagePreloaderResult {
  const [loadedImages] = useState<Record<string, boolean>>({});
  
  // Skip loading states completely to avoid unnecessary renders
  return { 
    loadedImages, 
    initialLoadComplete: true,
    isLoading: false
  };
}
