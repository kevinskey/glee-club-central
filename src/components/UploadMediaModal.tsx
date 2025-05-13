
import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MediaUploadForm } from "@/components/media/MediaUploadForm";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

interface UploadMediaModalProps {
  onUploadComplete: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultCategory?: string;
}

export function UploadMediaModal({ 
  onUploadComplete,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  defaultCategory = "general"
}: UploadMediaModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  // Allow any authenticated user to upload media
  const canUpload = !!user;
  
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

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
    setOpen(false);
    resetForm();
  };

  if (!canUpload) {
    return null;
  }

  console.log("Upload modal open state:", open);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      console.log("Dialog onOpenChange called with:", isOpen);
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button size="sm">
            <FileUp className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className={`${isMobile ? 'w-[calc(100%-2rem)]' : 'sm:max-w-[500px]'} overflow-y-auto max-h-[90vh]`}
        data-testid="upload-media-modal">
        <DialogHeader>
          <DialogTitle>Upload Media Files</DialogTitle>
          <DialogDescription>
            Upload multiple files to the media library. Maximum file size is 25MB per file.
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
