
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PDFViewer from '@/components/pdf/PDFViewer';

const ViewSheetMusicPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real implementation, we would fetch the sheet music data here
  // For now, we'll use dummy data
  const sheetMusic = {
    id: id || '1',
    title: 'Sample Sheet Music',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <PageHeader
        title={sheetMusic.title}
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
        <PDFViewer url={sheetMusic.url} title={sheetMusic.title} />
      </div>
    </div>
  );
};

export default ViewSheetMusicPage;
