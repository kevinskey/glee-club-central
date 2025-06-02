
import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Menu, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface MobilePDFViewerProps {
  url: string;
  title?: string;
  onBack?: () => void;
}

export function MobilePDFViewer({ url, title, onBack }: MobilePDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMobile = useIsMobile();

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  }, []);

  const goToPrevPage = useCallback(() => {
    setPageNumber(prev => Math.max(1, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => Math.min(numPages, prev + 1));
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(3, prev + 0.25));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(0.5, prev - 0.25));
  }, []);

  const rotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  if (!isMobile) {
    return null; // Use regular PDF viewer for desktop
  }

  return (
    <div className="pdf-mobile-container">
      {/* Mobile Toolbar */}
      <div className="pdf-mobile-toolbar">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mobile-button"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-medium truncate">{title || 'PDF Document'}</h1>
            {!isLoading && (
              <p className="text-xs text-muted-foreground">
                Page {pageNumber} of {numPages}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="mobile-button"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            disabled={scale >= 3}
            className="mobile-button"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={rotate}
            className="mobile-button"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="pdf-mobile-content">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading PDF...</p>
            </div>
          </div>
        )}
        
        <div className="relative flex justify-center min-h-full">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading=""
          >
            <div className="relative">
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                width={Math.min(window.innerWidth - 32, 800)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
              
              {/* Page Navigation Tap Zones */}
              {pageNumber > 1 && (
                <button
                  className="pdf-page-tap-zone pdf-page-tap-left"
                  onClick={goToPrevPage}
                  aria-label="Previous page"
                />
              )}
              {pageNumber < numPages && (
                <button
                  className="pdf-page-tap-zone pdf-page-tap-right"
                  onClick={goToNextPage}
                  aria-label="Next page"
                />
              )}
            </div>
          </Document>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 flex items-center gap-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="mobile-button rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm px-3 py-1 bg-muted rounded-full">
          {pageNumber} / {numPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="mobile-button rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
