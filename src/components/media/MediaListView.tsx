
import React from "react";
import { MediaFile } from "@/types/media";
import { MediaType, getMediaType } from "@/utils/mediaUtils";
import { Eye, Download, Trash2, FileText, Image, Music, Video, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/file-utils";
import { format } from "date-fns";
import { PDFThumbnail } from "@/components/pdf/PDFThumbnail";

interface MediaListViewProps {
  mediaFiles: MediaFile[];
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function MediaListView({ mediaFiles, canEdit, canDelete, onDelete }: MediaListViewProps) {
  const getMediaIcon = (type: MediaType, className: string = "h-4 w-4") => {
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
    <div className="overflow-hidden border rounded-md">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            <th className="py-2 px-4 text-left font-medium text-sm">File</th>
            <th className="py-2 px-4 text-left font-medium text-sm hidden md:table-cell">Type</th>
            <th className="py-2 px-4 text-left font-medium text-sm hidden md:table-cell">Size</th>
            <th className="py-2 px-4 text-left font-medium text-sm hidden lg:table-cell">Date</th>
            <th className="py-2 px-4 text-right font-medium text-sm">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {mediaFiles.map((file) => {
            const mediaType = getMediaType(file.file_type);
            const isImage = mediaType === "image";
            const isPdf = mediaType === "pdf";
            
            return (
              <tr key={file.id} className="hover:bg-muted/30">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-muted/40 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {isImage ? (
                        <img 
                          src={file.file_url} 
                          alt={file.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-image.svg";
                          }}
                        />
                      ) : isPdf ? (
                        <PDFThumbnail 
                          url={file.file_url} 
                          title={file.title}
                          className="w-full h-full"
                          aspectRatio={1}
                        />
                      ) : (
                        getMediaIcon(mediaType)
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {file.description || file.file_path.split('/').pop()}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="inline-flex items-center gap-1 text-xs">
                    {getMediaIcon(mediaType, "h-3 w-3")}
                    <span className="capitalize">{mediaType}</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-sm hidden md:table-cell">
                  {formatFileSize(file.size || 0)}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">
                  {format(new Date(file.created_at), 'MMM d, yyyy')}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => window.open(file.file_url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
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
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => handleDelete(file.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
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
  );
}
