
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2 } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Initialize pdfjs worker
// This is required for react-pdf to work properly
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFThumbnailProps {
  url: string;
  title: string;
  className?: string;
  aspectRatio?: number;
}

export const PDFThumbnail = ({ 
  url, 
  title, 
  className = '',
  aspectRatio = 3/4
}: PDFThumbnailProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Reset loading state when URL changes
  useEffect(() => {
    setLoading(true);
    setError(null);
  }, [url]);

  const handleLoadSuccess = () => {
    setLoading(false);
  };

  const handleLoadError = (err: Error) => {
    console.error('Error loading PDF:', err);
    setError(err);
    setLoading(false);
  };

  return (
    <div className={`bg-muted flex items-center justify-center overflow-hidden relative ${className}`}>
      <AspectRatio ratio={aspectRatio} className="w-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {error ? (
          <div className="text-red-500 flex items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Document
              file={url}
              onLoadSuccess={handleLoadSuccess}
              onLoadError={handleLoadError}
              loading={null}
              className="flex items-center justify-center h-full w-full"
            >
              <Page 
                pageNumber={1} 
                width={undefined}
                height={undefined}
                scale={1}
                className="overflow-hidden flex items-center justify-center max-w-full max-h-full"
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={null}
              />
            </Document>
          </div>
        )}
      </AspectRatio>
    </div>
  );
};

export default PDFThumbnail;
