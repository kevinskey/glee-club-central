
import { useState, useEffect, useCallback, useRef } from 'react';
import { pdfjs } from 'react-pdf';

interface PreloadedPage {
  pageNumber: number;
  canvas: HTMLCanvasElement | null;
  scale: number;
  rotation: number;
}

export const usePDFPagePreloader = (url: string, numPages: number) => {
  const [preloadedPages, setPreloadedPages] = useState<Map<number, PreloadedPage>>(new Map());
  const pdfDocRef = useRef<any>(null);
  const isPreloadingRef = useRef(false);

  const loadPDFDocument = useCallback(async () => {
    if (pdfDocRef.current || !url) return;
    
    try {
      const loadingTask = pdfjs.getDocument(url);
      pdfDocRef.current = await loadingTask.promise;
    } catch (error) {
      console.error('Error loading PDF for preloading:', error);
    }
  }, [url]);

  const preloadPage = useCallback(async (
    pageNumber: number, 
    scale: number, 
    rotation: number
  ) => {
    if (!pdfDocRef.current || isPreloadingRef.current) return;
    
    const key = `${pageNumber}-${scale}-${rotation}`;
    if (preloadedPages.has(pageNumber)) return;

    try {
      isPreloadingRef.current = true;
      const page = await pdfDocRef.current.getPage(pageNumber);
      
      const viewport = page.getViewport({ scale, rotation });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      
      setPreloadedPages(prev => new Map(prev).set(pageNumber, {
        pageNumber,
        canvas,
        scale,
        rotation
      }));
    } catch (error) {
      console.error(`Error preloading page ${pageNumber}:`, error);
    } finally {
      isPreloadingRef.current = false;
    }
  }, [preloadedPages]);

  const preloadAdjacentPages = useCallback((
    currentPage: number, 
    scale: number, 
    rotation: number
  ) => {
    // Preload previous and next pages
    const pagesToPreload = [
      currentPage - 1,
      currentPage + 1
    ].filter(page => page >= 1 && page <= numPages);

    pagesToPreload.forEach(pageNum => {
      preloadPage(pageNum, scale, rotation);
    });
  }, [numPages, preloadPage]);

  const getPreloadedPage = useCallback((
    pageNumber: number, 
    scale: number, 
    rotation: number
  ): HTMLCanvasElement | null => {
    const cached = preloadedPages.get(pageNumber);
    if (cached && cached.scale === scale && cached.rotation === rotation) {
      return cached.canvas;
    }
    return null;
  }, [preloadedPages]);

  const clearCache = useCallback(() => {
    setPreloadedPages(new Map());
  }, []);

  useEffect(() => {
    loadPDFDocument();
  }, [loadPDFDocument]);

  return {
    preloadAdjacentPages,
    getPreloadedPage,
    clearCache
  };
};
