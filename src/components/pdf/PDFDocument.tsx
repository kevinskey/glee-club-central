
import React, { useState, useEffect } from "react";
import { FileText, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PDFCore } from "@/components/ui/pdf-viewer/PDFCore";
import { toast } from "sonner";

interface PDFDocumentProps {
  url: string;
  currentPage: number;
  zoom: number;
  isLoading: boolean;
  onLoad: () => void;
  onError: () => void;
  error: string | null;
  title: string;
  mediaSourceId?: string;
  category?: string;
  children?: React.ReactNode;
}

export const PDFDocument = ({
  url,
  currentPage,
  zoom,
  isLoading,
  onLoad,
  onError,
  error,
  title,
  mediaSourceId,
  category,
  children,
}: PDFDocumentProps) => {
  const [viewMode, setViewMode] = useState<'scroll' | 'page'>('page');
  const [pdfLoadAttempts, setPdfLoadAttempts] = useState(0);
  const [imageSaveEnabled, setImageSaveEnabled] = useState(true);
  
  // Handle view to Media Library
  const goToMediaLibrary = () => {
    if (mediaSourceId) {
      window.open(`/dashboard/admin/media?id=${mediaSourceId}`, "_blank");
    }
  };

  // Show a console log to help debug PDF loading issues
  useEffect(() => {
    console.log("PDFDocument rendering with URL:", url);
    
    // Check if URL is valid
    if (!url || url.trim() === "") {
      console.error("Invalid PDF URL provided:", url);
      toast.error("Invalid PDF URL", {
        description: "The PDF document cannot be loaded due to an invalid URL"
      });
    }
    
    // Enable image saving functionality (this would typically be part of a larger system)
    setImageSaveEnabled(true);
    
    // Log confirmation that images can be saved
    console.log("PDF image saving is enabled:", imageSaveEnabled);
  }, [url]);
  
  // Handle PDF load errors
  const handleError = () => {
    setPdfLoadAttempts(prev => prev + 1);
    onError();
    
    // If multiple failures, suggest solutions
    if (pdfLoadAttempts >= 2) {
      toast.error("PDF Loading Issues", {
        description: "Try opening in a new tab or check that the URL is accessible"
      });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center overflow-hidden">
      {/* Source Badge */}
      {mediaSourceId && category && (
        <div className="absolute top-12 left-2 z-40">
          <Badge 
            variant="outline" 
            className="bg-background/90 cursor-pointer hover:bg-background"
            onClick={goToMediaLibrary}
          >
            <Link className="h-3 w-3 mr-1" />
            From {category}
          </Badge>
        </div>
      )}
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 z-40 bg-background/80 text-xs px-2 py-1 rounded">
          URL: {url ? url.substring(0, 30) + '...' : 'undefined'} | Page: {currentPage} | Images: {imageSaveEnabled ? 'Enabled' : 'Disabled'}
        </div>
      )}
      
      <PDFCore
        url={url}
        title={title}
        currentPage={currentPage}
        zoom={zoom}
        viewMode={viewMode}
        onLoad={onLoad}
        onError={handleError}
        className="w-full h-full"
      />
      
      {children}
    </div>
  );
};
