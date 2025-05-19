
import React from "react";
import { FileIcon, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface MediaLoadingStateProps {
  isLoading: boolean;
  isEmpty: boolean;
  canUpload: boolean;
  onUploadClick: () => void;
}

export function MediaLoadingState({ isLoading, isEmpty, canUpload, onUploadClick }: MediaLoadingStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Spinner className="mb-4 h-8 w-8 text-primary" />
        <p className="text-muted-foreground">Loading media library...</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-lg">
        <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No media files found</h3>
        <p className="text-muted-foreground mb-6">
          {canUpload
            ? "Upload files to start building your media library"
            : "Media matching your search criteria will appear here"}
        </p>
        {canUpload && (
          <Button onClick={onUploadClick}>
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        )}
      </div>
    );
  }

  // If neither loading nor empty, return nothing
  return null;
}
