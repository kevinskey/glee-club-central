
import React from "react";
import { MediaFile } from "@/types/media";
import { MediaType, getMediaType } from "@/utils/mediaUtils";
import { Eye, Download, Trash2, FileText, Image, Music, Video, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/file-utils";
import { format } from "date-fns";
import { PDFThumbnail } from "@/components/pdf/PDFThumbnail";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  if (mediaFiles.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No media files found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filter settings</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">File</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden md:table-cell">Size</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mediaFiles.map((file) => {
            const mediaType = getMediaType(file.file_type);
            const isImage = mediaType === "image";
            const isPdf = mediaType === "pdf";
            
            return (
              <TableRow key={file.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-muted/40 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {isImage ? (
                        <img 
                          src={file.file_url} 
                          alt={file.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center">
                                  <svg class="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : isPdf ? (
                        <div className="w-full h-full">
                          <PDFThumbnail 
                            url={file.file_url} 
                            title={file.title}
                            className="w-full h-full"
                            aspectRatio={1}
                          />
                        </div>
                      ) : (
                        getMediaIcon(mediaType)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{file.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {file.description || file.file_path.split('/').pop()}
                      </p>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="hidden md:table-cell">
                  <span className="inline-flex items-center gap-1 text-xs">
                    {getMediaIcon(mediaType, "h-3 w-3")}
                    <span className="capitalize">{mediaType}</span>
                  </span>
                </TableCell>
                
                <TableCell className="hidden md:table-cell text-sm">
                  {formatFileSize(file.size || 0)}
                </TableCell>
                
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {format(new Date(file.created_at), 'MMM d, yyyy')}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => window.open(file.file_url, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost"
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
                        variant="ghost"
                        onClick={(e) => handleDelete(file.id, e)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
