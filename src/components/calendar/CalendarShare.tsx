
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export function CalendarShare() {
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const generateShareUrl = () => {
    // Generate a URL with necessary query parameters
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/calendar?public=true&from=${new Date().toISOString()}`;
    return shareUrl;
  };
  
  const handleCopyLink = () => {
    const shareUrl = generateShareUrl();
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success("Share link copied to clipboard"))
      .catch(() => toast.error("Failed to copy link"));
  };
  
  const handleShareCalendar = () => {
    setShowShareOptions(true);
  };
  
  return (
    <div className="rounded-lg border p-4 space-y-4 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium">Share Calendar</h3>
      
      <p className="text-sm text-muted-foreground">
        Share the Glee Club calendar with others.
      </p>
      
      {!showShareOptions ? (
        <Button 
          onClick={handleShareCalendar} 
          variant="outline" 
          size="sm"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Calendar
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              readOnly
              value={generateShareUrl()}
              className="text-xs"
            />
            <Button 
              onClick={handleCopyLink} 
              variant="outline" 
              size="sm"
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This link will give access to public events only.
          </p>
        </div>
      )}
    </div>
  );
}
