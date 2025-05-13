
import React from 'react';
import { Button } from '@/components/ui/button';
import { MediaFile } from '@/types/media';
import { Download, Eye, Trash, FileText, Music, Image, Video, File } from 'lucide-react';
import { getMediaType, getMediaTypeLabel } from '@/utils/mediaUtils';
import { formatFileSize } from '@/utils/file-utils';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

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
  const getMediaIcon = (fileType: string) => {
    const type = getMediaType(fileType);
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'audio':
        return <Music className="h-4 w-4 text-muted-foreground" />;
      case 'image':
        return <Image className="h-4 w-4 text-muted-foreground" />;
      case 'video':
        return <Video className="h-4 w-4 text-muted-foreground" />;
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

  const handleViewMedia = (file: MediaFile) => {
    window.open(file.file_url, '_blank');
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-xs">
              <th className="px-2 py-2 text-left font-medium text-muted-foreground">Type</th>
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
              
              return (
                <tr key={file.id} className="hover:bg-muted/50 text-xs">
                  <td className="px-2 py-2">
                    <div className="flex items-center">
                      <div className={cn(
                        "h-6 w-6 rounded flex items-center justify-center",
                        mediaType === 'image' && "bg-blue-50 text-blue-600",
                        mediaType === 'audio' && "bg-green-50 text-green-600",
                        mediaType === 'video' && "bg-purple-50 text-purple-600",
                        mediaType === 'pdf' && "bg-amber-50 text-amber-600",
                        mediaType === 'other' && "bg-gray-50 text-gray-600",
                      )}>
                        {getMediaIcon(file.file_type)}
                      </div>
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
                        onClick={() => handleViewMedia(file)}
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
  );
}
