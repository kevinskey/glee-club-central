
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
    <div className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur-sm border-b py-1.5 px-2 flex flex-wrap justify-between items-center gap-2 shadow-sm">
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          className="h-9 w-9" // Larger touch target
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
          {currentPage}/{totalPages}
        </span>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          className="h-9 w-9" // Larger touch target
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          className="h-9 w-9" // Larger touch target
          title="Zoom Out"
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          className="h-9 w-9" // Larger touch target
          title="Zoom In"
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onFullscreen}
          className="h-9 w-9" // Larger touch target
          title={isFullscreen ? "Exit Fullscreen" : "Full Screen"}
        >
          {isFullscreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className="flex items-center gap-1.5 ml-auto">
        {user && hasAnnotationSupport && (
          <Button
            variant={showAnnotations ? "secondary" : "outline"}
            size="icon"
            onClick={toggleAnnotations}
            className="h-9 w-9" // Larger touch target
            title={showAnnotations ? "Hide Annotations" : "Show Annotations"}
          >
            <Pencil className="h-5 w-5" />
          </Button>
        )}
        
        {user && (
          <Button
            variant={isSetlistOpen ? "secondary" : "outline"}
            size="icon"
            onClick={toggleSetlist}
            className="h-9 w-9" // Larger touch target
            title={isSetlistOpen ? "Close Setlist" : "Add to Setlist"}
          >
            <ListMusic className="h-5 w-5" />
          </Button>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(url, "_blank")}
          className="h-9 w-9" // Larger touch target
          title="Download PDF"
        >
          <Download className="h-5 w-5" />
        </Button>
        
        {canDelete && onDelete && (
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
            className="h-9 w-9 text-destructive hover:bg-destructive/10" // Larger touch target
            title="Delete PDF"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
