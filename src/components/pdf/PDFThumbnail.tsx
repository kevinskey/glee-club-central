
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
      viewerUrl += '#page=1';
    } else {
      // Determine the correct separator for additional parameters
      const separator = hasQuery ? '&' : (hasHash ? '&' : '#');
      
      // Add page parameter if not already present
      if (!viewerUrl.includes('page=')) {
        viewerUrl += separator + 'page=1';
      }
    }
    
    // Ensure we have the right separator for additional parameters
    const needsSeparator = !(viewerUrl.endsWith('&') || viewerUrl.endsWith('#') || viewerUrl.endsWith('?'));
    const separator = needsSeparator ? (hasQuery || (hasHash && viewerUrl.includes('=')) ? '&' : '#') : '';
    
    // Add view parameters if not already present
    if (!viewerUrl.includes('toolbar=')) {
      viewerUrl += separator + 'toolbar=0&navpanes=0&view=FitH&scrollbar=0';
    }
    
    return viewerUrl;
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
