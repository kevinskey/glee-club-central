
import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Copy, Link } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CalendarShare() {
  const handleCopyLink = () => {
    // Copy calendar URL to clipboard
    const calendarUrl = window.location.href;
    navigator.clipboard.writeText(calendarUrl);
    // You would normally show a toast here
    console.log("Calendar link copied to clipboard:", calendarUrl);
  };

  const handleEmailShare = () => {
    // Share via email
    const calendarUrl = window.location.href;
    const subject = "Check out our Glee Club Calendar";
    const body = `View our upcoming events: ${calendarUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSocialShare = (platform: string) => {
    // Share to social platforms
    const calendarUrl = window.location.href;
    const text = "Check out the Spelman College Glee Club calendar!";
    
    let shareUrl = "";
    
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(calendarUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(calendarUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Share Calendar</h3>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={handleCopyLink}
        >
          <Copy className="h-4 w-4" /> Copy Link
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEmailShare()}>
              Share via Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSocialShare('twitter')}>
              Share to Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSocialShare('facebook')}>
              Share to Facebook
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default CalendarShare;
