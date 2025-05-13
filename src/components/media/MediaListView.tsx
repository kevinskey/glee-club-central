
import React from "react";
import { MediaFile } from "@/types/media";
import { formatFileSize, getFileTypeIcon } from "@/utils/file-utils";
import { Button } from "@/components/ui/button";
import { Eye, Download, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getMediaType } from "@/utils/mediaUtils";

interface MediaListViewProps {
  mediaFiles: MediaFile[];
  canEdit?: boolean;
  canDelete?: boolean;
  onDelete?: (mediaId: string) => void;
}

export function MediaListView({ 
  mediaFiles, 
  canEdit = false,
  canDelete = false,
  onDelete 
}: MediaListViewProps) {
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (onDelete && window.confirm("Are you sure you want to delete this media file?")) {
      onDelete(id);
    }
  };
  
  return (
    <div className="space-y-2">
      {mediaFiles.map((file) => {
        const FileTypeIcon = getFileTypeIcon(file.file_type);
        const fileType = getMediaType(file.file_type);
        const formattedDate = file.created_at 
          ? formatDistanceToNow(new Date(file.created_at), { addSuffix: true })
          : '';
        
        return (
          <div 
            key={file.id} 
            className="flex items-center p-2 border rounded-md hover:bg-muted/20 transition-colors"
            onClick={() => window.open(file.file_url, "_blank")}
          >
            {/* Icon or thumbnail */}
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-muted rounded mr-3">
              {fileType === 'image' ? (
                <img 
                  src={file.file_url} 
                  alt={file.title || ''} 
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <FileTypeIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            
            {/* File info */}
            <div className="flex-grow min-w-0">
              <h3 className="text-sm font-medium truncate">{file.title}</h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="truncate">{formattedDate} • {formatFileSize(file.size || 0)}</span>
              </div>
              {file.category && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {file.category}
                </Badge>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex-shrink-0 flex ml-2 gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.open(file.file_url, "_blank");
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  
                  // Create a temporary link to download the file
                  const link = document.createElement('a');
                  link.href = file.file_url;
                  link.download = file.title || 'download';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
              
              {canEdit && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    alert('Edit functionality coming soon');
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              
              {canDelete && onDelete && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => handleDelete(file.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
