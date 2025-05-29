
import { useState, useCallback, useRef } from 'react';

interface AnnotationData {
  type: 'pen' | 'highlighter' | 'text' | 'drawing';
  color: string;
  strokeWidth: number;
  points?: number[];
  text?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface CachedAnnotations {
  [pageNumber: number]: AnnotationData[];
}

export const usePDFAnnotationCache = () => {
  const [cache, setCache] = useState<CachedAnnotations>({});
  const pendingSavesRef = useRef<Set<number>>(new Set());

  const getCachedAnnotations = useCallback((pageNumber: number): AnnotationData[] => {
    return cache[pageNumber] || [];
  }, [cache]);

  const setCachedAnnotations = useCallback((
    pageNumber: number, 
    annotations: AnnotationData[]
  ) => {
    setCache(prev => ({
      ...prev,
      [pageNumber]: annotations
    }));
  }, []);

  const updateCachedAnnotations = useCallback((
    pageNumber: number, 
    annotations: AnnotationData[],
    markForSave = true
  ) => {
    setCachedAnnotations(pageNumber, annotations);
    
    if (markForSave) {
      pendingSavesRef.current.add(pageNumber);
    }
  }, [setCachedAnnotations]);

  const markPageSaved = useCallback((pageNumber: number) => {
    pendingSavesRef.current.delete(pageNumber);
  }, []);

  const hasPendingSaves = useCallback((pageNumber: number): boolean => {
    return pendingSavesRef.current.has(pageNumber);
  }, []);

  const getAllPendingSaves = useCallback((): number[] => {
    return Array.from(pendingSavesRef.current);
  }, []);

  const clearCache = useCallback(() => {
    setCache({});
    pendingSavesRef.current.clear();
  }, []);

  const preloadAnnotationsIntoCache = useCallback((annotationsData: any[]) => {
    const newCache: CachedAnnotations = {};
    
    annotationsData.forEach(annotation => {
      if (annotation.page_number && annotation.annotations) {
        newCache[annotation.page_number] = annotation.annotations;
      }
    });
    
    setCache(newCache);
  }, []);

  return {
    getCachedAnnotations,
    updateCachedAnnotations,
    markPageSaved,
    hasPendingSaves,
    getAllPendingSaves,
    clearCache,
    preloadAnnotationsIntoCache
  };
};
