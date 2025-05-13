
import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";

interface PDFDocumentProps {
  url: string;
  currentPage: number;
  zoom: number;
  isLoading: boolean;
  onLoad: () => void;
  onError: () => void;
  error: string | null;
  title: string;
  mediaSourceId?: string;
  category?: string;
}

export const PDFDocument: React.FC<PDFDocumentProps> = ({
  url,
  currentPage,
  zoom,
  isLoading,
  onLoad,
  onError,
  error,
  title,
  // We don't need to use these props, but we need to include them in the interface
  mediaSourceId,
  category
}) => {
  const isMobile = useIsMobile();
  const [pdfLoaded, setPdfLoaded] = useState(false);
  
  // Handle load event
  const handleLoad = () => {
    setPdfLoaded(true);
    onLoad();
  };
  
  // Mobile touch navigation
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX - touchEndX;
    
    // If swipe distance is significant (more than 50px)
    if (Math.abs(difference) > 50) {
      // Right to left swipe (next page)
      if (difference > 0) {
        // Handle next page logic if needed
      }
      // Left to right swipe (previous page)
      else {
        // Handle previous page logic if needed
      }
    }
    
    setTouchStartX(null);
  };
  
  // Simple sanity check for valid URL
  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-muted/30">
        <p className="text-muted-foreground">No PDF URL provided</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-muted/30">
        <p className="text-destructive font-medium">Failed to load PDF</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  // Show loading state
  if (isLoading || !pdfLoaded) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-muted/30">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground mt-4">Loading PDF...</p>
      </div>
    );
  }

  return (
    <div 
      className="relative pdf-container max-w-full"
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <iframe
        src={`${url}#page=${currentPage}`}
        title={`PDF Viewer - ${title}`}
        className="border-0 w-full"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          height: zoom === 100 ? '100%' : `${zoom * 1.3}%`,
          width: zoom === 100 ? '100%' : `${100 * (100 / zoom)}%`,
        }}
        onLoad={handleLoad}
        onError={onError}
      />
    </div>
  );
};
