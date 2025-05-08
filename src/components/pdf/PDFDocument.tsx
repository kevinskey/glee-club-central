
import React, { useRef, useEffect, useState } from "react";
import { Loader2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFDocumentProps {
  url: string;
  currentPage: number;
  zoom: number;
  isLoading: boolean;
  onLoad: () => void;
  onError: () => void;
  error: string | null;
  title: string;
  children?: React.ReactNode;
}

export const PDFDocument = ({
  url,
  currentPage,
  zoom,
  isLoading,
  onLoad,
  onError,
  error,
  title,
  children,
}: PDFDocumentProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  
  // Ensure the URL is properly sanitized and valid
  const sanitizedUrl = url ? url.trim() : "";
  
  useEffect(() => {
    // Reset fallback mode when URL changes
    setFallbackMode(false);
  }, [url]);

  // Handle iframe load error - switch to fallback mode
  const handleIframeError = () => {
    console.log("PDF iframe failed to load, switching to fallback mode");
    setFallbackMode(true);
    onError();
  };

  // Build PDF URL with appropriate parameters
  const getPdfViewerUrl = () => {
    if (!sanitizedUrl) return "";
    
    // Use Google PDF Viewer as fallback if the direct embed fails
    if (fallbackMode) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(sanitizedUrl)}&embedded=true`;
    }
    
    const isMobile = window.innerWidth < 768;
    
    // Check if the URL already contains a hash fragment or query parameters
    const hasHash = sanitizedUrl.includes('#');
    const hasQuery = sanitizedUrl.includes('?');
    
    // Base URL construction
    let viewerUrl = sanitizedUrl;
    
    // Add hash if needed
    if (!hasHash && !hasQuery) {
      viewerUrl += '#';
    }
    
    // Determine the correct separator for additional parameters
    const separator = viewerUrl.endsWith('#') || viewerUrl.endsWith('&') || viewerUrl.endsWith('?') 
      ? '' 
      : (hasQuery || (hasHash && viewerUrl.includes('='))) ? '&' : '#';
    
    // Add view parameters if not already present
    if (!viewerUrl.includes('view=')) {
      viewerUrl += separator + (isMobile 
        ? "toolbar=0&navpanes=0&view=FitH&scrollbar=0" 
        : "toolbar=0&navpanes=1&view=FitH&scrollbar=1");
    }
    
    // Add page parameter if needed and not already present
    if (currentPage > 1 && !viewerUrl.includes('page=')) {
      viewerUrl += '&page=' + currentPage;
    }
    
    return viewerUrl;
  };

  // Log for debugging
  useEffect(() => {
    console.log("PDF URL being used:", getPdfViewerUrl());
    console.log("Using fallback mode:", fallbackMode);
  }, [url, currentPage, zoom, fallbackMode]);

  if (!url) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">No PDF URL provided</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="mb-4 text-muted-foreground">{error}</p>
          <Button 
            onClick={() => window.open(sanitizedUrl, "_blank")}
            className="px-4 py-2 border rounded-md hover:bg-muted"
          >
            <Download className="h-4 w-4 mr-2" /> Download PDF Instead
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex justify-center overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-30">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <iframe 
        ref={iframeRef}
        src={getPdfViewerUrl()}
        className="w-full h-full border-0" 
        style={{ 
          transformOrigin: 'top center',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: `translateX(-50%) scale(${zoom / 100})`,
          width: `${100 / (zoom / 100)}%`,
          height: `${100 / (zoom / 100)}%`
        }}
        onLoad={onLoad}
        onError={handleIframeError}
        title={title}
        frameBorder="0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
        allowFullScreen
      />
      
      {fallbackMode && (
        <div className="absolute top-0 left-0 bg-background/70 text-sm p-2 z-10 rounded-md m-2">
          Using alternative viewer
        </div>
      )}
      
      {children}
    </div>
  );
};
