
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Upload, FileQuestion } from "lucide-react";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-md p-4 h-[230px]">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[160px]" />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex justify-between mt-6">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-md">
        <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No media files found</h3>
        <p className="text-sm text-muted-foreground text-center mb-6">
          No media files match your search criteria or no files have been uploaded yet.
        </p>
        {canUpload && (
          <Button onClick={onUploadClick}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        )}
      </div>
    );
  }
  
  return null;
}
