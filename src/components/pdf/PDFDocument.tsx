
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
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [finalUrl, setFinalUrl] = useState(url);
  
  // Handle URL update and add cache-busting
  useEffect(() => {
    if (!url) return;
    
    // Add cache busting to ensure we're getting the latest PDF version
    // This helps solve caching issues that might prevent PDFs from loading
    const cacheBuster = `?t=${new Date().getTime()}`;
    const newUrl = url.includes('?') ? `${url}&cb=${Date.now()}` : `${url}${cacheBuster}`;
    setFinalUrl(newUrl);
    console.log("PDF URL prepared:", newUrl);
    
    // Reset load state when URL changes
    setPdfLoaded(false);
    setLoadAttempts(0);
  }, [url]);
  
  // Handle load event
  const handleLoad = () => {
    console.log("PDF loaded successfully:", title);
    setPdfLoaded(true);
    onLoad();
  };
  
  // Handle error event with retry logic
  const handleError = () => {
    console.error("PDF load error for:", title, "URL:", url);
    setLoadAttempts(prev => prev + 1);
    
    if (loadAttempts < 2) {
      // Try one more time with a fresh cache buster
      console.log("Attempting to reload PDF...");
      const retryUrl = `${url}?retry=${Date.now()}`;
      setFinalUrl(retryUrl);
    } else {
      // Give up after multiple attempts
      onError();
    }
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
        console.log("Swipe detected: next page");
      }
      // Left to right swipe (previous page)
      else {
        // Handle previous page logic if needed
        console.log("Swipe detected: previous page");
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
        <button 
          onClick={() => window.open(url, '_blank')} 
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Try opening in new tab
        </button>
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
        src={`${finalUrl}#page=${currentPage}`}
        title={`PDF Viewer - ${title}`}
        className="border-0 w-full"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          height: zoom === 100 ? '100%' : `${zoom * 1.3}%`,
          width: zoom === 100 ? '100%' : `${100 * (100 / zoom)}%`,
        }}
        onLoad={handleLoad}
        onError={handleError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
      />
    </div>
  );
};
