
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AdvancedPDFViewer from '@/components/pdf/AdvancedPDFViewer';

interface PDFViewerPageProps {
  // Any additional props can be added here
}

const PDFViewerPage: React.FC<PDFViewerPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get PDF information from location state or fallback to a demo PDF
  const pdfInfo = location.state?.file || {
    id: id || '1',
    title: location.state?.title || 'PDF Document',
    file_url: location.state?.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  };
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen">
      <AdvancedPDFViewer 
        url={pdfInfo.file_url} 
        title={pdfInfo.title}
        sheetMusicId={pdfInfo.id}
        onBack={handleBack}
      />
    </div>
  );
};

export default PDFViewerPage;
