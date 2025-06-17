
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MoreHorizontal, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  Image,
  Video,
  Music
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MediaFile } from '@/types/media';
import { getMediaType } from '@/utils/mediaUtils';
import { formatFileSize } from '@/utils/file-utils';

interface MediaGridViewProps {
  mediaFiles: MediaFile[];
  canEdit?: boolean;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
  onUpdateTitle?: (id: string, newTitle: string) => void;
  onSelect?: (fileId: string, selected: boolean) => void;
  selectedFiles?: string[];
}

export function MediaGridView({
  mediaFiles,
  canEdit = false,
  canDelete = false,
  onDelete,
  onUpdateTitle,
  onSelect,
  selectedFiles = []
}: MediaGridViewProps) {
  const getMediaIcon = (fileType: string) => {
    const mediaType = getMediaType(fileType);
    switch (mediaType) {
      case 'image': return <Image className="h-6 w-6" />;
      case 'video': return <Video className="h-6 w-6" />;
      case 'audio': return <Music className="h-6 w-6" />;
      default: return <FileText className="h-6 w-6" />;
    }
  };

  const handleDownload = (file: MediaFile) => {
    const a = document.createElement('a');
    a.href = file.file_url;
    a.download = file.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePreview = (file: MediaFile) => {
    window.open(file.file_url, '_blank');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mediaFiles.map((file) => (
        <Card key={file.id} className="relative group">
          {onSelect && (
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={selectedFiles.includes(file.id)}
                onCheckedChange={(checked) => onSelect(file.id, checked as boolean)}
              />
            </div>
          )}
          
          <div className="aspect-video bg-muted flex items-center justify-center relative">
            {getMediaType(file.file_type) === 'image' ? (
              <img 
                src={file.file_url} 
                alt={file.title}
                className="w-full h-full object-cover rounded-t-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center">${getMediaIcon(file.file_type).props.children}</div>`;
                  }
                }}
              />
            ) : (
              <div className="text-muted-foreground">
                {getMediaIcon(file.file_type)}
              </div>
            )}
            
            {/* Action overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => handlePreview(file)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleDownload(file)}>
                <Download className="h-4 w-4" />
              </Button>
              {(canEdit || canDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="secondary">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {canEdit && onUpdateTitle && (
                      <DropdownMenuItem onClick={() => {
                        const newTitle = prompt('Enter new title:', file.title);
                        if (newTitle && newTitle !== file.title) {
                          onUpdateTitle(file.id, newTitle);
                        }
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                    )}
                    {canDelete && onDelete && (
                      <DropdownMenuItem 
                        onClick={() => onDelete(file.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          
          <CardContent className="p-3">
            <h3 className="font-medium truncate mb-1">{file.title}</h3>
            {file.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {file.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {getMediaType(file.file_type).toUpperCase()}
              </Badge>
              <span>{formatFileSize(file.size || 0)}</span>
            </div>
            
            {file.tags && file.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {file.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {file.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{file.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
