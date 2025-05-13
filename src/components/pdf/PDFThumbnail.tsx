
import React from 'react';

interface PDFThumbnailProps {
  url: string;
  title: string;
  className?: string;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ url, title, className = '' }) => {
  return (
    <div className={`aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden ${className}`}>
      <div className="text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default PDFThumbnail;
