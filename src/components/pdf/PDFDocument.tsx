import React, { useRef, useEffect, useState } from "react";
import { Loader2, FileText, Download, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
  mediaSourceId,
  category,
  children,
}: PDFDocumentProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [pdfAttempted, setPdfAttempted] = useState(false);
  const [viewMode, setViewMode] = useState<'scroll' | 'page'>('page');
  
  // Ensure the URL is properly sanitized and valid
  const sanitizedUrl = url ? url.trim() : "";
  
  useEffect(() => {
    // Reset states when URL changes
    setFallbackMode(false);
    setPdfAttempted(false);
  }, [url]);

  // Handle iframe load to check if PDF loaded correctly
  const handleIframeLoad = () => {
    // Mark that we've attempted to load the PDF
    setPdfAttempted(true);
    
    // Call the parent load handler
    onLoad();
    
    // Check if iframe content is accessible (if not, it might be blocked)
    try {
      const iframeDocument = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
      
      // If we can't access the iframe content and we're not in fallback mode,
      // that might indicate it's been blocked
      if (!iframeDocument && !fallbackMode && pdfAttempted) {
        console.log("PDF iframe content not accessible, switching to fallback mode");
        setFallbackMode(true);
      }
    } catch (e) {
      // Cross-origin errors will trigger here, indicating we should use fallback
      console.log("PDF iframe access error, switching to fallback mode:", e);
      setFallbackMode(true);
    }
  };

  // Handle iframe error - switch to fallback mode
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
      // Set view parameter based on selected view mode
      const viewParam = viewMode === 'scroll' ? 'FitH' : 'SinglePage';
      
      viewerUrl += separator + (isMobile 
        ? `toolbar=0&navpanes=0&view=${viewParam}&scrollbar=${viewMode === 'scroll' ? '1' : '0'}` 
        : `toolbar=0&navpanes=1&view=${viewParam}&scrollbar=${viewMode === 'scroll' ? '1' : '0'}`);
    }
    
    // Add page parameter if needed and not already present
    if (currentPage > 1 && !viewerUrl.includes('page=')) {
      viewerUrl += '&page=' + currentPage;
    }
    
    return viewerUrl;
  };

  // Add a check for iOS devices where PDF handling differs
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  // Log for debugging
  useEffect(() => {
    console.log("PDF URL being used:", getPdfViewerUrl());
    console.log("Using fallback mode:", fallbackMode);
    console.log("Device is iOS:", isIOS);
    console.log("View mode:", viewMode);
  }, [url, currentPage, zoom, fallbackMode, viewMode]);

  // Auto-switch to fallback for iOS devices which often have PDF display issues
  useEffect(() => {
    if (isIOS && !fallbackMode) {
      console.log("iOS device detected, preemptively using fallback mode");
      setFallbackMode(true);
    }
  }, [isIOS]);

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'page' ? 'scroll' : 'page');
  };

  // View in Media Library
  const goToMediaLibrary = () => {
    if (mediaSourceId) {
      window.open(`/dashboard/admin/media?id=${mediaSourceId}`, "_blank");
    }
  };

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
    <div className="relative w-full h-full flex flex-col justify-center overflow-hidden">
      {/* Source Badge */}
      {mediaSourceId && category && (
        <div className="absolute top-12 left-2 z-40">
          <Badge 
            variant="outline" 
            className="bg-background/90 cursor-pointer hover:bg-background"
            onClick={goToMediaLibrary}
          >
            <Link className="h-3 w-3 mr-1" />
            From {category}
          </Badge>
        </div>
      )}
      
      {/* View Mode Toggle */}
      <div className="absolute top-2 left-2 z-40 bg-background/80 rounded-md shadow-sm">
        <div className="flex items-center gap-2 p-1">
          <Toggle
            pressed={viewMode === 'scroll'}
            onPressedChange={() => toggleViewMode()}
            size="sm"
            className="text-xs h-6 data-[state=on]:bg-glee-purple"
          >
            {viewMode === 'scroll' ? 'Scroll View' : 'Page View'}
          </Toggle>
        </div>
      </div>
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-30">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* PDF Iframe */}
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
