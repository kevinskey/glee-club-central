
import React, { useState } from "react";
import { PDFDocument } from "./PDFDocument";
import { FileText, Link } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface PDFPreviewProps {
  url: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  previewWidth?: number;
  previewHeight?: number;
  mediaSourceId?: string;
  category?: string;
  isMediaLibraryFile?: boolean;
}

export const PDFPreview = ({
  url,
  title,
  children,
  className = "",
  previewWidth = 320,
  previewHeight = 450,
  mediaSourceId,
  category,
  isMediaLibraryFile = false
}: PDFPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setError("Failed to load PDF preview");
  };
  
  const goToMediaLibrary = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaSourceId) {
      navigate(`/dashboard/admin/media?id=${mediaSourceId}`);
    }
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className={`cursor-pointer ${className}`}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] h-[90vh] p-1">
        <div className="w-full h-full flex items-center justify-center">
          {url ? (
            <PDFDocument
              url={url}
              currentPage={1}
              zoom={100}
              isLoading={isLoading}
              onLoad={handleLoad}
              onError={handleError}
              error={error}
              title={title}
              mediaSourceId={mediaSourceId}
              category={category}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="h-16 w-16 mb-2" />
              <p>No PDF preview available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
