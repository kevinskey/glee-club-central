
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ZoomIn, ZoomOut, Download, ArrowLeft, ArrowRight, Pen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { PDFAnnotationToolbar, AnnotationTool } from "./PDFAnnotationToolbar";
import { PDFAnnotationCanvas, Annotation } from "./PDFAnnotationCanvas";

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
  const [activeTool, setActiveTool] = useState<AnnotationTool>(null);
  const [penColor, setPenColor] = useState("#FF0000"); // Default to red
  const [penSize, setPenSize] = useState(3);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Set appropriate viewer parameters based on device
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
  
  // Fetch annotations when the user and sheet music ID are available
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
        setAnnotations(data.annotations);
      }
    } catch (error) {
      console.error("Error loading annotations:", error);
    }
  };

  // Save annotations to the database
  const saveAnnotations = async () => {
    if (!user || !sheetMusicId) {
      toast({
        title: "Cannot save annotations",
        description: "You must be logged in to save annotations.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('pdf_annotations')
        .upsert(
          {
            sheet_music_id: sheetMusicId,
            user_id: user.id,
            annotations,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'sheet_music_id,user_id' }
        );

      if (error) throw error;

      toast({
        title: "Annotations saved",
        description: "Your annotations have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving annotations:", error);
      toast({
        title: "Error saving annotations",
        description: "There was an error saving your annotations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLoad = () => {
    setIsLoading(false);
    
    // Update canvas dimensions based on the iframe content size
    if (iframeRef.current && containerRef.current) {
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
  
  const toggleAnnotations = () => {
    setShowAnnotations(!showAnnotations);
    if (showAnnotations) {
      setActiveTool(null); // Turn off active tool when hiding annotations
    }
  };
  
  const handleClearAnnotations = () => {
    if (window.confirm("Are you sure you want to clear all annotations?")) {
      setAnnotations([]);
    }
  };
  
  const handleAnnotationsChange = (newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);
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
                {user && sheetMusicId && (
                  <MenubarItem 
                    onClick={toggleAnnotations}
                    className="flex items-center gap-2"
                  >
                    <Pen className="h-4 w-4" /> 
                    {showAnnotations ? "Hide Annotations" : "Show Annotations"}
                  </MenubarItem>
                )}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          
          {/* Show annotation toggle button outside menu on larger screens */}
          {!isMobile && user && sheetMusicId && (
            <Button
              variant={showAnnotations ? "default" : "outline"}
              size="sm"
              onClick={toggleAnnotations}
              className="flex items-center gap-1"
            >
              <Pen className="h-4 w-4" />
              {showAnnotations ? "Hide" : "Annotate"}
            </Button>
          )}
        </div>
      </div>
      
      {/* Annotation toolbar */}
      {showAnnotations && (
        <PDFAnnotationToolbar
          isOpen={showAnnotations}
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onSave={saveAnnotations}
          onClear={handleClearAnnotations}
          penColor={penColor}
          onPenColorChange={setPenColor}
          penSize={penSize}
          onPenSizeChange={setPenSize}
        />
      )}
      
      <div ref={containerRef} className="relative w-full flex justify-center" style={{ height: isMobile ? "calc(100vh - 200px)" : "70vh" }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-30">
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
          <div className="w-full h-full overflow-auto flex justify-center">
            <iframe 
              ref={iframeRef}
              src={getPdfViewerUrl()}
              className="w-full h-full max-w-3xl mx-auto" 
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                width: `${100 / (zoom / 100)}%`,
                height: `${100 / (zoom / 100)}%`
              }}
              onLoad={handleLoad}
              onError={handleError}
              title={title}
            />
            
            {showAnnotations && (
              <PDFAnnotationCanvas
                containerRef={containerRef}
                activeTool={activeTool}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                penColor={penColor}
                penSize={penSize}
                scale={zoom / 100}
                annotations={annotations}
                onChange={handleAnnotationsChange}
              />
            )}
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
            
            {/* Mobile annotation toggle */}
            {user && sheetMusicId && (
              <Button
                variant={showAnnotations ? "default" : "outline"}
                size="sm"
                onClick={toggleAnnotations}
                className="text-xs px-2"
              >
                <Pen className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
