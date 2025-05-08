
import React, { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { PDFDocument } from "./PDFDocument";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

interface PDFPreviewProps {
  url: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  previewWidth?: number;
  previewHeight?: number;
}

export const PDFPreview = ({
  url,
  title,
  children,
  className = "",
  previewWidth = 320,
  previewHeight = 450
}: PDFPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setError("Failed to load PDF preview");
  };
  
  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild>
        <div className={className}>
          {children}
        </div>
      </HoverCardTrigger>
      
      <HoverCardContent 
        className="w-auto p-0 shadow-lg border border-border overflow-hidden" 
        side="right"
        align="start"
        style={{ width: previewWidth, maxHeight: previewHeight }}
      >
        <ScrollArea className="h-full w-full" style={{ height: previewHeight }}>
          {url ? (
            <PDFDocument
              url={url}
              currentPage={1}
              zoom={100}
              isLoading={isLoading}
              onLoad={handleLoad}
              onError={handleError}
              error={error}
              title={`${title} preview`}
            />
          ) : (
            <div className="flex items-center justify-center h-full p-4 text-center">
              <div>
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No preview available</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
};
