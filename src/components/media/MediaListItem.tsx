
import React, { forwardRef, useState } from 'react';
import { MediaFileLight } from '@/hooks/useInfiniteMediaLibrary';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Image, Music, Video, File } from 'lucide-react';
import { formatFileSize } from '@/utils/file-utils';
import { format } from 'date-fns';
import { getMediaType } from '@/utils/mediaUtils';

interface MediaListItemProps {
  file: MediaFileLight;
  isAdminView: boolean;
  onSelect: (fileId: string) => void;
}

export const MediaListItem = forwardRef<HTMLDivElement, MediaListItemProps>(
  ({ file, isAdminView, onSelect }, ref) => {
    const [imageError, setImageError] = useState(false);
    const mediaType = getMediaType(file.file_type);

    const getMediaIcon = (type: string, className: string = "h-4 w-4") => {
      switch (type) {
        case "image":
          return <Image className={className} />;
        case "pdf":
          return <FileText className={className} />;
        case "audio":
          return <Music className={className} />;
        case "video":
          return <Video className={className} />;
        default:
          return <File className={className} />;
      }
    };

    const handleClick = () => {
      onSelect(file.id);
    };

    return (
      <div 
        ref={ref}
        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer group transition-colors"
        onClick={handleClick}
      >
        {/* Thumbnail */}
        <div className="w-12 h-12 rounded bg-muted/40 overflow-hidden flex items-center justify-center flex-shrink-0">
          {mediaType === "image" && file.file_url && !imageError ? (
            <img 
              src={file.file_url} 
              alt={file.title}
              loading="lazy"
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
            />
          ) : (
            getMediaIcon(mediaType, "h-6 w-6")
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{file.title}</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
            <span className="capitalize">{mediaType}</span>
            <span>{formatFileSize(file.size || 0)}</span>
            <span className="hidden sm:inline">
              {format(new Date(file.created_at), 'MMM d, yyyy')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0">
          <Button 
            size="sm" 
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px]"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
);

MediaListItem.displayName = 'MediaListItem';
