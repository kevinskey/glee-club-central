
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getMediaType } from '@/utils/mediaUtils';

interface FixedAspectViewerProps {
  fileId: string;
  onClose: () => void;
}

interface MediaFileDetailed {
  id: string;
  title: string;
  file_type: string;
  file_url: string;
  size?: number;
  description?: string;
}

export function FixedAspectViewer({ fileId, onClose }: FixedAspectViewerProps) {
  const [file, setFile] = useState<MediaFileDetailed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFileDetails();
  }, [fileId]);

  const fetchFileDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('media_library')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      setFile(data);
    } catch (err) {
      console.error('Error fetching file details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch file details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (file?.file_url) {
      const a = document.createElement('a');
      a.href = file.file_url;
      a.download = file.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const renderFileContent = () => {
    if (!file) return null;

    const mediaType = getMediaType(file.file_type);

    switch (mediaType) {
      case 'image':
        return (
          <img
            src={file.file_url}
            alt={file.title}
            className="w-full h-full object-contain"
            style={{ imageRendering: 'auto' }}
          />
        );
      
      case 'pdf':
        return (
          <iframe
            src={file.file_url}
            className="w-full h-full border-0"
            title={file.title}
          />
        );
      
      case 'video':
        return (
          <video
            src={file.file_url}
            controls
            className="w-full h-full"
            style={{ objectFit: 'contain' }}
          >
            Your browser does not support the video tag.
          </video>
        );
      
      case 'audio':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">{file.title}</h3>
              {file.description && (
                <p className="text-muted-foreground">{file.description}</p>
              )}
            </div>
            <audio
              src={file.file_url}
              controls
              className="w-full max-w-md"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-lg mb-4">Cannot preview this file type</p>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden"
        style={{ aspectRatio: '8.5 / 11' }}
      >
        <DialogHeader className="flex-row items-center justify-between p-4 border-b">
          <DialogTitle className="text-base truncate pr-4">
            {file?.title || 'Loading...'}
          </DialogTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
            {file && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="min-h-[36px] min-w-[36px]"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="min-h-[36px] min-w-[36px]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div 
          className="flex-1 overflow-hidden bg-white dark:bg-gray-900"
          style={{ 
            aspectRatio: '8.5 / 11',
            minHeight: '400px'
          }}
        >
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading file...</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchFileDetails}>Retry</Button>
              </div>
            </div>
          ) : (
            renderFileContent()
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
