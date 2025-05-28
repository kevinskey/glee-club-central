
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { FileText } from 'lucide-react';
import AdvancedPDFViewer from '@/components/pdf/AdvancedPDFViewer';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { getMediaType } from '@/utils/mediaUtils';

const ViewSheetMusicPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [pdfData, setPdfData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { allMediaFiles } = useMediaLibrary();

  useEffect(() => {
    if (id) {
      loadPDFData();
    }
  }, [id, allMediaFiles]);

  const loadPDFData = () => {
    // First try to get from location state
    if (location.state?.file) {
      setPdfData(location.state.file);
      setLoading(false);
      return;
    }

    // Try to find in media library
    const mediaFile = allMediaFiles.find(file => file.id === id);
    if (mediaFile && getMediaType(mediaFile.file_type) === 'pdf') {
      setPdfData({
        id: mediaFile.id,
        title: mediaFile.title || 'Untitled PDF',
        url: mediaFile.file_url,
        file_url: mediaFile.file_url,
        sheetMusicId: mediaFile.id
      });
      setLoading(false);
      return;
    }

    // Fallback to demo PDF if nothing found
    setPdfData({
      id: id || '1',
      title: location.state?.title || 'Sheet Music',
      url: location.state?.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      sheetMusicId: id || '1'
    });
    setLoading(false);
  };

  const handleBack = () => {
    navigate('/dashboard/sheet-music');
  };

  if (loading) {
    return (
      <div className="space-y-6 h-full flex flex-col">
        <PageHeader
          title="Loading..."
          description="Sheet Music Viewer"
          icon={<FileText className="h-6 w-6" />}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <AdvancedPDFViewer 
        url={pdfData.url || pdfData.file_url} 
        title={pdfData.title}
        sheetMusicId={pdfData.sheetMusicId || pdfData.id}
        onBack={handleBack}
      />
    </div>
  );
};

export default ViewSheetMusicPage;
