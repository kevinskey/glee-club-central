
import React from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Download, ArrowLeft, ArrowRight, Pen, ListMusic } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

interface PDFControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDownload: () => void;
  showAnnotations: boolean;
  toggleAnnotations: () => void;
  isSetlistOpen: boolean;
  toggleSetlist: () => void;
  url: string;
  hasAnnotationSupport: boolean;
  user: any;
}

export const PDFControls = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onDownload,
  showAnnotations,
  toggleAnnotations,
  isSetlistOpen,
  toggleSetlist,
  url,
  hasAnnotationSupport,
  user,
}: PDFControlsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b bg-background">
      <div className="flex items-center gap-2">
        {!isMobile && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPrevPage} 
              disabled={currentPage <= 1}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">{currentPage}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNextPage} 
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
              <MenubarItem onClick={onZoomIn} className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4" /> Zoom In
              </MenubarItem>
              <MenubarItem onClick={onZoomOut} className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4" /> Zoom Out
              </MenubarItem>
              <MenubarItem 
                onClick={() => window.open(url, "_blank")}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Download
              </MenubarItem>
              {user && hasAnnotationSupport && (
                <MenubarItem 
                  onClick={toggleAnnotations}
                  className="flex items-center gap-2"
                >
                  <Pen className="h-4 w-4" /> 
                  {showAnnotations ? "Hide Annotations" : "Show Annotations"}
                </MenubarItem>
              )}
              {user && (
                <MenubarItem 
                  onClick={toggleSetlist}
                  className="flex items-center gap-2"
                >
                  <ListMusic className="h-4 w-4" /> 
                  {isSetlistOpen ? "Hide Setlist" : "Show Setlist"}
                </MenubarItem>
              )}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        
        {/* Show annotation toggle button outside menu on larger screens */}
        {!isMobile && user && hasAnnotationSupport && (
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

        {/* Show setlist toggle button outside menu on larger screens */}
        {!isMobile && user && (
          <Button
            variant={isSetlistOpen ? "default" : "outline"}
            size="sm"
            onClick={toggleSetlist}
            className="flex items-center gap-1"
          >
            <ListMusic className="h-4 w-4" />
            Setlist
          </Button>
        )}
      </div>
    </div>
  );
};
