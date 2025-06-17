
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

interface MediaListViewProps {
  mediaFiles: MediaFile[];
  canEdit?: boolean;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
  onUpdateTitle?: (id: string, newTitle: string) => void;
  onSelect?: (fileId: string, selected: boolean) => void;
  selectedFiles?: string[];
}

export function MediaListView({
  mediaFiles,
  canEdit = false,
  canDelete = false,
  onDelete,
  onUpdateTitle,
  onSelect,
  selectedFiles = []
}: MediaListViewProps) {
  const getMediaIcon = (fileType: string) => {
    const mediaType = getMediaType(fileType);
    switch (mediaType) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {onSelect && (
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedFiles.length === mediaFiles.length && mediaFiles.length > 0}
                  indeterminate={selectedFiles.length > 0 && selectedFiles.length < mediaFiles.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      mediaFiles.forEach(file => onSelect(file.id, true));
                    } else {
                      selectedFiles.forEach(fileId => onSelect(fileId, false));
                    }
                  }}
                />
              </TableHead>
            )}
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mediaFiles.map((file) => (
            <TableRow key={file.id}>
              {onSelect && (
                <TableCell>
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onCheckedChange={(checked) => onSelect(file.id, checked as boolean)}
                  />
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-2">
                  {getMediaIcon(file.file_type)}
                  <div>
                    <div className="font-medium">{file.title}</div>
                    {file.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {file.description}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {getMediaType(file.file_type).toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>{formatFileSize(file.size || 0)}</TableCell>
              <TableCell>
                {file.tags && file.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
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
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {new Date(file.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handlePreview(file)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDownload(file)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  {(canEdit || canDelete) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
