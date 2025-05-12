
import React, { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import { CalendarRange } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { getGoogleCalendarToken, startGoogleOAuth, checkGoogleCalendarConnection } from "@/utils/googleCalendar";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";

interface GoogleCalendarToggleProps {
  useGoogleCalendar: boolean;
  toggleGoogleCalendar: () => void;
  googleCalendarError?: string | null;
  daysAhead: number;
  onDaysAheadChange: (value: number) => void;
}

export const GoogleCalendarToggle = ({
  useGoogleCalendar,
  toggleGoogleCalendar,
  googleCalendarError,
  daysAhead,
  onDaysAheadChange,
}: GoogleCalendarToggleProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const { isSuperAdmin } = usePermissions();

  const checkConnection = async () => {
    setIsChecking(true);
    const connected = await checkGoogleCalendarConnection();
    setIsConnected(connected);
    console.info("Google Calendar connection status:", connected);
    setIsChecking(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleConnect = async () => {
    const authUrl = await startGoogleOAuth();
    if (authUrl) {
      // Open the OAuth URL in a popup window
      const width = 600;
      const height = 700;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      window.open(
        authUrl,
        "Google Calendar Authorization",
        `width=${width},height=${height},top=${top},left=${left}`
      );
      
      // Check for connection every 2 seconds
      const interval = setInterval(async () => {
        const connected = await checkGoogleCalendarConnection();
        if (connected) {
          clearInterval(interval);
          setIsConnected(true);
          toast.success("Google Calendar connected successfully!");
          // Enable Google Calendar integration if connection successful
          if (!useGoogleCalendar) {
            toggleGoogleCalendar();
          }
        }
      }, 2000);
      
      // Stop checking after 2 minutes
      setTimeout(() => clearInterval(interval), 120000);
    }
  };

  // If the user isn't a super admin, don't show the component
  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 w-full lg:w-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-gray-500" />
            <Label htmlFor="google-calendar-toggle" className="text-sm font-medium">
              Google Calendar
            </Label>
          </div>
          <Switch
            id="google-calendar-toggle"
            checked={useGoogleCalendar}
            onCheckedChange={toggleGoogleCalendar}
            disabled={!isConnected || isChecking}
          />
        </div>
        
        {!isConnected && !isChecking && (
          <Button 
            onClick={handleConnect} 
            variant="outline" 
            size="sm" 
            className="w-full text-xs bg-white dark:bg-gray-800"
          >
            Connect Google Calendar
          </Button>
        )}
        
        {isConnected && (
          <div className="mt-2">
            <Label className="text-xs text-green-600 dark:text-green-400">
              Connected to Google Calendar
            </Label>
          </div>
        )}
        
        {googleCalendarError && (
          <div className="mt-1 text-xs text-red-500">
            Error: {googleCalendarError}
          </div>
        )}
      </div>
      
      {useGoogleCalendar && (
        <div className="space-y-1">
          <div className="flex justify-between mb-1">
            <Label htmlFor="days-ahead-slider" className="text-xs">
              Days ahead: {daysAhead}
            </Label>
          </div>
          <Slider
            id="days-ahead-slider"
            defaultValue={[daysAhead]}
            max={365}
            min={7}
            step={7}
            onValueChange={(vals) => onDaysAheadChange(vals[0])}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
