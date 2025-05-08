
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

  // Create a reliable thumbnail URL for the PDF that shows just the first page
  const getThumbnailUrl = () => {
    if (!url) return "";
    
    try {
      // Make sure we have a clean URL to start with
      const baseUrl = url.split('#')[0].split('?')[0];
      
      // Add parameters to display only the first page with no UI controls
      return `${baseUrl}#page=1&toolbar=0&navpanes=0&view=FitH&scrollbar=0`;
    } catch (e) {
      console.error("Error creating thumbnail URL:", e);
      return url;
    }
  };

  return (
    <div className={`aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden ${className}`}>
      {error ? (
        <FileText className="h-16 w-16 text-muted-foreground" />
      ) : (
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <FileText className="h-12 w-12 text-muted-foreground/50 animate-pulse" />
            </div>
          )}
          <iframe 
            src={getThumbnailUrl()}
            className="w-full h-full border-0" 
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError("Failed to load thumbnail");
              console.error("Failed to load PDF thumbnail:", url);
            }}
            title={`${title} thumbnail`}
            frameBorder="0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}
    </div>
  );
};
