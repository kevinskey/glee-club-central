
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Download, Edit, Trash, FileText, Music, Image, Video, File } from 'lucide-react';
import { MediaFile } from '@/types/media';
import { formatFileSize } from '@/utils/file-utils';
import { getMediaType, getMediaTypeLabel } from '@/utils/mediaUtils';
import { cn } from '@/lib/utils';

interface MediaGridViewProps {
  mediaFiles: MediaFile[];
  canEdit?: boolean;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
}

export function MediaGridView({ 
  mediaFiles, 
  canEdit = false, 
  canDelete = false,
  onDelete
}: MediaGridViewProps) {
  const getMediaIcon = (fileType: string) => {
    const type = getMediaType(fileType);
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-muted-foreground" />;
      case 'audio':
        return <Music className="h-8 w-8 text-muted-foreground" />;
      case 'image':
        return <Image className="h-8 w-8 text-muted-foreground" />;
      case 'video':
        return <Video className="h-8 w-8 text-muted-foreground" />;
      default:
        return <File className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
      {mediaFiles.map((file) => {
        const mediaType = getMediaType(file.file_type);
        const isImage = mediaType === 'image';
        
        return (
          <Card key={file.id} className="overflow-hidden h-full flex flex-col">
            <div className="relative aspect-square bg-muted flex items-center justify-center">
              {isImage ? (
                <AspectRatio ratio={1/1}>
                  <img 
                    src={file.file_url} 
                    alt={file.title}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  {getMediaIcon(file.file_type)}
                </div>
              )}
              
              {/* Quick action overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center gap-1 opacity-0 hover:opacity-100">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-white bg-black/20 hover:bg-black/40"
                  onClick={() => handleDownload(file.file_url, file.title)}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
                
                {canDelete && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-white bg-black/20 hover:bg-red-500/70"
                    onClick={() => onDelete && onDelete(file.id)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
            
            <CardContent className="p-2 flex-1 flex flex-col text-xs">
              <h3 className="font-medium truncate text-xs">{file.title}</h3>
              
              <div className="mt-auto">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className={cn(
                    "file-type-badge",
                    mediaType === 'image' && "file-type-image",
                    mediaType === 'audio' && "file-type-audio",
                    mediaType === 'video' && "file-type-video", 
                    mediaType === 'pdf' && "file-type-document",
                    mediaType === 'other' && "file-type-other",
                  )}>
                    {getMediaTypeLabel(mediaType)}
                  </span>
                  <span className="text-[10px]">{formatFileSize(file.size)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
