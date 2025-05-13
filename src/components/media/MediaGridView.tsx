
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Download, Edit, Trash, FileText, Music, Image, Video, File, Eye } from 'lucide-react';
import { MediaFile } from '@/types/media';
import { formatFileSize } from '@/utils/file-utils';
import { getMediaType, getMediaTypeLabel } from '@/utils/mediaUtils';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);
  
  const getMediaIcon = (fileType: string) => {
    const type = getMediaType(fileType);
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'audio':
        return <Music className="h-8 w-8 text-green-500" />;
      case 'image':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-purple-500" />;
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
  
  const openPreview = (url: string, fileType: string) => {
    setPreviewUrl(url);
    setPreviewType(fileType);
  };
  
  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewType(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
        {mediaFiles.map((file) => {
          const mediaType = getMediaType(file.file_type);
          const isImage = mediaType === 'image';
          const isVideo = mediaType === 'video';
          const isAudio = mediaType === 'audio';
          const isPdf = mediaType === 'pdf';
          
          return (
            <Card key={file.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden cursor-pointer" 
                   onClick={() => openPreview(file.file_url, file.file_type)}>
                {/* Media Preview Based on Type */}
                {isImage ? (
                  <AspectRatio ratio={1/1}>
                    <img 
                      src={file.file_url} 
                      alt={file.title}
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                ) : isVideo ? (
                  <AspectRatio ratio={1/1}>
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <video
                        className="max-w-full max-h-full"
                        src={file.file_url}
                        preload="metadata"
                      />
                      <Video className="absolute h-10 w-10 text-white opacity-80" />
                    </div>
                  </AspectRatio>
                ) : isAudio ? (
                  <AspectRatio ratio={1/1}>
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 flex items-center justify-center">
                      <audio 
                        className="hidden" 
                        preload="metadata"
                        src={file.file_url} 
                      />
                      <Music className="h-10 w-10 text-green-500" />
                    </div>
                  </AspectRatio>
                ) : isPdf ? (
                  <AspectRatio ratio={1/1}>
                    <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center">
                      <FileText className="h-10 w-10 text-red-500" />
                    </div>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      openPreview(file.file_url, file.file_type);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-white bg-black/20 hover:bg-black/40"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file.file_url, file.title);
                    }}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  
                  {canDelete && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-white bg-black/20 hover:bg-red-500/70"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete && onDelete(file.id);
                      }}
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

      {/* Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent className="sm:max-w-3xl">
          {previewUrl && previewType && (
            <div className="w-full flex justify-center">
              {previewType.startsWith('image/') ? (
                <img src={previewUrl} alt="Preview" className="max-h-[70vh] max-w-full" />
              ) : previewType.startsWith('video/') ? (
                <video src={previewUrl} controls className="max-h-[70vh] max-w-full" />
              ) : previewType.startsWith('audio/') ? (
                <audio src={previewUrl} controls className="w-full" />
              ) : previewType === 'application/pdf' || previewType.includes('pdf') ? (
                <iframe src={previewUrl} title="PDF Viewer" className="w-full h-[70vh]" />
              ) : (
                <div className="text-center p-8">
                  <p>This file type cannot be previewed</p>
                  <Button 
                    onClick={() => window.open(previewUrl, '_blank')}
                    className="mt-4"
                  >
                    Open in New Tab
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
