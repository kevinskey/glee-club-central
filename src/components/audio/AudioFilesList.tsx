
import React from "react";
import { Download, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AudioFile, AudioPageCategory } from "@/types/audio";
import { AudioCategoryIcon } from "./AudioCategoryIcon";

interface AudioFilesListProps {
  loading: boolean;
  displayFiles: AudioFile[];
  category: AudioPageCategory;
  searchQuery: string;
  canDeleteFile: (uploadedBy: string) => boolean;
  confirmDelete: (id: string) => void;
  onUploadClick: (category?: Exclude<AudioPageCategory, "all">) => void;
}

export function AudioFilesList({
  loading,
  displayFiles,
  category,
  searchQuery,
  canDeleteFile,
  confirmDelete,
  onUploadClick
}: AudioFilesListProps) {
  // Helper function to handle download
  const handleDownload = (file: AudioFile) => {
    // Create an anchor element
    const a = document.createElement("a");
    a.href = file.file_url;
    // Set download attribute to force download instead of navigation
    a.download = `${file.title}.wav`;
    // Append to body, click and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Check if there are no audio files for this category or search
  if (displayFiles.length === 0) {
    const isSearching = searchQuery.trim().length > 0;
    const categoryName = getCategoryDisplayName(category);
    
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <AudioCategoryIcon category={category} size="large" />
          <h3 className="text-xl font-medium mb-2">
            {isSearching 
              ? "No matching audio files found" 
              : `No ${categoryName.toLowerCase()} found`}
          </h3>
          <p className="text-muted-foreground mb-6">
            {isSearching 
              ? "Try a different search term" 
              : `Upload ${categoryName.toLowerCase()} for choir members to access`}
          </p>
          <Button 
            onClick={() => onUploadClick(category === "all" ? "recordings" : (category as Exclude<AudioPageCategory, "all">))}
            className="gap-2"
          >
            Upload {category === "all" ? "Audio" : categoryName}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Title</TableHead>
            <TableHead className="w-[40%]">Description</TableHead>
            <TableHead className="w-[15%]">Date Uploaded</TableHead>
            <TableHead className="w-[15%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayFiles.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">{file.title}</TableCell>
              <TableCell>{file.description || "-"}</TableCell>
              <TableCell>{file.created_at}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  
                  {canDeleteFile(file.uploaded_by) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDelete(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getCategoryDisplayName(category: AudioPageCategory): string {
  switch (category) {
    case "part_tracks":
      return "Part Tracks";
    case "recordings":
      return "Recordings";
    case "my_tracks":
      return "My Tracks";
    case "all":
      return "All Audio";
  }
}
