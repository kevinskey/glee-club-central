
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MediaFile } from "@/types/media";
import { MediaType, getMediaType } from "@/utils/mediaUtils";
import { Eye, Download, Trash2, FileText, Image, Music, Video, File } from "lucide-react";
import { formatFileSize } from "@/utils/file-utils";
import { format } from "date-fns";

interface MediaGridViewProps {
  mediaFiles: MediaFile[];
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function MediaGridView({ mediaFiles, canEdit, canDelete, onDelete }: MediaGridViewProps) {
  const getMediaIcon = (type: MediaType, className: string = "h-12 w-12 text-muted-foreground") => {
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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (confirm("Are you sure you want to delete this file?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {mediaFiles.map((file) => {
        const mediaType = getMediaType(file.file_type);
        const isImage = mediaType === "image";
        
        return (
          <Card key={file.id} className="overflow-hidden group">
            <div className="relative">
              <AspectRatio ratio={16/9} className="bg-muted/40">
                {isImage ? (
                  <img 
                    src={file.file_url} 
                    alt={file.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-image.svg";
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    {getMediaIcon(mediaType)}
                  </div>
                )}
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => window.open(file.file_url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = file.file_url;
                        a.download = file.title;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    {canDelete && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={(e) => handleDelete(file.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </AspectRatio>
            </div>
            
            <CardContent className="p-3">
              <div className="mb-1 flex items-start justify-between">
                <h3 className="font-medium text-sm truncate mr-2" title={file.title}>
                  {file.title}
                </h3>
                <span className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded">
                  {mediaType}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                <span>{formatFileSize(file.size || 0)}</span>
                <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
