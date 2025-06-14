
import React, { forwardRef, useState } from 'react';
import { MediaFileLight } from '@/hooks/useInfiniteMediaLibrary';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Image, Music, Video, File } from 'lucide-react';
import { formatFileSize } from '@/utils/file-utils';
import { format } from 'date-fns';
import { getMediaType } from '@/utils/mediaUtils';

interface MediaCardProps {
  file: MediaFileLight;
  isAdminView: boolean;
  onSelect: (fileId: string) => void;
}

export const MediaCard = forwardRef<HTMLDivElement, MediaCardProps>(
  ({ file, isAdminView, onSelect }, ref) => {
    const [imageError, setImageError] = useState(false);
    const mediaType = getMediaType(file.file_type);

    const getMediaIcon = (type: string, className: string = "h-6 w-6") => {
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
      <Card 
        ref={ref}
        className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleClick}
      >
        <div className="relative aspect-[4/3] bg-muted/40 overflow-hidden">
          {mediaType === "image" && file.file_url && !imageError ? (
            <img 
              src={file.file_url} 
              alt={file.title}
              loading="lazy"
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getMediaIcon(mediaType)}
            </div>
          )}
          
          {/* Overlay with preview button */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
        
        <CardContent className="p-3">
          <h3 className="font-medium text-sm truncate mb-1">{file.title}</h3>
          <p className="text-xs text-muted-foreground truncate mb-2">
            {file.title.split('.').pop()?.toUpperCase()}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="capitalize">{mediaType}</span>
            <span>{formatFileSize(file.size || 0)}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {format(new Date(file.created_at), 'MMM d, yyyy')}
          </div>
        </CardContent>
      </Card>
    );
  }
);

MediaCard.displayName = 'MediaCard';
