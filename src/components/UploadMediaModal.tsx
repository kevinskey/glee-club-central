
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaUploadForm } from "@/components/media/MediaUploadForm";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useIsMobile } from "@/hooks/use-mobile";

interface UploadMediaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
  defaultCategory?: string;
}

export function UploadMediaModal({
  open,
  onOpenChange,
  onUploadComplete,
  defaultCategory = "other"
}: UploadMediaModalProps) {
  const isMobile = useIsMobile();
  
  const {
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    tags,
    setTags,
    files,
    setFiles,
    uploading,
    uploadProgress,
    handleUpload,
    resetForm
  } = useMediaUpload(onUploadComplete, defaultCategory);

  const handleClose = () => {
    if (!uploading) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className={`${isMobile ? 'w-[95vw]' : 'max-w-3xl'} h-[90vh] flex flex-col`}
        onInteractOutside={(e) => {
          if (uploading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <MediaUploadForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            tags={tags}
            setTags={setTags}
            files={files}
            setFiles={setFiles}
            uploading={uploading}
            uploadProgress={uploadProgress}
            onUpload={handleUpload}
            onCancel={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
