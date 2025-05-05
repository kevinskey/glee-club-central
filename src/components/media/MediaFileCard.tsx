
import React from "react";
import { FileText, FileAudio, FileImage, FileVideo, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaFile } from "@/types/media";
import { getMediaType } from "@/utils/mediaUtils";

interface MediaFileCardProps {
  file: MediaFile;
}

export function MediaFileCard({ file }: MediaFileCardProps) {
  // Function to get the appropriate icon based on media type
  const getFileIcon = () => {
    const mediaType = getMediaType(file.file_type);
    
    switch (mediaType) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />;
      case "audio":
        return <FileAudio className="h-10 w-10 text-blue-500" />;
      case "image":
        return <FileImage className="h-10 w-10 text-green-500" />;
      case "video":
        return <FileVideo className="h-10 w-10 text-purple-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  // Function to handle opening the file
  const handleOpenFile = () => {
    window.open(file.file_url, "_blank");
  };

  return (
    <div className="flex flex-col rounded-lg border p-4 hover:shadow-md transition-shadow h-full">
      <div className="flex items-center justify-center mb-4">
        {getFileIcon()}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium">{file.title}</h3>
        {file.description && (
          <p className="text-sm text-muted-foreground mt-1">{file.description}</p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Added {file.created_at}
        </p>
      </div>
      <div className="mt-4">
        <Button 
          variant="default" 
          onClick={handleOpenFile}
          className="w-full"
        >
          Open File
        </Button>
      </div>
    </div>
  );
}
