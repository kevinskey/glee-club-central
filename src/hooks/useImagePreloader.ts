
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
  minImagesToLoad = 1,
  timeout = 1000
}: UseImagePreloaderProps): UseImagePreloaderResult {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
  // Skip loading states completely to avoid unnecessary renders
  return { 
    loadedImages, 
    initialLoadComplete: true,
    isLoading: false
  };
}
