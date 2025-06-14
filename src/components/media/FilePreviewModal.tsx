
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaFileDetailed } from "@/hooks/usePaginatedMediaLibrary";
import { getMediaType } from "@/utils/mediaUtils";
import { formatFileSize } from "@/utils/file-utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { PDFThumbnail } from "@/components/pdf/PDFThumbnail";

interface FilePreviewModalProps {
  file: MediaFileDetailed | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilePreviewModal({ file, open, onOpenChange }: FilePreviewModalProps) {
  if (!file) return null;

  const mediaType = getMediaType(file.file_type);
  const isImage = mediaType === "image";
  const isPdf = mediaType === "pdf";
  const isVideo = mediaType === "video";
  const isAudio = mediaType === "audio";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{file.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Preview */}
          <div className="aspect-video bg-muted/40 rounded-lg overflow-hidden flex items-center justify-center">
            {isImage && (
              <img 
                src={file.file_url} 
                alt={file.title}
                className="max-w-full max-h-full object-contain"
              />
            )}
            
            {isPdf && (
              <PDFThumbnail 
                url={file.file_url} 
                title={file.title}
                className="w-full h-full"
                aspectRatio={16/9}
              />
            )}
            
            {isVideo && (
              <video 
                src={file.file_url} 
                controls 
                className="max-w-full max-h-full"
              >
                Your browser does not support the video tag.
              </video>
            )}
            
            {isAudio && (
              <div className="w-full p-8">
                <audio 
                  src={file.file_url} 
                  controls 
                  className="w-full"
                >
                  Your browser does not support the audio tag.
                </audio>
              </div>
            )}
          </div>
          
          {/* File Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Type:</span>
                <Badge variant="outline" className="ml-2 capitalize">
                  {mediaType}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Size:</span>
                <span className="ml-2">{formatFileSize(file.size || 0)}</span>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-2">{format(new Date(file.created_at), 'PPP')}</span>
              </div>
              <div>
                <span className="font-medium">Folder:</span>
                <span className="ml-2">{file.folder || 'General'}</span>
              </div>
            </div>
            
            {file.description && (
              <div>
                <span className="font-medium">Description:</span>
                <p className="mt-1 text-muted-foreground">{file.description}</p>
              </div>
            )}
            
            {file.tags && file.tags.length > 0 && (
              <div>
                <span className="font-medium">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {file.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
