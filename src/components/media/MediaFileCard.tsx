
import React from "react";
import { FileText, FileAudio, FileImage, FileVideo, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaFile } from "@/types/media";
import { getMediaType } from "@/utils/mediaUtils";
import { formatDistanceToNow } from "date-fns";

interface MediaFileCardProps {
  file: MediaFile;
}

export function MediaFileCard({ file }: MediaFileCardProps) {
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

  // Function to format the date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Date unknown";
    }
  };

  return (
    <div className="flex flex-col rounded-lg border p-3 md:p-4 hover:shadow-md transition-shadow h-full">
      <div className="flex items-center gap-3 mb-3">
        {getFileIcon()}
        <h3 className="text-base md:text-lg font-medium line-clamp-1 break-words">{file.title}</h3>
      </div>
      <div className="flex-1">
        {file.description && (
          <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2 break-words">{file.description}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          Added {formatDate(file.created_at)}
        </p>
      </div>
      <div className="w-full">
        <Button 
          variant="default" 
          onClick={handleOpenFile}
          className="w-full text-xs md:text-sm truncate"
          size="sm"
        >
          Open File
        </Button>
      </div>
    </div>
  );
}
