
import React, { useState, useEffect, useRef } from "react";
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
import { Button } from "@/components/ui/button";
import { AuthUser } from "@/types/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PDFViewerProps {
  url: string;
  title: string;
  sheetMusicId?: string;
  fullHeight?: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
}

export const PDFViewer = ({ 
  url, 
  title, 
  sheetMusicId, 
  fullHeight,
  canDelete = false,
  onDelete 
}: PDFViewerProps) => {
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { toast: toastLegacy } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  
  // Validate URL
  useEffect(() => {
    if (!url) {
      setError("No PDF URL provided");
      setIsLoading(false);
    } else {
      // Reset errors when URL is provided
      setError(null);
      setIsLoading(true);
    }
    
    console.log("PDF URL received:", url);
  }, [url]);
  
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
      // Enter fullscreen
      if (viewerRef.current?.requestFullscreen) {
        viewerRef.current.requestFullscreen().catch(err => {
          toast.error("Error attempting to enable fullscreen", {
            description: err.message
          });
        });
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
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
        .maybeSingle();

      if (error) {
        console.error("Error loading annotations:", error);
        return;
      }

      if (data && data.annotations) {
        // Parse the stored annotations and ensure they match our type
        try {
          // Need to cast the Json type to Annotation[] after converting
          const parsedAnnotations = data.annotations as any;
          
          // Verify the structure matches our Annotation[] type and provide defaults for missing properties
          const convertedAnnotations = (Array.isArray(parsedAnnotations) ? 
            parsedAnnotations.map((ann: any) => ({
              id: ann.id || String(Date.now()),
              type: ann.type as "pen" | "eraser" | "square" | null,
              points: Array.isArray(ann.points) ? ann.points.map((p: any) => ({
                x: typeof p.x === 'number' ? p.x : 0,
                y: typeof p.y === 'number' ? p.y : 0
              })) : [],
              color: typeof ann.color === 'string' ? ann.color : '#FF0000',
              size: typeof ann.size === 'number' ? ann.size : 3,
              x: typeof ann.x === 'number' ? ann.x : undefined,
              y: typeof ann.y === 'number' ? ann.y : undefined,
              width: typeof ann.width === 'number' ? ann.width : undefined,
              height: typeof ann.height === 'number' ? ann.height : undefined
            })) : []) as Annotation[];
            
          setAnnotations(convertedAnnotations);
          console.log("Loaded annotations:", convertedAnnotations);
        } catch (parseError) {
          console.error("Error parsing annotations:", parseError);
          // If parsing fails, initialize with empty annotations
          setAnnotations([]);
        }
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
    setError("Failed to load PDF. Please try again later or download it directly.");
    toast.error("The PDF could not be loaded", {
      description: "Please try downloading it instead."
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

  // Handle delete
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else if (canDelete && sheetMusicId) {
      deleteSheetMusic();
    }
  };

  // Delete sheet music
  const deleteSheetMusic = async () => {
    if (!sheetMusicId) return;
    
    try {
      // Find the file in media_library
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_library')
        .select('file_path, id')
        .eq('id', sheetMusicId)
        .maybeSingle();
      
      if (mediaError) throw mediaError;
      
      if (!mediaData) {
        toast.error("File not found", {
          description: "Could not locate the file in the database"
        });
        return;
      }
      
      // Delete annotations first (foreign key relationship)
      const { error: annotationsError } = await supabase
        .from('pdf_annotations')
        .delete()
        .eq('sheet_music_id', sheetMusicId);
      
      if (annotationsError) {
        console.error("Error deleting annotations:", annotationsError);
        // Continue with deletion even if annotations deletion fails
      }
      
      // Delete from setlists (update the arrays)
      const { data: setlists, error: setlistsError } = await supabase
        .from('setlists')
        .select('id, sheet_music_ids');
        
      if (!setlistsError && setlists) {
        for (const setlist of setlists) {
          if (setlist.sheet_music_ids?.includes(sheetMusicId)) {
            const updatedIds = setlist.sheet_music_ids.filter(id => id !== sheetMusicId);
            await supabase
              .from('setlists')
              .update({ sheet_music_ids: updatedIds })
              .eq('id', setlist.id);
          }
        }
      }
      
      // Delete from storage
      if (mediaData.file_path) {
        const { error: storageError } = await supabase.storage
          .from('media-library')
          .remove([mediaData.file_path]);
          
        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', sheetMusicId);
        
      if (dbError) throw dbError;
      
      toast.success("Sheet music deleted", {
        description: "The file has been successfully removed"
      });
      
      // Navigate back
      navigate('/dashboard/sheet-music');
      
    } catch (error: any) {
      console.error("Error deleting sheet music:", error);
      toast.error("Failed to delete", {
        description: error.message || "An unexpected error occurred"
      });
    }
  };
  
  return (
    <div 
      ref={viewerRef}
      className={`relative flex flex-col w-full rounded-lg border border-border overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}
    >
      {/* ForScore-style controls - All controls at the top for mobile */}
      {isMobile && (
        <div className="sticky top-0 z-30 w-full">
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
            onDelete={handleDelete}
          />
          
          {/* Annotation toolbar at the top for mobile in ForScore style */}
          {showAnnotations && (
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
      
      {/* Desktop Controls */}
      {!isMobile && (
        <>
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
            canDelete={canDelete}
            onDelete={handleDelete}
          />
          
          {/* Desktop Annotation Manager */}
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
        </>
      )}
      
      {/* PDF Document Container - Apply fullHeight prop if provided */}
      <div 
        ref={containerRef} 
        className="relative w-full flex justify-center bg-gray-100 overflow-hidden" 
        style={{ 
          height: fullHeight ? "calc(100vh - 60px)" : 
                  isFullscreen ? "calc(100vh - 60px)" : 
                  isMobile ? "calc(100vh - 180px)" : "70vh",
          position: "relative"
        }}
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
      
      {/* Footer Controls - Hide in fullscreen mode */}
      {!isFullscreen && (
        <div className="p-2 border-t bg-muted/30 flex flex-wrap gap-2 justify-between">
          <Button 
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={() => window.history.back()}
            className={isMobile ? "text-xs px-2 max-w-[120px] truncate" : ""}
          >
            Back
          </Button>
        </div>
      )}

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
