
import React from 'react';
import { PDFThumbnail } from './PDFThumbnail';

export interface PDFPreviewProps {
  url: string;
  title: string;
  mediaSourceId?: string;
  category?: string;
  previewWidth?: number;
  previewHeight?: number;
  className?: string;
  isMediaLibraryFile?: boolean;
  children?: React.ReactNode; // Add children prop for custom rendering
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  url,
  title,
  mediaSourceId,
  category,
  previewWidth = 300,
  previewHeight = 400,
  className = '',
  isMediaLibraryFile = false,
  children
}) => {
  return (
    <div className={`pdf-preview ${className}`}>
      {children ? (
        children
      ) : (
        <div 
          className="bg-gray-100 border flex items-center justify-center rounded-md overflow-hidden" 
          style={{ width: previewWidth, height: previewHeight }}
        >
          <div className="w-full h-full">
            <PDFThumbnail url={url} title={title} className="w-full h-full" />
            <div className="bg-white/80 backdrop-blur-sm p-4 absolute bottom-0 w-full">
              <h3 className="text-lg font-medium mb-2 truncate" title={title}>{title}</h3>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
                Open PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Keep the default export for backward compatibility, but we're now using the named export
export default PDFPreview;
