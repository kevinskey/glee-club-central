
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function CalendarShare() {
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = () => {
    // Generate a calendar share URL (this is a placeholder - implement your actual sharing logic)
    const shareUrl = `${window.location.origin}/calendar?public=true`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast.success("Calendar link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Error copying text: ", err);
        toast.error("Failed to copy link to clipboard");
      });
  };
  
  return (
    <div className="rounded-lg border p-4 space-y-4 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium">Share Calendar</h3>
      
      <p className="text-sm text-muted-foreground">
        Share your calendar with others by copying the link below.
      </p>
      
      <div className="flex items-center space-x-2">
        <Input 
          value={`${window.location.origin}/calendar?public=true`}
          readOnly
          className="flex-1"
        />
        
        <Button 
          onClick={handleCopyLink}
          variant="outline"
          size="icon"
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <Button
        variant="default"
        className="w-full"
        onClick={handleCopyLink}
      >
        <Share className="mr-2 h-4 w-4" />
        Copy Share Link
      </Button>
    </div>
  );
}
