
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AudioFile } from "@/types/audio";
import { SocialShareButtons } from "./SocialShareButtons";

interface ShareRecordingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recording: AudioFile;
}

export function ShareRecordingDialog({
  open,
  onOpenChange,
  recording,
}: ShareRecordingDialogProps) {
  const { toast } = useToast();
  const shareLink = recording.file_url;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Share Recording
          </DialogTitle>
          <DialogDescription>
            Share "{recording.title}" with others using a link or on social media
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-4">
          <SocialShareButtons 
            url={shareLink} 
            title={recording.title}
          />
        </div>
        
        <DialogFooter className="sm:justify-start">
          <div className="text-xs text-muted-foreground mt-2">
            Anyone with this link will be able to listen to your recording.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
