
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Music } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AudioUploadForm } from "./audio/AudioUploadForm";
import { AudioCategory } from "./audio/audioCategoryUtils";
import { audioUploadSchema, AudioUploadFormValues } from "./audio/audioUploadSchema";
import { useAudioUpload } from "./audio/useAudioUpload";

interface UploadAudioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
  defaultCategory?: AudioCategory;
}

export function UploadAudioModal({
  open,
  onOpenChange,
  onUploadComplete,
  defaultCategory = "recordings",
}: UploadAudioModalProps) {
  const form = useForm<AudioUploadFormValues>({
    resolver: zodResolver(audioUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      category: defaultCategory,
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
    } else {
      // Set the category when the modal opens
      form.setValue("category", defaultCategory);
    }
  }, [open, form, defaultCategory]);

  const { isUploading, uploadAudio } = useAudioUpload({
    onUploadComplete,
    onClose: () => onOpenChange(false)
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" /> Upload Audio File
          </SheetTitle>
          <SheetDescription>
            Upload audio files for the choir to listen to.
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
