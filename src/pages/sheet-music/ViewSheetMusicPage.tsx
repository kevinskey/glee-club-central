
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { FileText } from 'lucide-react';
import AdvancedPDFViewer from '@/components/pdf/AdvancedPDFViewer';
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
    // First try to get from location state (from media library)
    if (location.state?.file) {
      setPdfData(location.state.file);
      setLoading(false);
      return;
    }

    // Try to find in media library first
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

    // Fallback: try to load from sheet music database
    loadFromSheetMusicDatabase();
  };

  const loadFromSheetMusicDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('sheet_music')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setPdfData({
          id: data.id,
          title: data.title || 'Untitled PDF',
          url: data.file_url,
          file_url: data.file_url,
          sheetMusicId: data.id
        });
      }
    } catch (error) {
      console.error('Error loading sheet music:', error);
      // If all else fails, use a demo PDF
      setPdfData({
        id: id || '1',
        title: 'PDF Document',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        sheetMusicId: id || '1'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Check if we came from media library
    if (location.state?.file) {
      navigate('/dashboard/media-library');
    } else {
      navigate('/dashboard/sheet-music');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <AdvancedPDFViewer 
      url={pdfData.url || pdfData.file_url} 
      title={pdfData.title}
      sheetMusicId={pdfData.sheetMusicId || pdfData.id}
      onBack={handleBack}
    />
  );
};

export default ViewSheetMusicPage;
