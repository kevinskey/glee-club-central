
import React, { useEffect, useMemo, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { usePDFAnnotations } from '@/hooks/usePDFAnnotations';
import { usePDFViewer } from './hooks/usePDFViewer';
import { usePDFPagePreloader } from './hooks/usePDFPagePreloader';
import { usePDFMobileGestures } from './hooks/usePDFMobileGestures';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnnotationToolbar } from './AnnotationToolbar';
import { AnnotationCanvas } from './AnnotationCanvas';
import { PDFFullscreenHeader } from './PDFFullscreenHeader';
import { PDFRegularHeader } from './PDFRegularHeader';
import { PDFMobileToolbar } from './PDFMobileToolbar';
import { PDFSearchBar } from './PDFSearchBar';
import { PDFBookmarksSidebar } from './PDFBookmarksSidebar';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface AdvancedPDFViewerProps {
  url: string;
  title: string;
  sheetMusicId: string;
  onBack?: () => void;
}

const AdvancedPDFViewer: React.FC<AdvancedPDFViewerProps> = ({ 
  url, 
  title, 
  sheetMusicId,
  onBack 
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const {
    // State
    numPages,
    pageNumber,
    scale,
    rotation,
    isFullscreen,
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
    setPageNumber,
    setSearchTerm,
    setCurrentSearchIndex,
    setCurrentTool,
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
    toggleBookmark
  } = usePDFViewer(sheetMusicId);

  // Page preloader for instant page turns
  const { preloadAdjacentPages, getPreloadedPage } = usePDFPagePreloader(url, numPages);

  // Mobile gesture support
  const { containerRef } = usePDFMobileGestures({
    onPrevPage: goToPrevPage,
    onNextPage: goToNextPage,
    onZoomIn: zoomIn,
    onZoomOut: zoomOut,
    pageNumber,
    numPages,
    scale
  });

  // Annotation hook with caching
  const {
    currentPageAnnotations,
    addAnnotation,
    removeAnnotation,
    removeAnnotationById,
    undo,
    redo,
    clearPageAnnotations,
    loadAnnotations,
    loadPageAnnotations,
    canUndo,
    canRedo
  } = usePDFAnnotations(sheetMusicId);

  // Get current page annotations from cache
  const pageAnnotations = useMemo(() => {
    return currentPageAnnotations(pageNumber);
  }, [currentPageAnnotations, pageNumber]);

  useEffect(() => {
    loadAnnotations();
  }, [loadAnnotations]);

  // Preload adjacent pages when page or scale changes
  useEffect(() => {
    if (numPages > 0) {
      preloadAdjacentPages(pageNumber, scale, rotation);
    }
  }, [pageNumber, scale, rotation, numPages, preloadAdjacentPages]);

  // Safe keyboard event handler with proper cleanup
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent handling if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      try {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            goToPrevPage();
            break;
          case 'ArrowRight':
            event.preventDefault();
            goToNextPage();
            break;
          case 'Escape':
            event.preventDefault();
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
      } catch (error) {
        console.error('Error handling keyboard event:', error);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pageNumber, numPages, isFullscreen, goToPrevPage, goToNextPage, exitFullscreen, setCurrentTool, toggleFullscreen, rotate]);

  // Safe fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      try {
        const isCurrentlyFullscreen = Boolean(document.fullscreenElement);
        if (!isCurrentlyFullscreen && isFullscreen) {
          // Fullscreen was exited externally (e.g., ESC key)
          exitFullscreen();
        }
      } catch (error) {
        console.error('Error handling fullscreen change:', error);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen, exitFullscreen]);

  const handleDownload = useCallback(() => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({ title: "Download failed", description: "Unable to download the PDF file.", variant: "destructive" });
    }
  }, [url, title, toast]);

  const handlePrint = useCallback(() => {
    try {
      window.print();
    } catch (error) {
      console.error('Error printing PDF:', error);
      toast({ title: "Print failed", description: "Unable to print the PDF.", variant: "destructive" });
    }
  }, [toast]);

  const jumpToBookmark = useCallback((bookmark: any) => {
    try {
      setPageNumber(bookmark.page_number);
    } catch (error) {
      console.error('Error jumping to bookmark:', error);
    }
  }, [setPageNumber]);

  const handleAnnotationAdd = useCallback((annotation: any) => {
    try {
      addAnnotation(annotation, pageNumber);
    } catch (error) {
      console.error('Error adding annotation:', error);
    }
  }, [addAnnotation, pageNumber]);

  const handleAnnotationRemove = useCallback((annotationId: string) => {
    try {
      removeAnnotationById(annotationId, pageNumber);
    } catch (error) {
      console.error('Error removing annotation:', error);
    }
  }, [removeAnnotationById, pageNumber]);

  const handleSaveAnnotations = useCallback(() => {
    try {
      toast({ title: "Annotations saved" });
    } catch (error) {
      console.error('Error saving annotations:', error);
    }
  }, [toast]);

  const handleClearAnnotations = useCallback(() => {
    try {
      clearPageAnnotations(pageNumber);
      toast({ title: "Annotations cleared" });
    } catch (error) {
      console.error('Error clearing annotations:', error);
    }
  }, [clearPageAnnotations, pageNumber, toast]);

  const handleBackNavigation = useCallback(() => {
    try {
      if (onBack) {
        onBack();
      } else {
        window.history.back();
      }
    } catch (error) {
      console.error('Error navigating back:', error);
    }
  }, [onBack]);

  const handlePrevSearchResult = useCallback(() => {
    setCurrentSearchIndex(Math.max(0, currentSearchIndex - 1));
  }, [currentSearchIndex, setCurrentSearchIndex]);

  const handleNextSearchResult = useCallback(() => {
    setCurrentSearchIndex(Math.min(searchResults.length - 1, currentSearchIndex + 1));
  }, [searchResults.length, currentSearchIndex, setCurrentSearchIndex]);

  return (
    <div 
      ref={viewerRef}
      className={cn(
        "flex flex-col bg-background transition-all duration-200",
        isFullscreen ? "fixed inset-0 z-50 h-screen" : "h-screen"
      )}
    >
      {/* Headers with safe fullscreen handling */}
      {isFullscreen && (
        <PDFFullscreenHeader
          title={title}
          pageNumber={pageNumber}
          numPages={numPages}
          scale={scale}
          onBack={handleBackNavigation}
          onPageChange={setPageNumber}
          onPrevPage={goToPrevPage}
          onNextPage={goToNextPage}
          onRotate={rotate}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onExitFullscreen={exitFullscreen}
        />
      )}

      {!isFullscreen && !isMobile && (
        <>
          <PDFRegularHeader
            title={title}
            pageNumber={pageNumber}
            numPages={numPages}
            scale={scale}
            rotation={rotation}
            showAnnotations={showAnnotations}
            currentPageBookmarked={currentPageBookmarked}
            canUndo={canUndo}
            canRedo={canRedo}
            onBack={handleBackNavigation}
            onPageChange={setPageNumber}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onRotate={rotate}
            onToggleFullscreen={toggleFullscreen}
            onToggleAnnotations={() => setShowAnnotations(!showAnnotations)}
            onUndo={() => undo(pageNumber)}
            onRedo={() => redo(pageNumber)}
            onSaveAnnotations={handleSaveAnnotations}
            onClearAnnotations={handleClearAnnotations}
            onToggleBookmark={toggleBookmark}
            onDownload={handleDownload}
            onPrint={handlePrint}
          />

          <PDFSearchBar
            searchTerm={searchTerm}
            searchResults={searchResults}
            currentSearchIndex={currentSearchIndex}
            onSearchChange={setSearchTerm}
            onPrevResult={handlePrevSearchResult}
            onNextResult={handleNextSearchResult}
          />

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
        </>
      )}

      {/* Mobile-specific toolbar */}
      {!isFullscreen && isMobile && (
        <PDFMobileToolbar
          pageNumber={pageNumber}
          numPages={numPages}
          scale={scale}
          showAnnotations={showAnnotations}
          currentPageBookmarked={currentPageBookmarked}
          currentTool={currentTool}
          canUndo={canUndo}
          canRedo={canRedo}
          onPageChange={setPageNumber}
          onPrevPage={goToPrevPage}
          onNextPage={goToNextPage}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onRotate={rotate}
          onToggleFullscreen={toggleFullscreen}
          onToggleAnnotations={() => setShowAnnotations(!showAnnotations)}
          onToolChange={setCurrentTool}
          onUndo={() => undo(pageNumber)}
          onRedo={() => redo(pageNumber)}
          onSaveAnnotations={handleSaveAnnotations}
          onClearAnnotations={handleClearAnnotations}
          onToggleBookmark={toggleBookmark}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
      )}

      {/* Main PDF Viewer with crash protection */}
      <div className="flex-1 overflow-auto bg-gray-100 relative flex">
        <div 
          ref={containerRef}
          className={cn(
            "flex-1 flex justify-center",
            isMobile ? "p-2" : "p-4"
          )}
        >
          <div className="relative w-full max-w-full">
            <Card className={cn(
              "shadow-lg transition-transform duration-200",
              isMobile && "shadow-sm"
            )}>
              <CardContent className="p-0 relative" ref={pageRef}>
                <Document
                  file={url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error) => {
                    console.error('PDF load error:', error);
                    toast({ title: "PDF load failed", description: "Unable to load the PDF file.", variant: "destructive" });
                  }}
                  loading={
                    <div className={cn(
                      "flex items-center justify-center",
                      isMobile ? "h-64" : "h-96"
                    )}>
                      <div className="text-center">
                        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-2"></div>
                        <p className="text-muted-foreground">Loading PDF...</p>
                      </div>
                    </div>
                  }
                  error={
                    <div className={cn(
                      "flex items-center justify-center text-center p-8",
                      isMobile ? "h-64" : "h-96"
                    )}>
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
                    scale={isMobile ? Math.min(scale, 1.5) : scale}
                    rotate={rotation}
                    loading={null}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="transition-opacity duration-200 max-w-full"
                    width={isMobile ? Math.min(window.innerWidth - 16, 600) : undefined}
                    onRenderError={(error) => {
                      console.error('Page render error:', error);
                    }}
                  />
                </Document>
                
                {/* Annotation Canvas Overlay with crash protection */}
                {pageSize.width > 0 && pageSize.height > 0 && (
                  <AnnotationCanvas
                    width={pageSize.width}
                    height={pageSize.height}
                    currentTool={currentTool}
                    currentColor={currentColor}
                    strokeWidth={strokeWidth}
                    annotations={pageAnnotations}
                    onAnnotationAdd={handleAnnotationAdd}
                    onAnnotationRemove={handleAnnotationRemove}
                    showAnnotations={showAnnotations}
                    scale={isMobile ? Math.min(scale, 1.5) : scale}
                    className="absolute top-0 left-0 transition-opacity duration-200"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bookmarks Sidebar - Hidden on Mobile */}
        {!isFullscreen && !isMobile && (
          <PDFBookmarksSidebar
            bookmarks={bookmarks}
            currentPage={pageNumber}
            onJumpToBookmark={jumpToBookmark}
          />
        )}
      </div>
    </div>
  );
};

export default AdvancedPDFViewer;
