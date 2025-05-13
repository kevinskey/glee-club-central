
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Trash2, 
  Pencil,
  Plus,
  Minus,
  Maximize,
  Minimize,
  X
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';

// Define what the PDF annotation shape looks like
interface PDFAnnotation {
  id: string;
  page: number;
  x: number;
  y: number;
  text: string;
  color: string;
  user_id: string;
  created_at: string;
}

interface PDFViewerProps {
  url: string;
  title: string;
  sheetMusicId?: string;
  user?: any;
  fullHeight?: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ 
  url, 
  title,
  sheetMusicId,
  user,
  fullHeight = false,
  canDelete = false,
  onDelete
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // PDF.js viewer URL with parameters
  const viewerUrl = useMemo(() => {
    const baseUrl = `${url}#page=${currentPage}`;
    return `${baseUrl}&zoom=${scale * 100}&rotate=${rotation}`;
  }, [url, currentPage, scale, rotation]);
  
  const handlePageChange = (delta: number) => {
    if (!numPages) return;
    
    let newPage = currentPage + delta;
    if (newPage < 1) newPage = 1;
    if (numPages && newPage > numPages) newPage = numPages;
    
    setCurrentPage(newPage);
  };
  
  const handleZoom = (delta: number) => {
    const newScale = Math.max(0.25, Math.min(3, scale + delta));
    setScale(newScale);
  };
  
  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const handleDownload = () => {
    // Create an anchor and programmatically click it
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.message("Download started", {
      description: "Your file will download shortly"
    });
  };
  
  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setDeleteDialogOpen(false);
  };
  
  // For demonstration only - this would be connected to an actual backend
  const handleLoadComplete = () => {
    setNumPages(5); // Example - would be determined from the loaded PDF
    setLoading(false);
  };
  
  // Simulate PDF loading
  useEffect(() => {
    const timer = setTimeout(() => {
      handleLoadComplete();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [url]);
  
  // Fullscreen effect
  useEffect(() => {
    if (fullHeight) {
      setIsFullscreen(true);
    }
  }, [fullHeight]);
  
  return (
    <>
      <div className={`flex flex-col border rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        {/* Toolbar */}
        <div className="flex justify-between items-center border-b p-2 bg-muted/30">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(-1)}
              disabled={currentPage <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm mx-2">
              {loading ? (
                <Skeleton className="h-5 w-16" />
              ) : (
                `Page ${currentPage} of ${numPages || '?'}`
              )}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={numPages !== null && currentPage >= numPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom(-0.1)}
              disabled={loading}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-sm mx-1">{Math.round(scale * 100)}%</span>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom(0.1)}
              disabled={loading}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleRotate}
              disabled={loading}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              disabled={loading}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              disabled={loading}
            >
              <Download className="h-4 w-4" />
            </Button>
            
            {canDelete && onDelete && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            
            {isFullscreen && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFullscreen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* PDF Viewer */}
        <div className={`relative w-full ${isFullscreen ? 'flex-1' : 'h-[70vh]'}`}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src={viewerUrl}
            title={title}
            className="w-full h-full border-0"
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this sheet music file and all associated annotations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

function useMemo<T>(factory: () => T, deps: React.DependencyList | undefined): T {
  const [state, setState] = useState<T>(factory);
  
  useEffect(() => {
    const newState = factory();
    setState(newState);
  }, deps);
  
  return state;
}
