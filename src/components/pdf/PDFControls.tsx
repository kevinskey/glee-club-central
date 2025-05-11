import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, 
  Pencil, ListMusic, Maximize, Minimize 
} from "lucide-react";
import { AuthUser } from "@/types/auth";

interface PDFControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDownload: () => void;
  hasAnnotationSupport?: boolean;
  showAnnotations: boolean;
  toggleAnnotations: () => void;
  isSetlistOpen: boolean;
  toggleSetlist: () => void;
  url: string;
  user: AuthUser | null;
}

export const PDFControls: React.FC<PDFControlsProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onDownload,
  hasAnnotationSupport = false,
  showAnnotations,
  toggleAnnotations,
  isSetlistOpen,
  toggleSetlist,
  url,
  user
}) => {
  return (
    <div className="flex items-center justify-between p-2 border-b bg-card/60">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        {hasAnnotationSupport && user && (
          <Button
            variant={showAnnotations ? "default" : "outline"}
            size="sm"
            onClick={toggleAnnotations}
            title="Toggle annotations"
            className={showAnnotations ? "bg-glee-purple hover:bg-glee-purple/90" : ""}
          >
            <Pencil className="h-4 w-4 mr-2" />
            {showAnnotations ? "Hide Markup" : "Add Markup"}
          </Button>
        )}
        
        {user && (
          <Button
            variant={isSetlistOpen ? "default" : "outline"}
            size="sm"
            onClick={toggleSetlist}
            title="Add to setlist"
          >
            <ListMusic className="h-4 w-4 mr-2" />
            {isSetlistOpen ? "Close Setlist" : "Add to Setlist"}
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          title="Download PDF"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};
