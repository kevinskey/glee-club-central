
import React from "react";
import { MediaFile } from "@/types/media";
import { MediaFileCard } from "./MediaFileCard";
import { MediaType, getMediaType } from "@/utils/mediaUtils";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface MediaFilesSectionProps {
  files: MediaFile[];
  mediaType: MediaType | "all";
  viewMode?: "grid" | "list";
  title?: string;
  onDelete?: () => void;
}

export function MediaFilesSection({ 
  files, 
  mediaType, 
  viewMode = "grid",
  title,
  onDelete
}: MediaFilesSectionProps) {
  // Filter files by media type if mediaType is specified (not "all")
  const filteredFiles = mediaType !== "all" 
    ? files.filter(file => getMediaType(file.file_type) === mediaType)
    : files;
  
  if (filteredFiles.length === 0) {
    return null;
  }

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
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Function to open a file
  const openFile = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="mb-6 md:mb-8 px-2 sm:px-0">
      {title && <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 break-words capitalize">{title}</h2>}
      
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredFiles.map((file) => (
            <MediaFileCard key={file.id} file={file} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.title}</TableCell>
                  <TableCell>{file.category || getMediaType(file.file_type)}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>{formatDate(file.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => openFile(file.file_url)}>
                      <Download className="h-4 w-4 mr-1" /> Open
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
