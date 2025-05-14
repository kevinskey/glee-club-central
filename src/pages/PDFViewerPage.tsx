
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { FileText } from 'lucide-react';
import EnhancedPDFViewer from '@/components/pdf/EnhancedPDFViewer';

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
    <div className="h-full flex flex-col">
      <PageHeader
        title={pdfInfo.title}
        description="Sheet Music Viewer"
        icon={<FileText className="h-6 w-6" />}
      />
      
      <div className="flex-1 mt-4">
        <EnhancedPDFViewer 
          url={pdfInfo.file_url} 
          title={pdfInfo.title}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default PDFViewerPage;
