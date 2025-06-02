
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, FileText } from 'lucide-react';
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
  const [numPages, setNumPages] = useState<number | null>(null);

  // Reset loading state when URL changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setNumPages(null);
  }, [url]);

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setLoading(false);
    setNumPages(numPages);
    console.log(`PDF loaded successfully: ${title} (${numPages} pages)`);
  };

  const handleLoadError = (err: Error) => {
    console.error('Error loading PDF:', err);
    setError(err);
    setLoading(false);
  };

  return (
    <div className={`bg-muted flex items-start justify-center overflow-hidden relative ${className}`} data-pdf-url={url}>
      <AspectRatio ratio={aspectRatio} className="w-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Loading PDF...</span>
            </div>
          </div>
        )}
        
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/50">
            <FileText className="h-12 w-12 mb-2" />
            <span className="text-xs text-center px-2">PDF Preview Unavailable</span>
          </div>
        ) : (
          <div className="h-full w-full flex items-start justify-center overflow-hidden bg-white">
            <Document
              file={url}
              onLoadSuccess={handleLoadSuccess}
              onLoadError={handleLoadError}
              loading={null}
              error={null}
              className="flex items-start justify-center h-full w-full"
              options={{
                cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
                cMapPacked: true,
                standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/',
              }}
            >
              {numPages && (
                <Page 
                  pageNumber={1} 
                  className="overflow-hidden flex items-start justify-center max-w-full max-h-full"
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={null}
                  error={null}
                  width={200}
                />
              )}
            </Document>
          </div>
        )}
      </AspectRatio>
    </div>
  );
};

export default PDFThumbnail;
