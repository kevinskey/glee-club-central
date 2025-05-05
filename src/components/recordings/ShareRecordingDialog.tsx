
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AudioFile } from "@/types/audio";

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
  const [copied, setCopied] = useState(false);
  
  const shareLink = recording.file_url;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Share Recording
          </DialogTitle>
          <DialogDescription>
            Share "{recording.title}" with others using a link
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">Link</Label>
            <Input
              id="link"
              value={shareLink}
              readOnly
              className="w-full"
            />
          </div>
          <Button 
            type="button" 
            size="icon"
            onClick={handleCopyLink}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy</span>
          </Button>
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
