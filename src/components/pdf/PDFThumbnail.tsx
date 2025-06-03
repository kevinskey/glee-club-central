
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, FileText } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Initialize pdfjs worker with fallback
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

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
  const [retryCount, setRetryCount] = useState(0);

  // Reset loading state when URL changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setNumPages(null);
    setRetryCount(0);
  }, [url]);

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log(`PDF loaded successfully: ${title} (${numPages} pages)`);
    setLoading(false);
    setNumPages(numPages);
    setError(null);
  };

  const handleLoadError = (err: Error) => {
    console.error('Error loading PDF:', err);
    setError(err);
    setLoading(false);
  };

  const handleRetry = () => {
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      setLoading(true);
      setError(null);
    }
  };

  // Show fallback for failed PDFs
  if (error) {
    return (
      <div className={`bg-muted flex items-center justify-center overflow-hidden relative ${className}`}>
        <AspectRatio ratio={aspectRatio} className="w-full">
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/50 p-4">
            <FileText className="h-8 w-8 mb-2" />
            <span className="text-xs text-center font-medium">PDF</span>
            <span className="text-xs text-center mt-1 opacity-75">Preview unavailable</span>
            {retryCount < 2 && (
              <button 
                onClick={handleRetry}
                className="text-xs mt-2 px-2 py-1 bg-background rounded hover:bg-accent transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </AspectRatio>
      </div>
    );
  }

  return (
    <div className={`bg-muted flex items-start justify-center overflow-hidden relative ${className}`} data-pdf-url={url}>
      <AspectRatio ratio={aspectRatio} className="w-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Loading PDF...</span>
            </div>
          </div>
        )}
        
        <div className="h-full w-full flex items-start justify-center overflow-hidden bg-white">
          <Document
            file={url}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            loading={null}
            error={null}
            className="flex items-start justify-center h-full w-full"
            options={{
              cMapUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
              cMapPacked: true,
              standardFontDataUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
              disableWorker: false,
              verbosity: 0,
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
                width={Math.min(200, window.innerWidth * 0.2)}
                scale={1}
              />
            )}
          </Document>
        </div>
      </AspectRatio>
    </div>
  );
};

export default PDFThumbnail;
