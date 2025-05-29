
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  RotateCw,
  Maximize,
  Minimize,
  ArrowLeft,
  Search,
  Bookmark,
  BookmarkCheck,
  Printer,
  Settings,
  MoreHorizontal,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Undo,
  Redo,
  Home,
  Music
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePDFAnnotations } from '@/hooks/usePDFAnnotations';
import { AnnotationToolbar } from './AnnotationToolbar';
import { AnnotationCanvas } from './AnnotationCanvas';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface AdvancedPDFViewerProps {
  url: string;
  title: string;
  sheetMusicId: string;
  onBack?: () => void;
}

interface Bookmark {
  id: string;
  page_number: number;
  title: string;
  created_at: string;
}

const AdvancedPDFViewer: React.FC<AdvancedPDFViewerProps> = ({ 
  url, 
  title, 
  sheetMusicId,
  onBack 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Core PDF state
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
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

  // Annotation hook
  const {
    currentPageAnnotations,
    addAnnotation,
    removeAnnotation,
    undo,
    redo,
    clearPageAnnotations,
    loadAnnotations,
    loadPageAnnotations,
    canUndo,
    canRedo
  } = usePDFAnnotations(sheetMusicId);

  // Load data on mount
  useEffect(() => {
    if (user && sheetMusicId) {
      loadBookmarks();
      loadAnnotations();
    }
  }, [user, sheetMusicId]);

  // Load page annotations when page changes
  useEffect(() => {
    loadPageAnnotations(pageNumber);
  }, [pageNumber, loadPageAnnotations]);

  // Check if current page is bookmarked
  useEffect(() => {
    const isBookmarked = bookmarks.some(b => b.page_number === pageNumber);
    setCurrentPageBookmarked(isBookmarked);
  }, [bookmarks, pageNumber]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          goToPrevPage();
          break;
        case 'ArrowRight':
          goToNextPage();
          break;
        case 'Escape':
          if (isFullscreen) {
            exitFullscreen();
          }
          setCurrentTool('none');
          break;
        case 'f':
        case 'F':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            searchInput?.focus();
          } else if (!event.ctrlKey && !event.metaKey) {
            // F key alone for fullscreen
            event.preventDefault();
            toggleFullscreen();
          }
          break;
        case 'r':
        case 'R':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            rotate();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNumber, numPages, isFullscreen]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Update page size when page renders
  useEffect(() => {
    if (pageRef.current) {
      const updateSize = () => {
        const rect = pageRef.current?.getBoundingClientRect();
        if (rect) {
          setPageSize({ width: rect.width, height: rect.height });
        }
      };
      
      // Update on render and resize
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [scale, pageNumber, rotation]);

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
        // Remove bookmark
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
        // Add bookmark
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

  const goToPrevPage = () => setPageNumber(page => Math.max(1, page - 1));
  const goToNextPage = () => setPageNumber(page => Math.min(numPages, page + 1));
  const zoomIn = () => setScale(scale => Math.min(3.0, scale + 0.2));
  const zoomOut = () => setScale(scale => Math.max(0.5, scale - 0.2));
  const rotate = () => {
    setRotation(rotation => (rotation + 90) % 360);
    toast({ title: `Rotated to ${((rotation + 90) % 360)}°` });
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (viewerRef.current) {
          await viewerRef.current.requestFullscreen();
          toast({ title: "Entered fullscreen mode", description: "Press ESC or F to exit" });
        }
      } else {
        await document.exitFullscreen();
        toast({ title: "Exited fullscreen mode" });
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      toast({ 
        title: "Fullscreen Error", 
        description: "Unable to toggle fullscreen mode",
        variant: "destructive" 
      });
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error('Exit fullscreen error:', error);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const jumpToBookmark = (bookmark: Bookmark) => {
    setPageNumber(bookmark.page_number);
  };

  const handleAnnotationAdd = (annotation: any) => {
    addAnnotation(annotation, pageNumber);
  };

  const handleSaveAnnotations = () => {
    toast({ title: "Annotations saved" });
  };

  const handleClearAnnotations = () => {
    clearPageAnnotations(pageNumber);
    toast({ title: "Annotations cleared" });
  };

  // Enhanced navigation for the back button
  const handleBackNavigation = () => {
    if (onBack) {
      onBack();
    } else {
      // Fallback navigation
      window.history.back();
    }
  };

  return (
    <div 
      ref={viewerRef}
      className={cn(
        "flex flex-col h-screen bg-background",
        isFullscreen ? "fixed inset-0 z-50" : ""
      )}
    >
      {/* Enhanced Header with Navigation */}
      {(showToolbar || !isFullscreen) && (
        <div className="flex items-center justify-between p-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14">
          {/* Left Section - Navigation */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleBackNavigation}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-3 w-3" />
              <span>/</span>
              <Music className="h-3 w-3" />
              <span>Sheet Music</span>
              <span>/</span>
              <span className="text-foreground font-medium">{title}</span>
            </div>
            
            {/* Navigation Controls */}
            <div className="flex items-center gap-1 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={pageNumber}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= numPages) {
                      setPageNumber(page);
                    }
                  }}
                  className="w-12 h-8 text-center text-xs"
                  min={1}
                  max={numPages}
                />
                <span className="text-xs text-muted-foreground">
                  /{numPages}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Center Section - Title (hidden on small screens to save space) */}
          <div className="hidden md:flex flex-1 justify-center">
            <h3 className="font-medium text-sm truncate max-w-[300px]">{title}</h3>
          </div>
          
          {/* Right Section - Tool Dropdowns */}
          <div className="flex items-center gap-1">
            {/* View Controls Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={zoomOut} disabled={scale <= 0.5}>
                  <ZoomOut className="h-4 w-4 mr-2" />
                  Zoom Out ({Math.round(scale * 100)}%)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={zoomIn} disabled={scale >= 3.0}>
                  <ZoomIn className="h-4 w-4 mr-2" />
                  Zoom In ({Math.round(scale * 100)}%)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={rotate}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotate ({rotation}°)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAnnotations(!showAnnotations)}>
                  {showAnnotations ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showAnnotations ? 'Hide Annotations' : 'Show Annotations'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Annotation Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => undo(pageNumber)} disabled={!canUndo}>
                  <Undo className="h-4 w-4 mr-2" />
                  Undo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => redo(pageNumber)} disabled={!canRedo}>
                  <Redo className="h-4 w-4 mr-2" />
                  Redo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSaveAnnotations}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Annotations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClearAnnotations}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Page Annotations
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={toggleBookmark}>
                  {currentPageBookmarked ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
                  {currentPageBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Search Bar - Compact */}
      {!isFullscreen && (
        <div className="flex items-center gap-2 p-2 border-b bg-muted/30 h-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-7 h-6 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {currentSearchIndex + 1}/{searchResults.length}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setCurrentSearchIndex(Math.max(0, currentSearchIndex - 1))}
                disabled={currentSearchIndex <= 0}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setCurrentSearchIndex(Math.min(searchResults.length - 1, currentSearchIndex + 1))}
                disabled={currentSearchIndex >= searchResults.length - 1}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Annotation Toolbar - Compact */}
      {!isFullscreen && (
        <AnnotationToolbar
          currentTool={currentTool}
          onToolChange={setCurrentTool}
          currentColor={currentColor}
          onColorChange={setCurrentColor}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={setStrokeWidth}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={() => undo(pageNumber)}
          onRedo={() => redo(pageNumber)}
          onSave={handleSaveAnnotations}
          onClear={handleClearAnnotations}
          showAnnotations={showAnnotations}
          onToggleAnnotations={() => setShowAnnotations(!showAnnotations)}
          className="border-b h-10"
        />
      )}

      {/* Main PDF Viewer */}
      <div className="flex-1 overflow-auto bg-gray-100 relative">
        <div className="flex justify-center p-4">
          <div className="relative">
            <Card className="shadow-lg">
              <CardContent className="p-0 relative" ref={pageRef}>
                <Document
                  file={url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center h-96">
                      <div className="text-center">
                        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-2"></div>
                        <p className="text-muted-foreground">Loading PDF...</p>
                      </div>
                    </div>
                  }
                  error={
                    <div className="flex items-center justify-center h-96 text-center p-8">
                      <div>
                        <p className="text-destructive font-medium mb-2">Failed to load PDF</p>
                        <p className="text-muted-foreground text-sm">
                          Please check your connection and try again.
                        </p>
                      </div>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    loading={
                      <div className="flex items-center justify-center h-96">
                        <div className="h-6 w-6 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      </div>
                    }
                  />
                </Document>
                
                {/* Annotation Canvas Overlay */}
                {pageSize.width > 0 && pageSize.height > 0 && (
                  <AnnotationCanvas
                    width={pageSize.width}
                    height={pageSize.height}
                    currentTool={currentTool}
                    currentColor={currentColor}
                    strokeWidth={strokeWidth}
                    annotations={currentPageAnnotations}
                    onAnnotationAdd={handleAnnotationAdd}
                    showAnnotations={showAnnotations}
                    scale={scale}
                    className="absolute top-0 left-0"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bookmarks Sidebar (when not fullscreen) */}
      {!isFullscreen && bookmarks.length > 0 && (
        <div className="w-64 border-l bg-background p-4 overflow-y-auto">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Bookmarks
          </h4>
          <div className="space-y-2">
            {bookmarks.map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() => jumpToBookmark(bookmark)}
                className={cn(
                  "w-full text-left p-2 rounded-md text-sm hover:bg-accent",
                  bookmark.page_number === pageNumber && "bg-accent"
                )}
              >
                <div className="font-medium">{bookmark.title}</div>
                <div className="text-muted-foreground text-xs">
                  Page {bookmark.page_number}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen overlay controls */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-10 flex gap-2 bg-background/80 backdrop-blur rounded-lg p-2">
          <Button variant="outline" size="sm" onClick={rotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Minimize className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedPDFViewer;
