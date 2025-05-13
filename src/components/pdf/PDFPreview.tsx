
import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PDFPreviewProps {
  url: string;
  title: string;
  mediaSourceId?: string;
  category?: string;
  children: React.ReactNode;
  previewWidth?: number;
  previewHeight?: number;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  url,
  title,
  mediaSourceId,
  children,
  previewWidth = 400,
  previewHeight = 600,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Don't render the preview on mobile devices as it can be resource intensive
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    return <>{children}</>;
  }
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div 
          onMouseEnter={() => setIsOpen(true)} 
          onMouseLeave={() => setIsOpen(false)}
        >
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        side="right" 
        sideOffset={10} 
        className="w-auto p-0 border-gray-200 shadow-lg"
        style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="h-full w-full">
          <iframe
            src={`${url}#page=1&view=FitH`}
            title={title}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
