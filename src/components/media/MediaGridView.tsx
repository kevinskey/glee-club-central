
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, Download } from "lucide-react";
import { MediaFile } from "@/types/media";
import { Badge } from "@/components/ui/badge";
import { formatFileSize, getFileTypeIcon } from "@/utils/file-utils";
import { getMediaType } from "@/utils/mediaUtils";

interface MediaGridViewProps {
  mediaFiles: MediaFile[];
  canEdit?: boolean;
  canDelete?: boolean;
  onDelete?: (mediaId: string) => void;
}

export function MediaGridView({ 
  mediaFiles, 
  canEdit = false,
  canDelete = false,
  onDelete 
}: MediaGridViewProps) {
  const handleDelete = (id: string) => {
    if (onDelete && window.confirm("Are you sure you want to delete this media file?")) {
      onDelete(id);
    }
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {mediaFiles.map((file) => {
        const FileTypeIcon = getFileTypeIcon(file.file_type);
        const fileType = getMediaType(file.file_type);
        
        return (
          <Card key={file.id} className="overflow-hidden transition-shadow hover:shadow-md">
            <div className="h-36 bg-muted flex items-center justify-center">
              {fileType === 'image' ? (
                <img 
                  src={file.file_url} 
                  alt={file.title || ''} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/400x225/e2e8f0/94a3b8?text=Image+Unavailable";
                  }}
                />
              ) : (
                <FileTypeIcon className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium line-clamp-1" title={file.title || ''}>
                  {file.title}
                </h3>
                <Badge variant="outline" className="shrink-0">
                  {file.file_type.split('/')[1]?.toUpperCase() || "FILE"}
                </Badge>
              </div>
              
              {file.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2" title={file.description}>
                  {file.description}
                </p>
              )}
              
              <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
                <div className="text-xs text-muted-foreground">
                  {file.size && formatFileSize(file.size)}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={file.file_url} download={file.title}>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert('Edit functionality coming soon')}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {canDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
