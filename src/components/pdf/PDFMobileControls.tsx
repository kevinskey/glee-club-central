
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Trash2, Pencil, ListMusic, Maximize, Minimize } from "lucide-react";
import { AuthUser } from "@/types/auth";

interface PDFMobileControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
  hasAnnotationSupport?: boolean;
  showAnnotations: boolean;
  toggleAnnotations: () => void;
  isSetlistOpen: boolean;
  toggleSetlist: () => void;
  url: string;
  user: AuthUser | null;
  onDelete?: () => void;
  canDelete?: boolean;
}

export const PDFMobileControls: React.FC<PDFMobileControlsProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onFullscreen,
  isFullscreen,
  hasAnnotationSupport = false,
  showAnnotations,
  toggleAnnotations,
  isSetlistOpen,
  toggleSetlist,
  url,
  user,
  canDelete = false,
  onDelete
}) => {
  return (
    <div className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur-sm border-b p-1.5 flex flex-wrap justify-between items-center gap-1 shadow-sm">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-xs font-medium bg-muted/50 px-2 py-1 rounded">
          {currentPage}/{totalPages}
        </span>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          className="h-8 w-8"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          className="h-8 w-8"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onFullscreen}
          className="h-8 w-8"
          title={isFullscreen ? "Exit Fullscreen" : "Full Screen"}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="flex items-center gap-1">
        {user && hasAnnotationSupport && (
          <Button
            variant={showAnnotations ? "secondary" : "outline"}
            size="icon"
            onClick={toggleAnnotations}
            className="h-8 w-8"
            title={showAnnotations ? "Hide Annotations" : "Show Annotations"}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        
        {user && (
          <Button
            variant={isSetlistOpen ? "secondary" : "outline"}
            size="icon"
            onClick={toggleSetlist}
            className="h-8 w-8"
            title={isSetlistOpen ? "Close Setlist" : "Add to Setlist"}
          >
            <ListMusic className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(url, "_blank")}
          className="h-8 w-8"
          title="Download PDF"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        {canDelete && onDelete && (
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            title="Delete PDF"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
