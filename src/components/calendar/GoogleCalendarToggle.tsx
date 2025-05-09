
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getViewGoogleCalendarUrl } from "@/utils/googleCalendar";
import { toast } from "sonner";

interface GoogleCalendarToggleProps {
  useGoogleCalendar: boolean;
  toggleGoogleCalendar: () => void;
}

export const GoogleCalendarToggle = ({ 
  useGoogleCalendar, 
  toggleGoogleCalendar 
}: GoogleCalendarToggleProps) => {
  const handleToggle = () => {
    toggleGoogleCalendar();
    toast.info(
      useGoogleCalendar 
        ? "Switching to local calendar" 
        : "Switching to Google Calendar"
    );
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Google Calendar</span>
        <Switch 
          checked={useGoogleCalendar} 
          onCheckedChange={handleToggle} 
          className="data-[state=checked]:bg-glee-purple"
        />
      </div>
      
      {useGoogleCalendar && (
        <Button 
          variant="outline" 
          className="flex items-center space-x-2"
          onClick={() => window.open(getViewGoogleCalendarUrl(), '_blank')}
        >
          <span>View in Google</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
