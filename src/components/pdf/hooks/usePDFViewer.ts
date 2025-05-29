
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Bookmark {
  id: string;
  page_number: number;
  title: string;
  created_at: string;
}

export const usePDFViewer = (sheetMusicId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Core PDF state
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [preFullscreenScale, setPreFullscreenScale] = useState<number>(1.0);
  
  // UI state
  const [showToolbar, setShowToolbar] = useState<boolean>(true);
  const [currentTool, setCurrentTool] = useState<string>('none');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0);
  
  // Annotation state
  const [currentColor, setCurrentColor] = useState<string>('#FF0000');
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  
  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [currentPageBookmarked, setCurrentPageBookmarked] = useState<boolean>(false);
  
  // Refs
  const viewerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState<{width: number, height: number}>({width: 0, height: 0});

  // Calculate optimal scale for fullscreen
  const calculateFullscreenScale = useCallback(() => {
    if (!pageRef.current) return 1.0;

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight - (isFullscreen ? 80 : 0)
    };

    const basePageWidth = 612;
    const basePageHeight = 792;
    
    const scaleToFitWidth = (viewport.width * 0.9) / basePageWidth;
    const scaleToFitHeight = (viewport.height * 0.9) / basePageHeight;
    
    const optimalScale = Math.min(scaleToFitWidth, scaleToFitHeight);
    
    return Math.max(0.5, Math.min(3.0, optimalScale));
  }, [isFullscreen]);

  const loadBookmarks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pdf_bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .eq('sheet_music_id', sheetMusicId)
        .order('page_number');

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const toggleBookmark = async () => {
    if (!user) return;

    try {
      if (currentPageBookmarked) {
        const { error } = await supabase
          .from('pdf_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('sheet_music_id', sheetMusicId)
          .eq('page_number', pageNumber);

        if (error) throw error;
        
        setBookmarks(prev => prev.filter(b => b.page_number !== pageNumber));
        toast({ title: "Bookmark removed" });
      } else {
        const { data, error } = await supabase
          .from('pdf_bookmarks')
          .insert({
            user_id: user.id,
            sheet_music_id: sheetMusicId,
            page_number: pageNumber,
            title: `Page ${pageNumber}`
          })
          .select()
          .single();

        if (error) throw error;
        
        setBookmarks(prev => [...prev, data]);
        toast({ title: "Bookmark added" });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({ 
        title: "Error", 
        description: "Failed to toggle bookmark",
        variant: "destructive" 
      });
    }
  };

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  // Simple page navigation without debouncing or loading states
  const navigateToPage = useCallback((newPageNumber: number) => {
    if (newPageNumber < 1 || newPageNumber > numPages || newPageNumber === pageNumber) {
      return;
    }
    setPageNumber(newPageNumber);
  }, [numPages, pageNumber]);

  const goToPrevPage = useCallback(() => {
    navigateToPage(pageNumber - 1);
  }, [pageNumber, navigateToPage]);

  const goToNextPage = useCallback(() => {
    navigateToPage(pageNumber + 1);
  }, [pageNumber, navigateToPage]);

  const zoomIn = () => setScale(scale => Math.min(3.0, scale + 0.2));
  const zoomOut = () => setScale(scale => Math.max(0.5, scale - 0.2));
  const rotate = () => {
    setRotation(rotation => (rotation + 90) % 360);
    toast({ title: `Rotated to ${((rotation + 90) % 360)}°` });
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setPreFullscreenScale(scale);
      setIsFullscreen(true);
      
      setTimeout(() => {
        const optimalScale = calculateFullscreenScale();
        setScale(optimalScale);
        toast({ 
          title: "Entered fullscreen mode", 
          description: `PDF scaled to ${Math.round(optimalScale * 100)}% for optimal viewing. Press ESC or the X button to exit.` 
        });
      }, 100);
    } else {
      setIsFullscreen(false);
      setScale(preFullscreenScale);
      toast({ title: "Exited fullscreen mode" });
    }
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    setScale(preFullscreenScale);
    toast({ title: "Exited fullscreen mode" });
  };

  // Load data on mount
  useEffect(() => {
    if (user && sheetMusicId) {
      loadBookmarks();
    }
  }, [user, sheetMusicId]);

  useEffect(() => {
    const isBookmarked = bookmarks.some(b => b.page_number === pageNumber);
    setCurrentPageBookmarked(isBookmarked);
  }, [bookmarks, pageNumber]);

  useEffect(() => {
    if (pageRef.current) {
      const updateSize = () => {
        const rect = pageRef.current?.getBoundingClientRect();
        if (rect) {
          setPageSize({ width: rect.width, height: rect.height });
        }
      };
      
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [scale, pageNumber, rotation]);

  return {
    // State
    numPages,
    pageNumber,
    scale,
    rotation,
    isFullscreen,
    showToolbar,
    currentTool,
    searchTerm,
    searchResults,
    currentSearchIndex,
    currentColor,
    strokeWidth,
    showAnnotations,
    bookmarks,
    currentPageBookmarked,
    pageSize,
    viewerRef,
    pageRef,
    
    // Setters
    setPageNumber: navigateToPage,
    setScale,
    setRotation,
    setShowToolbar,
    setCurrentTool,
    setSearchTerm,
    setSearchResults,
    setCurrentSearchIndex,
    setCurrentColor,
    setStrokeWidth,
    setShowAnnotations,
    
    // Actions
    onDocumentLoadSuccess,
    goToPrevPage,
    goToNextPage,
    zoomIn,
    zoomOut,
    rotate,
    toggleFullscreen,
    exitFullscreen,
    toggleBookmark,
    loadBookmarks
  };
};
