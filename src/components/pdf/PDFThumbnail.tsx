
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

  // Build PDF URL that will show just the first page without controls
  const getThumbnailUrl = () => {
    if (!url) return "";
    
    // Check if the URL already contains hash or query parameters
    const hasHash = url.includes('#');
    const hasQuery = url.includes('?');
    
    // Base URL construction
    let viewerUrl = url;
    
    // Add hash if needed
    if (!hasHash && !hasQuery) {
      viewerUrl += '#';
    }
    
    // Determine the correct separator for additional parameters
    const separator = viewerUrl.endsWith('#') || viewerUrl.endsWith('&') || viewerUrl.endsWith('?') 
      ? '' 
      : (hasQuery || (hasHash && viewerUrl.includes('='))) ? '&' : '#';
    
    // Add view parameters for thumbnail display
    return viewerUrl + separator + "page=1&toolbar=0&navpanes=0&view=FitH&scrollbar=0";
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
