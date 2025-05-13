
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Trash2, Pencil, ListMusic, Maximize, Minimize } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthUser } from "@/types/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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
  onDelete?: () => void;
  canDelete?: boolean;
  onFullscreen?: () => void;
  isFullscreen?: boolean;
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
  user,
  onDelete,
  canDelete = false,
  onFullscreen,
  isFullscreen = false,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  
  const handleDelete = () => {
    if (onDelete) {
      setIsDeleteDialogOpen(false);
      onDelete();
    } else {
      toast.error("Unable to delete", {
        description: "Delete functionality is not available"
      });
    }
  };
  
  return (
    <>
      <div className="flex flex-wrap items-center justify-between p-2 border-b bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="h-9"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          
          <div className="text-sm font-medium px-3 py-1.5 bg-muted/50 rounded">
            <span className="hidden sm:inline">Page </span>{currentPage}<span className="hidden sm:inline"> of </span><span className="inline sm:hidden">/</span>{totalPages}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className="h-9"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 border-r pr-2 mr-1">
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
            
            {onFullscreen && (
              <Button
                variant="outline"
                size="icon"
                onClick={onFullscreen}
                className="h-8 w-8 hidden sm:flex"
                title={isFullscreen ? "Exit Fullscreen" : "Full Screen"}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          
          {user && (
            <>
              {hasAnnotationSupport && (
                <Button
                  variant={showAnnotations ? "secondary" : "outline"}
                  size="sm"
                  onClick={toggleAnnotations}
                  className="hidden sm:flex h-9"
                >
                  <Pencil className="h-4 w-4 mr-1.5" />
                  {showAnnotations ? "Hide Annotations" : "Add Annotations"}
                </Button>
              )}
              
              <Button
                variant={isSetlistOpen ? "secondary" : "outline"}
                size="sm"
                onClick={toggleSetlist}
                className="hidden sm:flex h-9"
              >
                <ListMusic className="h-4 w-4 mr-1.5" />
                {isSetlistOpen ? "Close Setlist" : "Add to Setlist"}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="hidden sm:flex h-9"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download
          </Button>
          
          {canDelete && onDelete && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="hidden sm:flex text-destructive hover:bg-destructive/10 h-9"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {onFullscreen && (
                <DropdownMenuItem onClick={onFullscreen} className="sm:hidden">
                  {isFullscreen ? <Minimize className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </DropdownMenuItem>
              )}
              
              {user && hasAnnotationSupport && (
                <DropdownMenuItem onClick={toggleAnnotations} className="sm:hidden">
                  <Pencil className="h-4 w-4 mr-2" />
                  {showAnnotations ? "Hide Annotations" : "Show Annotations"}
                </DropdownMenuItem>
              )}
              
              {user && (
                <DropdownMenuItem onClick={toggleSetlist} className="sm:hidden">
                  <ListMusic className="h-4 w-4 mr-2" />
                  {isSetlistOpen ? "Close Setlist" : "Add to Setlist"}
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem onClick={onDownload} className="sm:hidden">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              
              {canDelete && onDelete && (
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive sm:hidden"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete PDF
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this PDF?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the PDF file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0 sm:mt-0 w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
