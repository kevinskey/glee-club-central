
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaLoadingStateProps {
  isLoading: boolean;
  isEmpty: boolean;
  canUpload: boolean;
  onUploadClick: () => void;
}

export function MediaLoadingState({ 
  isLoading, 
  isEmpty, 
  canUpload, 
  onUploadClick 
}: MediaLoadingStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner size="lg" className="mb-4" />
        <p className="text-muted-foreground">Loading media library...</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No media files found matching your criteria.</p>
        {canUpload && (
          <Button 
            onClick={onUploadClick}
            variant="outline" 
            className="mt-4"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Your First Media File
          </Button>
        )}
      </div>
    );
  }

  return null;
}
