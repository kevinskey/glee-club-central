
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { PDFControls } from "./PDFControls";
import { PDFMobileControls } from "./PDFMobileControls";
import { PDFDocument } from "./PDFDocument";
import { SetlistDrawer } from "@/components/setlist/SetlistDrawer";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AuthUser } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PDFViewerProps {
  url: string;
  title: string;
  sheetMusicId?: string;
  fullHeight?: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
  user?: AuthUser | null;
}

export const PDFViewer = ({ 
  url, 
  title, 
  sheetMusicId, 
  fullHeight = false,
  canDelete = false,
  onDelete,
  user = null
}: PDFViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [isSetlistOpen, setIsSetlistOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const viewerRef = React.useRef<HTMLDivElement>(null);
  
  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Toggle fullscreen function
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (viewerRef.current?.requestFullscreen) {
        viewerRef.current.requestFullscreen().catch(err => {
          toast.error("Error enabling fullscreen", {
            description: err.message
          });
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Zoom handlers
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 200)); // Maximum 200% zoom
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 50)); // Minimum 50% zoom
  };
  
  // Page navigation handlers
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
  
  // Toggle annotations
  const toggleAnnotations = () => {
    setShowAnnotations(!showAnnotations);
  };
  
  // Toggle setlist drawer
  const toggleSetlist = () => {
    setIsSetlistOpen(!isSetlistOpen);
  };

  // Handle PDF load and error
  const handleLoad = () => {
    setIsLoading(false);
    setTotalPages(1); // In a real implementation, this would come from the PDF
  };
  
  const handleError = () => {
    setIsLoading(false);
    setError("Failed to load PDF. Please try again later or download it directly.");
    toast.error("The PDF could not be loaded", {
      description: "Please try downloading it instead."
    });
  };
  
  return (
    <div 
      ref={viewerRef}
      className={`relative flex flex-col w-full rounded-lg border border-border overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}
      style={{ maxHeight: isMobile ? '100%' : undefined }}
    >
      {/* Mobile Controls */}
      {isMobile && (
        <PDFMobileControls
          user={user}
          hasAnnotationSupport={!!sheetMusicId}
          showAnnotations={showAnnotations}
          toggleAnnotations={toggleAnnotations}
          isSetlistOpen={isSetlistOpen}
          toggleSetlist={toggleSetlist}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onZoomOut={handleZoomOut}
          onZoomIn={handleZoomIn}
          onFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          url={url}
          canDelete={canDelete}
          onDelete={onDelete}
        />
      )}
      
      {/* Desktop Controls */}
      {!isMobile && (
        <PDFControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onDownload={() => window.open(url, "_blank")}
          showAnnotations={showAnnotations}
          toggleAnnotations={toggleAnnotations}
          isSetlistOpen={isSetlistOpen}
          toggleSetlist={toggleSetlist}
          onFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          url={url}
          hasAnnotationSupport={!!sheetMusicId}
          user={user}
          canDelete={canDelete}
          onDelete={onDelete}
        />
      )}
      
      {/* PDF Document Container */}
      <div 
        ref={containerRef} 
        className="relative w-full flex justify-center overflow-auto" 
        style={{ 
          height: fullHeight ? "calc(100vh - 60px)" : 
                  isFullscreen ? "calc(100vh - 60px)" : 
                  isMobile ? "calc(100vh - 160px)" : "70vh",
          position: "relative",
          backgroundColor: "#f4f4f5", // Light gray background
          WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
        }}
      >
        <PDFDocument
          url={url}
          currentPage={currentPage}
          zoom={isMobile ? Math.min(zoom, 150) : zoom} // Limit zoom on mobile
          isLoading={isLoading}
          onLoad={handleLoad}
          onError={handleError}
          error={error}
          title={title}
        />
      </div>
      
      {/* Footer with Back Button */}
      <div className="p-2 md:p-3 border-t bg-muted/30 flex justify-between items-center shadow-sm">
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs md:text-sm"
        >
          <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
          Back
        </Button>
        <div className="text-xs text-muted-foreground">
          {error ? "Error loading PDF" : isLoading ? "Loading..." : `Page ${currentPage} of ${totalPages}`}
        </div>
      </div>

      {/* Setlist Drawer */}
      {user && (
        <SetlistDrawer
          open={isSetlistOpen}
          onOpenChange={setIsSetlistOpen}
          currentSheetMusicId={sheetMusicId}
        />
      )}
    </div>
  );
};
