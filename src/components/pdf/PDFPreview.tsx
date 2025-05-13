import React from 'react';

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
          className="bg-gray-100 border flex items-center justify-center rounded-md" 
          style={{ width: previewWidth, height: previewHeight }}
        >
          <div className="text-center p-4">
            <div className="text-red-500 text-4xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
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
      )}
    </div>
  );
};

// Keep the default export for backward compatibility, but we're now using the named export
export default PDFPreview;
