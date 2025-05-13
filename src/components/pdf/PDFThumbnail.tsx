
import React from 'react';

interface PDFThumbnailProps {
  url: string;
  title: string;
  width?: number;
  height?: number;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ url, title, width = 150, height = 200 }) => {
  return (
    <div className="relative" style={{ width, height }}>
      <div className="absolute inset-0 bg-gray-100 border flex items-center justify-center rounded-md">
        <div className="text-center p-2">
          <div className="text-red-500 text-2xl mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-xs font-medium truncate" title={title}>
            {title}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFThumbnail;
