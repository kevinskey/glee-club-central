
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ZoomIn, ZoomOut, Download, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

interface PDFViewerProps {
  url: string;
  title: string;
}

export const PDFViewer = ({ url, title }: PDFViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100); // Zoom level in percentage
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Set appropriate viewer parameters based on device
  useEffect(() => {
    // Reset zoom when URL changes
    setZoom(100);
    setIsLoading(true);
    setCurrentPage(1);
  }, [url]);
  
  const handleLoad = () => {
    setIsLoading(false);
    // Attempt to get total pages from iframe
    try {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        // We can't reliably get page count from PDF embedded in iframe due to security restrictions
        // So we'll just set a placeholder value here
        setTotalPages(1);
      }
    } catch (e) {
      console.error("Could not access PDF information:", e);
    }
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
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Build PDF URL with appropriate parameters for the device type and score reading
  const getPdfViewerUrl = () => {
    // Starting with the base URL
    let viewerUrl = `${url}#`;
    
    // Add parameters optimized for score reading
    if (isMobile) {
      // Mobile optimization: fit width for score reading
      viewerUrl += "toolbar=0&navpanes=0&view=FitH&scrollbar=1";
    } else {
      // Desktop: Optimize for score reading
      viewerUrl += "toolbar=0&navpanes=1&view=FitH&scrollbar=1";
    }
    
    // Add page parameter if needed
    if (currentPage > 1) {
      viewerUrl += `&page=${currentPage}`;
    }
    
    return viewerUrl;
  };
  
  return (
    <div className="relative flex flex-col w-full rounded-lg border border-border">
      {/* Top Navigation Bar for PDF */}
      <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b bg-background">
        <h3 className="text-lg font-medium truncate">{title}</h3>
        <div className="flex items-center gap-2">
          {!isMobile && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevPage} 
                disabled={currentPage <= 1}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">{currentPage}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage} 
                disabled={currentPage >= totalPages}
                className="flex items-center"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Menubar className="border-none bg-transparent p-0">
            <MenubarMenu>
              <MenubarTrigger className="h-8 px-3 text-xs">Options</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={handleZoomIn} className="flex items-center gap-2">
                  <ZoomIn className="h-4 w-4" /> Zoom In
                </MenubarItem>
                <MenubarItem onClick={handleZoomOut} className="flex items-center gap-2">
                  <ZoomOut className="h-4 w-4" /> Zoom Out
                </MenubarItem>
                <MenubarItem 
                  onClick={() => window.open(url, "_blank")}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" /> Download
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
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
          <div className="w-full h-full overflow-auto">
            <iframe 
              src={getPdfViewerUrl()}
              className="w-full h-full" 
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
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
        
        {isMobile && (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="text-xs px-2"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="text-xs px-2"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="default"
              size="sm"
              onClick={() => window.open(url, "_blank")}
              className="text-xs px-2"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
