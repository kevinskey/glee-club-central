
import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';

interface PDFThumbnailProps {
  url: string;
  title: string;
  className?: string;
}

export const PDFThumbnail = ({ url, title, className = '' }: PDFThumbnailProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // Fetch the PDF and convert the first page to a data URL or object URL
  useEffect(() => {
    if (!url) {
      setError("No URL provided");
      setIsLoading(false);
      return;
    }

    const fetchPDF = async () => {
      try {
        // Import pdfjs dynamically to reduce initial load time
        const pdfjs = await import('pdfjs-dist');
        const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');

        // Set the worker source
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

        // Load the PDF document
        const loadingTask = pdfjs.getDocument(url);
        const pdf = await loadingTask.promise;
        
        // Get the first page
        const page = await pdf.getPage(1);
        
        // Set scale for the canvas (adjust as needed)
        const viewport = page.getViewport({ scale: 1.0 });
        
        // Prepare canvas for rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
          throw new Error("Could not create canvas context");
        }
        
        // Set canvas dimensions to match the PDF page viewport
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        // Convert the canvas to a data URL
        const dataUrl = canvas.toDataURL('image/png');
        setObjectUrl(dataUrl);
        setIsLoading(false);
      } catch (err) {
        console.error("Error generating PDF thumbnail:", err);
        setError("Failed to load thumbnail");
        setIsLoading(false);
      }
    };

    fetchPDF();

    // Clean up function
    return () => {
      if (objectUrl && objectUrl.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  return (
    <div className={`aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden ${className}`}>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <FileText className="h-12 w-12 text-muted-foreground/50 animate-pulse" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center w-full h-full">
          <FileText className="h-16 w-16 text-muted-foreground" />
        </div>
      ) : objectUrl ? (
        <img 
          src={objectUrl} 
          alt={`${title} thumbnail`} 
          className="w-full h-full object-contain"
        />
      ) : (
        <FileText className="h-16 w-16 text-muted-foreground" />
      )}
    </div>
  );
};
