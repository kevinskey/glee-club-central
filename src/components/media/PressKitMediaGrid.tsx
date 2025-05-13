
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Image, Search, X } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatFileSize } from '@/utils/file-utils';
import { toast } from '@/components/ui/use-toast';

interface PressKitMediaGridProps {
  bucketName: string;
  folder?: string;
  title: string;
  maxItems?: number;
}

export function PressKitMediaGrid({ bucketName, folder, title, maxItems = 8 }: PressKitMediaGridProps) {
  const [files, setFiles] = useState<{ name: string; url: string; size: number; type: string; path: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        let { data, error } = await supabase.storage
          .from(bucketName)
          .list(folder || '', {
            limit: maxItems,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (error) {
          console.error('Error fetching files:', error);
          toast({ title: 'Error loading media', description: error.message, variant: 'destructive' });
          return;
        }

        if (!data) {
          setFiles([]);
          return;
        }

        // Filter out folders
        const fileItems = data.filter(item => !item.id.endsWith('/'));

        // Get the public URLs and add size information
        const mediaFiles = await Promise.all(
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

        setFiles(mediaFiles);
      } catch (err) {
        console.error('Unexpected error:', err);
        toast({ title: 'Error loading media', description: 'An unexpected error occurred', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [bucketName, folder, maxItems]);

  const handleDownload = async (url: string, fileName: string) => {
    try {
      // Create a temporary anchor element to trigger the download
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

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <AspectRatio ratio={4/3}>
              <Skeleton className="h-full w-full" />
            </AspectRatio>
            <CardContent className="p-3">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return <p className="text-muted-foreground italic">No media files available.</p>;
  }

  // Determine if a file is an image by checking its MIME type
  const isImage = (type: string) => type.startsWith('image/');

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-glee-purple">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <Card key={file.name} className="overflow-hidden hover:shadow-md transition-shadow">
            {isImage(file.type) ? (
              <AspectRatio ratio={4/3} className="bg-gray-100 dark:bg-gray-800">
                <img 
                  src={file.url} 
                  alt={file.name}
                  className="object-cover w-full h-full cursor-pointer"
                  onClick={() => openLightbox(file.url)}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <Button variant="ghost" size="sm" className="text-white" onClick={() => openLightbox(file.url)}>
                    <Search className="h-5 w-5 mr-1" /> Preview
                  </Button>
                </div>
              </AspectRatio>
            ) : (
              <AspectRatio ratio={4/3} className="bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Image className="h-12 w-12 text-gray-400" />
              </AspectRatio>
            )}
            <CardContent className="p-3">
              <p className="text-sm font-medium truncate mb-1">{file.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{formatFileSize(file.size)}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs"
                onClick={() => handleDownload(file.url, file.name)}
              >
                <Download className="h-3 w-3 mr-1" /> Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl w-[95vw]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Preview</span>
              <Button variant="ghost" size="sm" onClick={() => setLightboxOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 relative">
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="max-h-[70vh] mx-auto"
              />
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={() => selectedImage && handleDownload(selectedImage, selectedImage.split('/').pop() || 'download')}
              className="bg-glee-purple hover:bg-glee-spelman"
            >
              <Download className="h-4 w-4 mr-2" /> Download Original
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
