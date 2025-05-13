
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MediaFile } from '@/types/media';
import { Download, Eye, Trash, FileText, Music, Image, Video, File } from 'lucide-react';
import { getMediaType, getMediaTypeLabel } from '@/utils/mediaUtils';
import { formatFileSize } from '@/utils/file-utils';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface MediaListViewProps {
  mediaFiles: MediaFile[];
  canEdit?: boolean;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
}

export function MediaListView({ 
  mediaFiles, 
  canEdit = false, 
  canDelete = false,
  onDelete
}: MediaListViewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);
  
  const getMediaIcon = (fileType: string) => {
    const type = getMediaType(fileType);
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-400" />;
      case "audio":
        return <Music className="h-4 w-4 text-green-400" />;
      case "image":
        return <Image className="h-4 w-4 text-blue-400" />;
      case "video":
        return <Video className="h-4 w-4 text-purple-400" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
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
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-xs">
                <th className="px-2 py-2 text-left font-medium text-muted-foreground">Preview</th>
                <th className="px-2 py-2 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-2 py-2 text-left font-medium text-muted-foreground hidden md:table-cell">Size</th>
                <th className="px-2 py-2 text-left font-medium text-muted-foreground hidden lg:table-cell">Added</th>
                <th className="px-2 py-2 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mediaFiles.map((file) => {
                const mediaType = getMediaType(file.file_type);
                const isImage = mediaType === 'image';
                const isVideo = mediaType === 'video';
                const isAudio = mediaType === 'audio';
                const isPdf = mediaType === 'pdf';
                
                return (
                  <tr key={file.id} className="hover:bg-muted/50 text-xs">
                    <td className="px-2 py-2" onClick={() => openPreview(file.file_url, file.file_type)}>
                      <div className="w-10 h-10 rounded overflow-hidden bg-muted cursor-pointer">
                        {isImage ? (
                          <img 
                            src={file.file_url} 
                            alt={file.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : isVideo ? (
                          <div className="w-full h-full flex items-center justify-center bg-black">
                            <Video className="h-5 w-5 text-white" />
                          </div>
                        ) : isAudio ? (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                            <Music className="h-5 w-5 text-green-500" />
                          </div>
                        ) : isPdf ? (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                            <FileText className="h-5 w-5 text-red-500" />
                          </div>
                        ) : (
                          <div className={cn(
                            "h-full w-full rounded flex items-center justify-center",
                            mediaType === 'image' && "bg-blue-50 text-blue-600",
                            mediaType === 'audio' && "bg-green-50 text-green-600",
                            mediaType === 'video' && "bg-purple-50 text-purple-600",
                            mediaType === 'pdf' && "bg-amber-50 text-amber-600",
                            mediaType === 'other' && "bg-gray-50 text-gray-600",
                          )}>
                            {getMediaIcon(file.file_type)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-[180px] sm:max-w-[250px] md:max-w-[300px]">{file.title}</span>
                        <span className="text-muted-foreground text-[10px] truncate max-w-[180px] sm:max-w-[250px] md:max-w-[300px]">
                          {file.description || getMediaTypeLabel(mediaType)}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2 hidden md:table-cell text-muted-foreground">{formatFileSize(file.size)}</td>
                    <td className="px-2 py-2 hidden lg:table-cell text-muted-foreground">
                      {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-2 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => openPreview(file.file_url, file.file_type)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleDownload(file.file_url, file.title)}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        {canDelete && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 hover:text-destructive"
                            onClick={() => onDelete && onDelete(file.id)}
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
