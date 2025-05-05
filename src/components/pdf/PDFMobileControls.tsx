
import React from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Download, ArrowLeft, ArrowRight, Pen, ListMusic, Maximize2 } from "lucide-react";

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
  onFullscreen: () => void;
  isFullscreen: boolean;
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
  onFullscreen,
  isFullscreen,
  url,
}: PDFMobileControlsProps) => {
  return (
    <div className="flex flex-col gap-1 w-full max-w-full bg-background/95 shadow-sm z-30">
      {/* Mobile top controls - ForScore style */}
      <div className="flex justify-between items-center p-2 border-b w-full">
        {/* Page navigation controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="h-8 w-8 p-0 rounded-full flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium px-1 whitespace-nowrap">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className="h-8 w-8 p-0 rounded-full flex-shrink-0"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Tools controls */}
        {user && (
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
            {hasAnnotationSupport && (
              <Button
                variant={showAnnotations ? "default" : "outline"}
                size="sm"
                onClick={toggleAnnotations}
                className={`h-8 px-3 ${showAnnotations ? "bg-glee-purple hover:bg-glee-purple/90 text-white" : ""} flex-shrink-0`}
              >
                <Pen className="h-4 w-4 mr-1" />
                <span className="text-xs">{showAnnotations ? "Notes" : "Notes"}</span>
              </Button>
            )}
            <Button
              variant={isSetlistOpen ? "default" : "outline"}
              size="sm"
              onClick={toggleSetlist}
              className={`h-8 px-3 ${isSetlistOpen ? "bg-glee-purple hover:bg-glee-purple/90 text-white" : ""} flex-shrink-0`}
            >
              <ListMusic className="h-4 w-4 mr-1" />
              <span className="text-xs">Setlist</span>
            </Button>
          </div>
        )}
        
        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            className="h-8 w-8 p-0 rounded-full flex-shrink-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            className="h-8 w-8 p-0 rounded-full flex-shrink-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={onFullscreen}
            className="h-8 w-8 p-0 rounded-full flex-shrink-0"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="default"
            size="sm"
            onClick={() => window.open(url, "_blank")}
            className="h-8 w-8 p-0 rounded-full bg-glee-purple hover:bg-glee-purple/90 flex-shrink-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
