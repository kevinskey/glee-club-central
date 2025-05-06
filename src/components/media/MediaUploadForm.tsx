
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

interface MediaUploadFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  uploading: boolean;
  uploadProgress: number;
  onUpload: () => void;
  onCancel: () => void;
}

export function MediaUploadForm({
  title,
  setTitle,
  description,
  setDescription,
  files,
  setFiles,
  uploading,
  uploadProgress,
  onUpload,
  onCancel
}: MediaUploadFormProps) {
  const isMobile = useIsMobile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Validate file size (max 25MB per file)
      const oversizedFiles = selectedFiles.filter(file => file.size > 25 * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        toast({
          title: "File(s) too large",
          description: "Each file must be less than 25MB",
          variant: "destructive",
        });
        return;
      }
      
      setFiles(selectedFiles);
    }
  };

  return (
    <>
      <div className="grid gap-4 py-3">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Media file title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {files.length > 1 && (
            <p className="text-xs text-muted-foreground">
              For multiple files, numbers will be appended to the title (e.g., {title} 1, {title} 2)
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the file(s)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={isMobile ? 2 : 3}
          />
        </div>
        <FileInput 
          files={files} 
          handleFileChange={handleFileChange} 
        />
        {uploading && uploadProgress > 0 && (
          <UploadProgressBar progress={uploadProgress} />
        )}
      </div>
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-end space-x-2'} mt-4`}>
        <Button variant="outline" onClick={onCancel} disabled={uploading} className={isMobile ? 'w-full' : ''}>
          Cancel
        </Button>
        <Button onClick={onUpload} disabled={uploading} className={isMobile ? 'w-full' : ''}>
          {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {uploading ? `Uploading ${files.length} file(s)...` : `Upload ${files.length || 0} file(s)`}
        </Button>
      </div>
    </>
  );
}

import { toast } from "@/components/ui/sonner";

interface FileInputProps {
  files: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FileInput({ files, handleFileChange }: FileInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="files">Files</Label>
      <Input
        id="files"
        type="file"
        onChange={handleFileChange}
        required
        className="text-sm"
        multiple
      />
      {files.length > 0 && (
        <div className="text-xs text-muted-foreground mt-1">
          <p>{files.length} file(s) selected:</p>
          <ul className="mt-1 ml-4 list-disc space-y-1">
            {files.slice(0, 5).map((file, index) => (
              <li key={index} className="break-all">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </li>
            ))}
            {files.length > 5 && <li>...and {files.length - 5} more</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

interface UploadProgressBarProps {
  progress: number;
}

function UploadProgressBar({ progress }: UploadProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div 
        className="bg-primary h-2.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
      <p className="text-xs text-muted-foreground mt-1">
        Uploading... {progress}%
      </p>
    </div>
  );
}
