
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Calendar, Google } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getViewGoogleCalendarUrl } from "@/utils/googleCalendar";
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';

interface GoogleCalendarToggleProps {
  useGoogleCalendar: boolean;
  toggleGoogleCalendar: () => void;
  compact?: boolean; // For compact display in smaller UI areas
}

export const GoogleCalendarToggle = ({ 
  useGoogleCalendar, 
  toggleGoogleCalendar,
  compact = false
}: GoogleCalendarToggleProps) => {
  const handleToggle = () => {
    toggleGoogleCalendar();
    toast.info(
      useGoogleCalendar 
        ? "Switching to local calendar" 
        : "Switching to Google Calendar"
    );
  };

  if (compact) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className={`h-8 px-3 flex items-center gap-1 ${useGoogleCalendar ? 'bg-glee-purple text-white hover:bg-glee-purple/90' : 'bg-transparent'}`}
        onClick={handleToggle}
      >
        {useGoogleCalendar ? (
          <>
            <Google className="h-3 w-3" />
            <span className="text-xs">Google</span>
          </>
        ) : (
          <>
            <Calendar className="h-3 w-3" />
            <span className="text-xs">Local</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        {useGoogleCalendar ? (
          <Badge variant="outline" className="flex items-center gap-1 bg-glee-purple/10 text-glee-purple border-glee-purple/50 px-2 py-0.5">
            <Google className="h-3 w-3 mr-1" />
            <span className="text-xs">Google Calendar</span>
          </Badge>
        ) : (
          <span className="text-sm font-medium">Google Calendar</span>
        )}
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
