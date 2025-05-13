
import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface PDFThumbnailProps {
  url: string;
  title: string;
  className?: string;
}

export const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ url, title, className = "" }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Default placeholder thumbnail
  const placeholderImage = "/placeholder.svg";
  
  useEffect(() => {
    // Reset states when url changes
    setLoading(true);
    setError(false);
  }, [url]);
  
  return (
    <div className={`relative aspect-[3/4] bg-muted ${className}`}>
      {loading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      <img
        src={error ? placeholderImage : url + '#page=1'}
        alt={title}
        className={`w-full h-full object-cover transition-opacity ${loading || error ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
      
      {/* Fallback for when PDF preview fails */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted border rounded-sm">
          <span className="text-xs text-muted-foreground text-center p-2">
            PDF Preview
          </span>
        </div>
      )}
    </div>
  );
};
