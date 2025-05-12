
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, 
  Pencil, ListMusic, Maximize, Minimize, Menu 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthUser } from "@/types/auth";
import { toast } from "sonner";

interface PDFMobileControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  hasAnnotationSupport?: boolean;
  showAnnotations: boolean;
  toggleAnnotations: () => void;
  isSetlistOpen: boolean;
  toggleSetlist: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
  url: string;
  user: AuthUser | null;
}

export const PDFMobileControls: React.FC<PDFMobileControlsProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  hasAnnotationSupport = false,
  showAnnotations,
  toggleAnnotations,
  isSetlistOpen,
  toggleSetlist,
  onFullscreen,
  isFullscreen,
  url,
  user
}) => {
  return (
    <div className="flex items-center justify-between p-2 border-b bg-card/60">
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-sm">
          {currentPage}/{totalPages}
        </div>
        
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

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          className="h-8 w-8"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          className="h-8 w-8"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {hasAnnotationSupport && user && (
              <DropdownMenuItem onClick={toggleAnnotations}>
                <Pencil className="h-4 w-4 mr-2" />
                {showAnnotations ? "Hide Markup" : "Add Markup"}
              </DropdownMenuItem>
            )}
            
            {user && (
              <DropdownMenuItem onClick={toggleSetlist}>
                <ListMusic className="h-4 w-4 mr-2" />
                {isSetlistOpen ? "Close Setlist" : "Add to Setlist"}
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={onFullscreen}>
              {isFullscreen ? (
                <>
                  <Minimize className="h-4 w-4 mr-2" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4 mr-2" />
                  Fullscreen
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => window.open(url, "_blank")}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
