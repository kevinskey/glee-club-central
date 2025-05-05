
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ZoomIn, ZoomOut, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface PDFViewerProps {
  url: string;
  title: string;
}

export const PDFViewer = ({ url, title }: PDFViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100); // Zoom level in percentage
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Set appropriate viewer parameters based on device
  useEffect(() => {
    // Reset zoom when URL changes
    setZoom(100);
    setIsLoading(true);
  }, [url]);
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setError("Failed to load PDF. Please try again later.");
    toast({
      title: "Error loading PDF",
      description: "The PDF could not be loaded. Please try again later.",
      variant: "destructive",
    });
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 200)); // Maximum 200% zoom
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 50)); // Minimum 50% zoom
  };
  
  // Build PDF URL with appropriate parameters for the device type
  const getPdfViewerUrl = () => {
    // Starting with the base URL
    let viewerUrl = `${url}#`;
    
    // Add parameters for different devices
    if (isMobile) {
      // Mobile optimization: disable toolbar, fit page to width
      viewerUrl += "toolbar=0&navpanes=0&view=FitH";
    } else {
      // Desktop: Allow toolbar but still optimize view
      viewerUrl += "toolbar=1&navpanes=1&view=FitH";
    }
    
    return viewerUrl;
  };
  
  return (
    <div className="relative flex flex-col w-full rounded-lg border border-border">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      
      <div className="relative w-full" style={{ height: isMobile ? "calc(100vh - 200px)" : "70vh" }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {error ? (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div>
              <p className="mb-4 text-muted-foreground">{error}</p>
              <Button 
                onClick={() => window.open(url, "_blank")}
                variant="outline"
              >
                Download PDF Instead
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full" style={{ overflow: "hidden" }}>
            <iframe 
              src={getPdfViewerUrl()}
              className="w-full h-full" 
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left',
                width: `${100 / (zoom / 100)}%`,
                height: `${100 / (zoom / 100)}%`
              }}
              onLoad={handleLoad}
              onError={handleError}
            />
          </div>
        )}
      </div>
      
      <div className="p-4 border-t bg-muted/30 flex flex-wrap gap-2 justify-between">
        <Button 
          variant="outline"
          size={isMobile ? "sm" : "default"}
          onClick={() => window.history.back()}
          className={isMobile ? "text-xs px-2" : ""}
        >
          Back
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={handleZoomOut}
            className={isMobile ? "text-xs px-2" : ""}
          >
            <ZoomOut className="h-4 w-4 mr-1" /> 
            {!isMobile && "Zoom Out"}
          </Button>
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={handleZoomIn}
            className={isMobile ? "text-xs px-2" : ""}
          >
            <ZoomIn className="h-4 w-4 mr-1" />
            {!isMobile && "Zoom In"}
          </Button>
          <Button 
            variant="default"
            size={isMobile ? "sm" : "default"}
            onClick={() => window.open(url, "_blank")}
            className={isMobile ? "text-xs px-2" : ""}
          >
            <Download className="h-4 w-4 mr-1" />
            {!isMobile && "Open in New Tab"}
          </Button>
        </div>
      </div>
    </div>
  );
};
