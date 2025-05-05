
import React from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Download, ArrowLeft, ArrowRight, Pen, ListMusic } from "lucide-react";

interface PDFMobileControlsProps {
  user: any;
  hasAnnotationSupport: boolean;
  showAnnotations: boolean;
  toggleAnnotations: () => void;
  isSetlistOpen: boolean;
  toggleSetlist: () => void;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  url: string;
}

export const PDFMobileControls = ({
  user,
  hasAnnotationSupport,
  showAnnotations,
  toggleAnnotations,
  isSetlistOpen,
  toggleSetlist,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onZoomOut,
  onZoomIn,
  url,
}: PDFMobileControlsProps) => {
  return (
    <>
      {/* Mobile annotation and setlist toggle buttons at the top for better visibility */}
      {user && (
        <div className="flex justify-center gap-2 p-2 border-b">
          {hasAnnotationSupport && (
            <Button
              variant={showAnnotations ? "default" : "outline"}
              size="sm"
              onClick={toggleAnnotations}
              className="flex items-center gap-1"
            >
              <Pen className="h-4 w-4" />
              {showAnnotations ? "Hide Annotations" : "Annotate"}
            </Button>
          )}
          <Button
            variant={isSetlistOpen ? "default" : "outline"}
            size="sm"
            onClick={toggleSetlist}
            className="flex items-center gap-1"
          >
            <ListMusic className="h-4 w-4" />
            Setlist
          </Button>
        </div>
      )}
      
      {/* Mobile navigation and zoom controls at the bottom */}
      <div className="flex gap-1">
        {/* Page navigation controls for mobile */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          className="text-xs px-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="flex items-center justify-center text-xs px-2">
          {currentPage}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          className="text-xs px-2"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        
        {/* Zoom controls */}
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          className="text-xs px-2"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
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
    </>
  );
};
