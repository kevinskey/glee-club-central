import React from "react";
import { FileText, FileAudio, FileImage, FileVideo, File, Download, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaFile } from "@/types/media";
import { getMediaType } from "@/utils/mediaUtils";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/hooks/usePermissions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MediaFileCardProps {
  file: MediaFile;
  onDelete?: () => void;
}

export function MediaFileCard({ file, onDelete }: MediaFileCardProps) {
  const { hasPermission, isSuperAdmin } = usePermissions();
  const canDeleteFiles = isSuperAdmin || hasPermission('can_upload_media');
  
  // Function to get the appropriate icon based on media type
  const getFileIcon = () => {
    const mediaType = getMediaType(file.file_type);
    
    switch (mediaType) {
      case "pdf":
        return <FileText className="h-8 w-8 md:h-10 md:w-10 text-red-500" />;
      case "audio":
        return <FileAudio className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />;
      case "image":
        return <FileImage className="h-8 w-8 md:h-10 md:w-10 text-green-500" />;
      case "video":
        return <FileVideo className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />;
      default:
        return <File className="h-8 w-8 md:h-10 md:w-10 text-gray-500" />;
    }
  };

  // Function to handle opening the file
  const handleOpenFile = () => {
    window.open(file.file_url, "_blank");
  };

  // Function to delete a file
  const handleDeleteFile = async () => {
    if (!canDeleteFiles) return;
    
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media-library')
        .remove([file.file_path]);
        
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', file.id);
        
      if (dbError) throw dbError;
      
      toast.success('File deleted successfully');
      
      // Refresh the list if callback is provided
      if (onDelete) onDelete();
      
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast.error('Failed to delete file', {
        description: error.message || 'An unexpected error occurred'
      });
    }
  };

  // Function to format the date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Date unknown";
    }
  };

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col rounded-lg border p-3 md:p-4 hover:shadow-md transition-shadow h-full">
      <div className="flex items-center gap-3 mb-3">
        {getFileIcon()}
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-medium line-clamp-1 break-words">{file.title}</h3>
          <p className="text-xs text-muted-foreground">
            Added {formatDate(file.created_at)}
          </p>
        </div>
      </div>
      
      <div className="flex-1">
        {file.description && (
          <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2 break-words">
            {file.description}
          </p>
        )}
        
        {file.tags && file.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {file.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                <Tag size={10} />
                {tag}
              </Badge>
            ))}
            {file.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{file.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mb-3">
          Size: {formatFileSize(file.size)}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="default" 
          onClick={handleOpenFile}
          className="flex-1 text-xs md:text-sm"
          size="sm"
        >
          <Download className="h-3 w-3 mr-1" />
          Open
        </Button>
        
        {canDeleteFiles && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={handleDeleteFile}
                size="sm"
                className="px-2"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete file</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
