
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
    <div className="flex flex-col gap-2 w-full">
      {/* Mobile annotation and setlist toggle buttons */}
      {user && (
        <div className="flex justify-center gap-2 p-2 border-b bg-background/95 rounded-t-lg shadow-sm">
          {hasAnnotationSupport && (
            <Button
              variant={showAnnotations ? "default" : "outline"}
              size="sm"
              onClick={toggleAnnotations}
              className={`flex items-center gap-1 ${showAnnotations ? "bg-glee-purple hover:bg-glee-purple/90 text-white" : ""}`}
            >
              <Pen className="h-4 w-4" />
              {showAnnotations ? "Hide Notes" : "Add Notes"}
            </Button>
          )}
          <Button
            variant={isSetlistOpen ? "default" : "outline"}
            size="sm"
            onClick={toggleSetlist}
            className={`flex items-center gap-1 ${isSetlistOpen ? "bg-glee-purple hover:bg-glee-purple/90 text-white" : ""}`}
          >
            <ListMusic className="h-4 w-4" />
            Setlist
          </Button>
        </div>
      )}
      
      {/* Mobile navigation and zoom controls */}
      <div className="flex justify-between items-center p-2 border-t bg-background/95 rounded-b-lg shadow-sm">
        {/* Page navigation controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium px-2">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="default"
            size="sm"
            onClick={() => window.open(url, "_blank")}
            className="h-8 w-8 p-0 rounded-full bg-glee-purple hover:bg-glee-purple/90"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
