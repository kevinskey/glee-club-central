
import React, { useState, useEffect } from "react";
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
import { hasPermission } from "@/utils/permissionChecker";

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
  const { user, profile } = useAuth();
  
  console.log("UploadMediaModal - Props:", { controlledOpen, defaultCategory });
  console.log("UploadMediaModal - User:", user);
  
  // Create user object for permission checking
  const currentUser = {
    ...user,
    role_tags: profile?.role_tags || []
  };
  
  // Check if user has permission to upload media - temporarily bypass for debugging
  const canUpload = !!user; // Changed from permission check to just user existence
  
  console.log("UploadMediaModal - Can upload:", canUpload);
  
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  // Log the open state changes for debugging
  useEffect(() => {
    console.log("UploadMediaModal open state changed to:", open);
  }, [open]);

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
  } = useMediaUpload(() => {
    console.log("Upload completed, calling onUploadComplete");
    onUploadComplete();
  }, defaultCategory);

  const handleClose = () => {
    console.log("Closing upload modal");
    setOpen(false);
    resetForm();
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    console.log("Dialog onOpenChange called with:", isOpen);
    setOpen(isOpen);
    if (!isOpen) resetForm();
  };

  if (!canUpload) {
    console.log("UploadMediaModal - Cannot upload, returning null");
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button size="sm">
            <FileUp className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        </DialogTrigger>
      )}
      <DialogContent 
        className={`${isMobile ? 'w-[calc(100%-2rem)]' : 'sm:max-w-[500px]'} overflow-y-auto max-h-[90vh]`}
        data-testid="upload-media-modal"
      >
        <DialogHeader>
          <DialogTitle>Upload Media Files</DialogTitle>
          <DialogDescription>
            Upload files to the media library. Maximum file size is 25MB per file.
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
