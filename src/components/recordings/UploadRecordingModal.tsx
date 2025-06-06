
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileAudio } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AudioUploadForm } from "../audio/AudioUploadForm";
import { audioUploadSchema, AudioUploadFormValues } from "../audio/audioUploadSchema";
import { useAudioUpload } from "../audio/useAudioUpload";

interface UploadRecordingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

export function UploadRecordingModal({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadRecordingModalProps) {
  const form = useForm<AudioUploadFormValues>({
    resolver: zodResolver(audioUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "my_tracks",
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
    } else {
      // Set the category when the modal opens
      form.setValue("category", "my_tracks");
    }
  }, [open, form]);

  const { isUploading, uploadAudio } = useAudioUpload({
    onUploadComplete,
    onClose: () => onOpenChange(false)
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileAudio className="h-5 w-5" /> Upload Recording
          </SheetTitle>
          <SheetDescription>
            Share your vocal recordings with the choir.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <AudioUploadForm 
            form={form} 
            onSubmit={uploadAudio} 
            isUploading={isUploading} 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
