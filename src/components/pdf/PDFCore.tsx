
import React, { useState, useEffect } from "react";
import { Loader2, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PDFCoreProps {
  url: string;
  title: string;
  currentPage: number;
  zoom: number;
  viewMode?: 'scroll' | 'page';
  onLoad: () => void;
  onError: () => void;
  className?: string;
}

export const PDFCore: React.FC<PDFCoreProps> = ({
  url,
  title,
  currentPage,
  zoom,
  viewMode = 'page',
  onLoad,
  onError,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  
  // Ensure the URL is properly sanitized
  const sanitizedUrl = url ? url.trim() : "";
  
  // iOS detection - needed for better fallback handling
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  
  useEffect(() => {
    // Reset states when URL changes
    setFallbackMode(false);
    setIsLoading(true);
    setError(null);
    
    // Auto-switch to fallback for iOS devices which often have PDF display issues
    if (isIOS && !fallbackMode) {
      console.log("iOS device detected, using fallback mode");
      setFallbackMode(true);
    }
    
    // If no URL is provided, show error
    if (!sanitizedUrl) {
      console.error("No PDF URL provided");
      setError("No PDF URL provided");
      setIsLoading(false);
      onError();
    }
  }, [url, isIOS, onError, fallbackMode]);

  // Handle iframe load
  const handleIframeLoad = () => {
    console.log("PDF iframe loaded successfully");
    setIsLoading(false);
    onLoad();
  };

  // Handle iframe error
  const handleIframeError = () => {
    console.error("PDF iframe failed to load, switching to fallback mode");
    setFallbackMode(true);
    setIsLoading(false);
    onError();
    
    toast.error("PDF display issue", {
      description: "Using alternative viewer to display the PDF"
    });
  };

  // Build appropriate PDF URL with parameters
  const getPdfViewerUrl = () => {
    if (!sanitizedUrl) return "";
    
    // Add a cache-busting parameter
    const cacheBuster = `?cache=${Date.now()}`;
    
    // Use Google PDF Viewer as fallback if direct embed fails
    if (fallbackMode) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(sanitizedUrl + cacheBuster)}&embedded=true`;
    }
    
    // Direct URL for PDF viewing
    return `${sanitizedUrl}${cacheBuster}#page=${currentPage}`;
  };

  // Error display
  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center bg-muted/20">
        <div className="bg-background p-6 rounded-lg shadow-lg max-w-md">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="mb-4 text-muted-foreground">{error}</p>
          {sanitizedUrl && (
            <div className="flex flex-col gap-2 items-center">
              <Button 
                onClick={() => window.open(sanitizedUrl, "_blank")}
                className="w-full sm:w-auto"
                variant="default"
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Open PDF in New Tab
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setFallbackMode(!fallbackMode);
                  setError(null);
                  setIsLoading(true);
                }}
                className="w-full sm:w-auto"
              >
                Try Alternative Viewer
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full flex flex-col justify-center overflow-hidden ${className}`}>
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-30">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading PDF...</p>
          </div>
        </div>
      )}
      
      {/* PDF Iframe */}
      <iframe 
        src={getPdfViewerUrl()}
        className="w-full h-full border-0 rounded" 
        style={{ 
          transformOrigin: 'top center',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: `translateX(-50%) scale(${zoom / 100})`,
          width: `${100 / (zoom / 100)}%`,
          height: `${100 / (zoom / 100)}%`,
          overflowY: viewMode === 'scroll' ? 'auto' : 'hidden'
        }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title={title}
        frameBorder="0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-presentation"
        allowFullScreen
      />
      
      {/* Fallback Mode Indicator */}
      {fallbackMode && (
        <div className="absolute top-0 left-0 bg-background/70 text-sm p-2 z-10 rounded-md m-2 shadow-sm">
          <span className="text-xs font-medium">Using alternative viewer</span>
        </div>
      )}
    </div>
  );
};
