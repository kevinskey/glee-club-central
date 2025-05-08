
import React, { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

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
  
  // Ensure the URL is properly sanitized
  const sanitizedUrl = url.trim();
  
  // Build PDF URL with appropriate parameters
  const getPdfViewerUrl = () => {
    const isMobile = window.innerWidth < 768;
    
    // Check if the URL already contains a hash fragment
    const baseUrl = sanitizedUrl.includes('#') 
      ? sanitizedUrl 
      : `${sanitizedUrl}#`;
    
    // Add parameters optimized for score reading
    let viewerUrl = baseUrl;
    
    // Only append parameters if they're not already in the URL
    if (!baseUrl.includes('view=')) {
      if (isMobile) {
        // Mobile optimization: fit width for score reading
        viewerUrl += baseUrl.includes('?') || baseUrl.includes('#') ? '&' : '#';
        viewerUrl += "toolbar=0&navpanes=0&view=FitH&scrollbar=0";
      } else {
        // Desktop: Optimize for score reading
        viewerUrl += baseUrl.includes('?') || baseUrl.includes('#') ? '&' : '#';
        viewerUrl += "toolbar=0&navpanes=1&view=FitH&scrollbar=1";
      }
    }
    
    // Add page parameter if needed and not already present
    if (currentPage > 1 && !viewerUrl.includes('page=')) {
      viewerUrl += viewerUrl.includes('?') || viewerUrl.includes('&') ? '&' : '#';
      viewerUrl += `page=${currentPage}`;
    }
    
    return viewerUrl;
  };

  // Log for debugging
  useEffect(() => {
    console.log("PDF URL being used:", getPdfViewerUrl());
  }, [url, currentPage, zoom]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <p className="mb-4 text-muted-foreground">{error}</p>
          <button 
            onClick={() => window.open(sanitizedUrl, "_blank")}
            className="px-4 py-2 border rounded-md hover:bg-muted"
          >
            Download PDF Instead
          </button>
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
        onError={onError}
        title={title}
        frameBorder="0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
      />
      
      {children}
    </div>
  );
};
