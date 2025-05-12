
import React, { useState } from "react";
import { FileText, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PDFCore } from "@/components/ui/pdf-viewer/PDFCore";

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
      
      <PDFCore
        url={url}
        title={title}
        currentPage={currentPage}
        zoom={zoom}
        viewMode={viewMode}
        onLoad={onLoad}
        onError={onError}
        className="w-full h-full"
      />
      
      {children}
    </div>
  );
};
