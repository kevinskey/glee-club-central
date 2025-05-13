
import React, { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';

interface PDFThumbnailProps {
  url: string;
  title: string;
  className?: string;
  onClick?: () => void;
}

export const PDFThumbnail = ({ url, title, className = '', onClick }: PDFThumbnailProps) => {
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
        console.log("Generating thumbnail for PDF:", url);
        
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
        const viewport = page.getViewport({ scale: 1.5 });
        
        // Prepare canvas for rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
          throw new Error("Could not create canvas context");
        }
        
        // Set canvas dimensions to match the PDF page viewport
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        try {
          // Render PDF page to canvas - with better error handling
          await page.render({
            canvasContext: context,
            viewport: viewport,
            // Enable image resources to be rendered
            renderInteractiveForms: true
          }).promise;
          
          // Convert the canvas to a data URL with higher quality
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          setObjectUrl(dataUrl);
          setIsLoading(false);
          console.log("PDF thumbnail generated successfully");
        } catch (renderError) {
          console.error("Error rendering PDF to canvas:", renderError);
          setError("Failed to render thumbnail");
          setIsLoading(false);
        }
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
    <div 
      className={`aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden ${className}`}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="h-12 w-12 text-muted-foreground/50 animate-spin" />
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
