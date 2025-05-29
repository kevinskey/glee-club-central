
import React, { useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { usePDFAnnotations } from '@/hooks/usePDFAnnotations';
import { usePDFViewer } from './hooks/usePDFViewer';
import { AnnotationToolbar } from './AnnotationToolbar';
import { AnnotationCanvas } from './AnnotationCanvas';
import { PDFFullscreenHeader } from './PDFFullscreenHeader';
import { PDFRegularHeader } from './PDFRegularHeader';
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

  useEffect(() => {
    loadAnnotations();
  }, [loadAnnotations]);

  useEffect(() => {
    loadPageAnnotations(pageNumber);
  }, [pageNumber, loadPageAnnotations]);

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
  }, [pageNumber, numPages, isFullscreen, goToPrevPage, goToNextPage, exitFullscreen, setCurrentTool, toggleFullscreen, rotate]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const jumpToBookmark = (bookmark: any) => {
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

  const handleBackNavigation = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handlePrevSearchResult = () => {
    setCurrentSearchIndex(Math.max(0, currentSearchIndex - 1));
  };

  const handleNextSearchResult = () => {
    setCurrentSearchIndex(Math.min(searchResults.length - 1, currentSearchIndex + 1));
  };

  return (
    <div 
      ref={viewerRef}
      className={cn(
        "flex flex-col bg-background",
        isFullscreen ? "fixed inset-0 z-50 h-screen" : "h-screen"
      )}
    >
      {/* Fullscreen Header - Always visible in fullscreen */}
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

      {/* Regular Header - Only visible when not in fullscreen */}
      {!isFullscreen && (
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
      )}

      {/* Search Bar - Only visible when not in fullscreen */}
      {!isFullscreen && (
        <PDFSearchBar
          searchTerm={searchTerm}
          searchResults={searchResults}
          currentSearchIndex={currentSearchIndex}
          onSearchChange={setSearchTerm}
          onPrevResult={handlePrevSearchResult}
          onNextResult={handleNextSearchResult}
        />
      )}

      {/* Annotation Toolbar - Only visible when not in fullscreen */}
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
      <div className="flex-1 overflow-auto bg-gray-100 relative flex">
        <div className="flex-1 flex justify-center p-4">
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
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
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

        {/* Bookmarks Sidebar - Only visible when not fullscreen */}
        {!isFullscreen && (
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
