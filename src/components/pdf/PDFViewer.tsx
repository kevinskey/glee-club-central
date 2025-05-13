
import React from 'react';

interface PDFViewerProps {
  url: string;
  title: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, title }) => {
  return (
    <div className="pdf-viewer w-full h-full flex flex-col">
      <div className="bg-gray-50 p-4 border-b">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="flex-grow relative">
        <iframe 
          src={`${url}#toolbar=1&navpanes=1`} 
          className="w-full h-full border-0" 
          title={title}
          sandbox="allow-scripts allow-same-origin"
        >
          Your browser does not support PDF viewing. Please <a href={url} target="_blank" rel="noopener noreferrer">download the PDF</a> to view it.
        </iframe>
      </div>
    </div>
  );
};

export default PDFViewer;
