
import React from "react";
import { MediaFile } from "@/types/media";
import { MediaFileCard } from "./MediaFileCard";
import { MediaType, getMediaType } from "@/utils/mediaUtils";

interface MediaFilesSectionProps {
  files: MediaFile[];
  mediaType: MediaType;
  title: string;
}

export function MediaFilesSection({ files, mediaType, title }: MediaFilesSectionProps) {
  // Filter files by media type
  const filteredFiles = files.filter(file => getMediaType(file.file_type) === mediaType);
  
  if (filteredFiles.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <MediaFileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
