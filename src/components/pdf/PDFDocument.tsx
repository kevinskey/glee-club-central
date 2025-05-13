
import React from "react";
import { FileText, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PDFCore } from "@/components/pdf/PDFCore";

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
}: PDFDocumentProps) => {
  // Handle view to Media Library
  const goToMediaLibrary = () => {
    if (mediaSourceId) {
      window.open(`/dashboard/admin/media?id=${mediaSourceId}`, "_blank");
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
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 z-40 bg-background/80 text-xs px-2 py-1 rounded">
          URL: {url ? url.substring(0, 30) + '...' : 'undefined'} | Page: {currentPage}
        </div>
      )}
      
      <PDFCore
        url={url}
        title={title}
        currentPage={currentPage}
        zoom={zoom}
        viewMode="page"
        onLoad={onLoad}
        onError={onError}
        className="w-full h-full"
      />
    </div>
  );
};
