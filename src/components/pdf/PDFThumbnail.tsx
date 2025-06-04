
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, FileText } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Configure PDF.js worker with better error handling
if (typeof window !== 'undefined') {
  console.log('Configuring PDF.js worker...');
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  console.log('PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);
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
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  console.log('PDFThumbnail rendering:', { url, title, loading, error, numPages });

  useEffect(() => {
    console.log('PDFThumbnail mounted for:', title);
    console.log('PDF.js version:', pdfjs.version);
    console.log('Worker src:', pdfjs.GlobalWorkerOptions.workerSrc);
  }, [title]);

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('✅ PDF loaded successfully:', { title, numPages, url });
    setNumPages(numPages);
    setError(null);
    setLoading(false);
  };

  const handleLoadError = (err: any) => {
    console.error('❌ PDF load error for', title, ':', err);
    console.error('Error details:', {
      message: err?.message,
      name: err?.name,
      stack: err?.stack,
      url
    });
    setError(`Failed to load PDF: ${err?.message || 'Unknown error'}`);
    setLoading(false);
  };

  const handlePageRenderSuccess = () => {
    console.log('✅ PDF page rendered successfully:', title);
  };

  const handlePageRenderError = (err: any) => {
    console.error('❌ PDF page render error for', title, ':', err);
    setError(`Failed to render PDF page: ${err?.message || 'Unknown error'}`);
  };

  // Show error fallback
  if (error) {
    console.log('Showing error fallback for:', title, 'Error:', error);
    return (
      <div className={`bg-muted flex items-center justify-center overflow-hidden relative rounded border ${className}`}>
        <AspectRatio ratio={aspectRatio} className="w-full">
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/50 p-4">
            <FileText className="h-8 w-8 mb-2" />
            <span className="text-xs text-center font-medium">PDF</span>
            <span className="text-xs text-center mt-1 opacity-75">Preview unavailable</span>
            <span className="text-xs text-center mt-1 text-red-500">{error}</span>
          </div>
        </AspectRatio>
      </div>
    );
  }

  console.log('Rendering PDF Document component for:', title);

  return (
    <div className={`bg-white flex items-center justify-center overflow-hidden relative border rounded ${className}`}>
      <AspectRatio ratio={aspectRatio} className="w-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Loading PDF...</span>
            </div>
          </div>
        )}
        
        <Document
          file={url}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={handleLoadError}
          loading=""
          error=""
          className="flex items-center justify-center h-full w-full"
          options={{
            cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
            cMapPacked: true,
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
            verbosity: 1 // Increase verbosity for debugging
          }}
        >
          {numPages && (
            <Page 
              pageNumber={1}
              loading=""
              error=""
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onRenderSuccess={handlePageRenderSuccess}
              onRenderError={handlePageRenderError}
              className="max-w-full max-h-full"
              scale={1}
              width={300}
            />
          )}
        </Document>
      </AspectRatio>
    </div>
  );
};

export default PDFThumbnail;
