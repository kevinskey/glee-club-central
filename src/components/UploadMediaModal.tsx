
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

interface UploadMediaModalProps {
  onUploadComplete: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UploadMediaModal({ 
  onUploadComplete,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: UploadMediaModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  const {
    title,
    setTitle,
    description,
    setDescription,
    files,
    setFiles,
    uploading,
    uploadProgress,
    handleUpload,
    resetForm
  } = useMediaUpload(onUploadComplete);

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
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
      <DialogContent className={`${isMobile ? 'w-[calc(100%-2rem)]' : 'sm:max-w-[500px]'} overflow-y-auto max-h-[90vh]`}>
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
