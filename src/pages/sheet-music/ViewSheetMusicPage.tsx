
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import EnhancedPDFViewer from '@/components/pdf/EnhancedPDFViewer';

const ViewSheetMusicPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  // Get PDF data from location state or use fallback
  const pdfData = location.state?.file || {
    id: id || '1',
    title: location.state?.title || 'Sheet Music',
    url: location.state?.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <PageHeader
        title={pdfData.title}
        description="Sheet Music Viewer"
        icon={<FileText className="h-6 w-6" />}
        actions={
          <Button variant="outline" asChild>
            <Link to="/dashboard/sheet-music" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Library
            </Link>
          </Button>
        }
      />
      
      <div className="flex-1">
        <EnhancedPDFViewer 
          url={pdfData.url || pdfData.file_url} 
          title={pdfData.title} 
        />
      </div>
    </div>
  );
};

export default ViewSheetMusicPage;
