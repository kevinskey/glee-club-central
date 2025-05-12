
import React, { useState, useEffect } from "react";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFCoreProps {
  url: string;
  title: string;
  currentPage: number;
  zoom: number;
  viewMode?: 'scroll' | 'page';
  onLoad: () => void;
  onError: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const PDFCore: React.FC<PDFCoreProps> = ({
  url,
  title,
  currentPage,
  zoom,
  viewMode = 'page',
  onLoad,
  onError,
  className = '',
  children
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [pdfAttempted, setPdfAttempted] = useState(false);
  
  // Ensure the URL is properly sanitized
  const sanitizedUrl = url ? url.trim() : "";
  
  // iOS detection - needed for better fallback handling
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  
  useEffect(() => {
    // Reset states when URL changes
    setFallbackMode(false);
    setPdfAttempted(false);
    setIsLoading(true);
    setError(null);
    
    // Auto-switch to fallback for iOS devices which often have PDF display issues
    if (isIOS && !fallbackMode) {
      console.log("iOS device detected, using fallback mode");
      setFallbackMode(true);
    }
    
    // If no URL is provided, show error
    if (!sanitizedUrl) {
      setError("No PDF URL provided");
      setIsLoading(false);
    }
  }, [url, isIOS]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setPdfAttempted(true);
    setIsLoading(false);
    onLoad();
  };

  // Handle iframe error
  const handleIframeError = () => {
    console.log("PDF iframe failed to load, switching to fallback mode");
    setFallbackMode(true);
    setIsLoading(false);
    onError();
  };

  // Build appropriate PDF URL with parameters
  const getPdfViewerUrl = () => {
    if (!sanitizedUrl) return "";
    
    // Use Google PDF Viewer as fallback if direct embed fails
    if (fallbackMode) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(sanitizedUrl)}&embedded=true`;
    }
    
    // Check if the URL already contains hash or query parameters
    const hasHash = sanitizedUrl.includes('#');
    const hasQuery = sanitizedUrl.includes('?');
    
    // Base URL construction
    let viewerUrl = sanitizedUrl;
    
    // Add hash if needed
    if (!hasHash && !hasQuery) {
      viewerUrl += '#';
    }
    
    // Determine correct separator for additional parameters
    const separator = viewerUrl.endsWith('#') || viewerUrl.endsWith('&') || viewerUrl.endsWith('?') 
      ? '' 
      : (hasQuery || (hasHash && viewerUrl.includes('='))) ? '&' : '#';
    
    // Add view parameters based on selected mode
    if (!viewerUrl.includes('view=')) {
      const viewParam = viewMode === 'scroll' ? 'FitH' : 'SinglePage';
      viewerUrl += separator + `toolbar=0&navpanes=1&view=${viewParam}&scrollbar=${viewMode === 'scroll' ? '1' : '0'}`;
    }
    
    // Add page parameter if needed
    if (currentPage > 1 && !viewerUrl.includes('page=')) {
      viewerUrl += '&page=' + currentPage;
    }
    
    return viewerUrl;
  };

  // Error display
  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="mb-4 text-muted-foreground">{error}</p>
          {sanitizedUrl && (
            <Button 
              onClick={() => window.open(sanitizedUrl, "_blank")}
              className="px-4 py-2 border rounded-md hover:bg-muted"
            >
              Download PDF Instead
            </Button>
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* PDF Iframe */}
      <iframe 
        src={getPdfViewerUrl()}
        className="w-full h-full border-0" 
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
        <div className="absolute top-0 left-0 bg-background/70 text-sm p-2 z-10 rounded-md m-2">
          Using alternative viewer
        </div>
      )}
      
      {children}
    </div>
  );
};
