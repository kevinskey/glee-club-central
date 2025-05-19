
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { FileText, Download, File } from 'lucide-react';
import { formatFileSize } from '@/utils/file-utils';
import { toast } from 'sonner';

interface DocumentFile {
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
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
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
          console.error('Error fetching files:', error);
          toast.error("Error loading documents");
          return;
        }

        if (!data) {
          setDocuments([]);
          return;
        }

        // Filter out folders and non-PDF documents
        const fileItems = data.filter(item => 
          !item.id.endsWith('/') && 
          (item.metadata?.mimetype === 'application/pdf' || 
           item.name.toLowerCase().endsWith('.pdf') ||
           item.name.toLowerCase().endsWith('.doc') ||
           item.name.toLowerCase().endsWith('.docx'))
        );

        // Get the public URLs and add size information
        const documentFiles = await Promise.all(
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

        setDocuments(documentFiles);
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error("Error loading documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [bucketName, folder]);

  const handleDownload = (url: string, fileName: string) => {
    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Download started", {
      description: `${fileName} is downloading`
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return <p className="text-muted-foreground italic">No documents available.</p>;
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div 
          key={doc.path}
          className="flex items-center justify-between p-3 rounded-md bg-background border hover:bg-muted/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded p-2">
              {doc.type === 'application/pdf' ? (
                <FileText className="h-5 w-5 text-primary" />
              ) : (
                <File className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium">{doc.name}</h4>
              <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDownload(doc.url, doc.name)}
          >
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      ))}
    </div>
  );
}
