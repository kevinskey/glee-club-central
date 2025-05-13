
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, FilePdf, FileImage } from 'lucide-react';
import { formatFileSize } from '@/utils/file-utils';
import { toast } from '@/components/ui/use-toast';

interface Document {
  name: string;
  url: string;
  size: number;
  type: string;
  path: string;
}

interface PressKitDocumentsProps {
  bucketName: string;
  folder?: string;
}

export function PressKitDocuments({ bucketName, folder }: PressKitDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        let { data, error } = await supabase.storage
          .from(bucketName)
          .list(folder || '', {
            sortBy: { column: 'name', order: 'asc' }
          });

        if (error) {
          console.error('Error fetching documents:', error);
          toast({ title: 'Error loading documents', description: error.message, variant: 'destructive' });
          return;
        }

        if (!data) {
          setDocuments([]);
          return;
        }

        // Filter out folders
        const fileItems = data.filter(item => !item.id.endsWith('/'));

        // Get the public URLs and add size information
        const docs = await Promise.all(
          fileItems.map(async (file) => {
            const { data: publicUrlData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(folder ? `${folder}/${file.name}` : file.name);
            
            return {
              name: file.name,
              url: publicUrlData.publicUrl,
              size: file.metadata?.size || 0,
              type: file.metadata?.mimetype || 'application/octet-stream',
              path: folder ? `${folder}/${file.name}` : file.name
            };
          })
        );

        setDocuments(docs);
      } catch (err) {
        console.error('Unexpected error:', err);
        toast({ title: 'Error loading documents', description: 'An unexpected error occurred', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [bucketName, folder]);

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Download started',
        description: `${fileName} is downloading`,
      });
    } catch (err) {
      console.error('Download error:', err);
      toast({ 
        title: 'Download failed', 
        description: 'Unable to download the file',
        variant: 'destructive'
      });
    }
  };

  // Determine the appropriate icon based on file type
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FilePdf className="h-8 w-8 text-red-500" />;
    if (type.startsWith('image/')) return <FileImage className="h-8 w-8 text-blue-500" />;
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  // Get a clean display name (remove extension, replace underscores with spaces)
  const getDisplayName = (fileName: string) => {
    const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
    return nameWithoutExtension
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return <p className="text-muted-foreground italic">No documents available.</p>;
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <Card key={doc.name} className="overflow-hidden">
          <CardContent className="p-4 flex items-center">
            <div className="mr-4">
              {getFileIcon(doc.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">{getDisplayName(doc.name)}</h4>
              <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload(doc.url, doc.name)}
              className="ml-4"
            >
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
