
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Annotation } from "./PDFAnnotationCanvas";
import { SetlistDrawer } from "./setlist/SetlistDrawer";
import { PDFControls } from "./pdf/PDFControls";
import { PDFMobileControls } from "./pdf/PDFMobileControls";
import { PDFDocument } from "./pdf/PDFDocument";
import { PDFAnnotationManager } from "./pdf/PDFAnnotationManager";

interface PDFViewerProps {
  url: string;
  title: string;
  sheetMusicId?: string;
}

export const PDFViewer = ({ url, title, sheetMusicId }: PDFViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100); // Zoom level in percentage
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [isSetlistOpen, setIsSetlistOpen] = useState(false);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load annotations when component mounts or URL/user changes
  useEffect(() => {
    // Reset zoom when URL changes
    setZoom(100);
    setIsLoading(true);
    setCurrentPage(1);
    setAnnotations([]);
    
    // If the user is authenticated and we have a sheet music ID, load annotations
    if (user && sheetMusicId) {
      loadAnnotations();
    }
  }, [url, user, sheetMusicId]);
  
  // Function to load annotations from the database
  const loadAnnotations = async () => {
    if (!user || !sheetMusicId) return;
    
    try {
      const { data, error } = await supabase
        .from('pdf_annotations')
        .select('*')
        .eq('sheet_music_id', sheetMusicId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found" error
        throw error;
      }

      if (data && data.annotations) {
        // Ensure annotations is properly typed
        const savedAnnotations = data.annotations as unknown as Annotation[];
        setAnnotations(savedAnnotations);
      }
    } catch (error) {
      console.error("Error loading annotations:", error);
    }
  };
  
  // Handle iframe load
  const handleLoad = () => {
    setIsLoading(false);
    
    // Update canvas dimensions based on the iframe content size
    if (containerRef.current) {
      const updateCanvasSize = () => {
        setCanvasWidth(containerRef.current?.clientWidth || 0);
        setCanvasHeight(containerRef.current?.clientHeight || 0);
      };
      
      // Initial size update
      updateCanvasSize();
      
      // Update size on resize
      window.addEventListener('resize', updateCanvasSize);
      return () => window.removeEventListener('resize', updateCanvasSize);
    }
  };
  
  // Handle PDF loading error
  const handleError = () => {
    setIsLoading(false);
    setError("Failed to load PDF. Please try again later.");
    toast({
      title: "Error loading PDF",
      description: "The PDF could not be loaded. Please try again later.",
      variant: "destructive",
    });
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
  
  return (
    <div className="relative flex flex-col w-full rounded-lg border border-border overflow-hidden">
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
          url={url}
          hasAnnotationSupport={!!sheetMusicId}
          user={user}
        />
      )}
      
      {/* Mobile Controls at the top */}
      {isMobile && (
        <div className="sticky top-0 z-10 w-full">
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
            url={url}
          />
          
          {/* Annotation Manager for mobile always at the top */}
          {isMobile && showAnnotations && (
            <PDFAnnotationManager
              showAnnotations={showAnnotations}
              containerRef={containerRef}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              zoom={zoom}
              user={user}
              sheetMusicId={sheetMusicId}
              annotations={annotations}
              setAnnotations={setAnnotations}
            />
          )}
        </div>
      )}
      
      {/* Desktop Annotation Manager */}
      {!isMobile && (
        <PDFAnnotationManager
          showAnnotations={showAnnotations}
          containerRef={containerRef}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          zoom={zoom}
          user={user}
          sheetMusicId={sheetMusicId}
          annotations={annotations}
          setAnnotations={setAnnotations}
        />
      )}
      
      {/* PDF Document Container */}
      <div 
        ref={containerRef} 
        className="relative w-full flex justify-center" 
        style={{ height: isMobile ? "calc(100vh - 250px)" : "70vh" }}
      >
        <PDFDocument
          url={url}
          currentPage={currentPage}
          zoom={zoom}
          isLoading={isLoading}
          onLoad={handleLoad}
          onError={handleError}
          error={error}
          title={title}
        />
      </div>
      
      {/* Footer Controls */}
      <div className="p-4 border-t bg-muted/30 flex flex-wrap gap-2 justify-between">
        <Button 
          variant="outline"
          size={isMobile ? "sm" : "default"}
          onClick={() => window.history.back()}
          className={isMobile ? "text-xs px-2" : ""}
        >
          Back
        </Button>
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
