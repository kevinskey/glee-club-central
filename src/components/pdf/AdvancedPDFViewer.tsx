
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
  ArrowLeft,
  Search,
  Bookmark,
  BookmarkCheck,
  Palette,
  Type,
  Eraser,
  Eye,
  EyeOff,
  Printer,
  Calendar,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface Annotation {
  id: string;
  page_number: number;
  annotation_type: string;
  annotations: any[];
  is_visible: boolean;
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
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [currentTool, setCurrentTool] = useState<string>('none');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0);
  
  // Bookmarks and annotations
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentPageBookmarked, setCurrentPageBookmarked] = useState<boolean>(false);
  
  // Refs
  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load bookmarks and annotations
  useEffect(() => {
    if (user && sheetMusicId) {
      loadBookmarks();
      loadAnnotations();
    }
  }, [user, sheetMusicId]);

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
          break;
        case 'f':
        case 'F':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            // Focus search input if it exists
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            searchInput?.focus();
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

  const loadAnnotations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pdf_annotations')
        .select('*')
        .eq('user_id', user.id)
        .eq('sheet_music_id', sheetMusicId);

      if (error) throw error;
      setAnnotations(data || []);
    } catch (error) {
      console.error('Error loading annotations:', error);
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
  const rotate = () => setRotation(rotation => (rotation + 90) % 360);
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const jumpToBookmark = (bookmark: Bookmark) => {
    setPageNumber(bookmark.page_number);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background",
      isFullscreen ? "fixed inset-0 z-50" : ""
    )}>
      {/* Top Toolbar */}
      {(showToolbar || !isFullscreen) && (
        <div className="flex items-center justify-between p-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <h3 className="font-semibold text-sm truncate max-w-[200px]">{title}</h3>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Secondary Toolbar */}
      {(showToolbar || !isFullscreen) && (
        <div className="flex items-center justify-between p-2 border-b bg-muted/30">
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={pageNumber}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= numPages) {
                    setPageNumber(page);
                  }
                }}
                className="w-16 h-8 text-center"
                min={1}
                max={numPages}
              />
              <span className="text-sm text-muted-foreground">
                of {numPages}
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
          
          {/* Zoom and Tools */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-sm font-medium px-2 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3.0}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={rotate}>
              <RotateCw className="h-4 w-4" />
            </Button>

            <Button
              variant={currentPageBookmarked ? "default" : "outline"}
              size="sm"
              onClick={toggleBookmark}
            >
              {currentPageBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </Button>

            <Button
              variant={showAnnotations ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAnnotations(!showAnnotations)}
            >
              {showAnnotations ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-2 p-2 border-b">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in PDF..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchResults.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {currentSearchIndex + 1} of {searchResults.length}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentSearchIndex(Math.max(0, currentSearchIndex - 1))}
              disabled={currentSearchIndex <= 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentSearchIndex(Math.min(searchResults.length - 1, currentSearchIndex + 1))}
              disabled={currentSearchIndex >= searchResults.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Main PDF Viewer */}
      <div className="flex-1 overflow-auto bg-gray-100 relative" ref={viewerRef}>
        <div className="flex justify-center p-4">
          <div className="relative">
            <Card className="shadow-lg">
              <CardContent className="p-0 relative">
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
                {showAnnotations && (
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 pointer-events-none"
                    style={{ 
                      width: '100%',
                      height: '100%',
                      zIndex: 10
                    }}
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
    </div>
  );
};

export default AdvancedPDFViewer;
