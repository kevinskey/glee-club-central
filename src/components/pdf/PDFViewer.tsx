
import React from 'react';

interface PDFViewerProps {
  url: string;
  title: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, title }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="flex-1 border rounded-md overflow-hidden">
        <iframe 
          src={`${url}#view=FitH`} 
          title={title}
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default PDFViewer;
