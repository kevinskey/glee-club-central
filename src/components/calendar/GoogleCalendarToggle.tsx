
import React, { useState, useEffect } from "react";
import { CalendarRange } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { disconnectGoogleCalendar, startGoogleOAuth, checkGoogleCalendarConnection } from "@/utils/googleCalendar";
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
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const { isSuperAdmin } = usePermissions();
  const { isAuthenticated } = useAuth();

  const checkConnection = async () => {
    if (!isAuthenticated) {
      setIsChecking(false);
      return;
    }
    
    setIsChecking(true);
    try {
      const connected = await checkGoogleCalendarConnection();
      setIsConnected(connected);
      console.info("Google Calendar connection status:", connected);
    } catch (error) {
      console.error("Error checking Google Calendar connection:", error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkConnection();
    } else {
      setIsConnected(false);
      setIsChecking(false);
    }
  }, [isAuthenticated]);

  const handleConnect = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to connect Google Calendar");
      return;
    }

    setIsConnecting(true);
    try {
      const authUrl = await startGoogleOAuth();
      if (!authUrl) {
        toast.error("Failed to start Google authentication");
        return;
      }

      // Open the OAuth URL in a popup window
      const width = 600;
      const height = 700;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const popup = window.open(
        authUrl,
        "Google Calendar Authorization",
        `width=${width},height=${height},top=${top},left=${left}`
      );
      
      if (!popup) {
        toast.error("Popup was blocked. Please allow popups for this site.");
        return;
      }
      
      // Check for connection every 2 seconds
      const interval = setInterval(async () => {
        try {
          if (popup.closed) {
            clearInterval(interval);
            await checkConnection();
            if (isConnected) {
              toast.success("Google Calendar connected successfully!");
            }
          }
        } catch (e) {
          console.error("Error in popup check interval:", e);
        }
      }, 2000);
      
      // Stop checking after 2 minutes
      setTimeout(() => {
        clearInterval(interval);
        if (popup && !popup.closed) {
          popup.close();
        }
      }, 120000);
    } catch (error) {
      console.error("Error connecting to Google Calendar:", error);
      toast.error("Failed to connect to Google Calendar");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const success = await disconnectGoogleCalendar();
      if (success) {
        toast.success("Google Calendar disconnected");
        setIsConnected(false);
        if (useGoogleCalendar) {
          toggleGoogleCalendar();
        }
      } else {
        toast.error("Failed to disconnect Google Calendar");
      }
    } catch (error) {
      console.error("Error disconnecting Google Calendar:", error);
      toast.error("Failed to disconnect Google Calendar");
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
        
        {isChecking ? (
          <div className="text-xs text-gray-500">Checking connection...</div>
        ) : (
          <>
            {!isConnected ? (
              <Button 
                onClick={handleConnect} 
                variant="outline" 
                size="sm" 
                className="w-full text-xs bg-white dark:bg-gray-800"
                disabled={isConnecting || !isAuthenticated}
              >
                {isConnecting ? "Connecting..." : "Connect Google Calendar"}
              </Button>
            ) : (
              <>
                <div className="mt-2">
                  <Label className="text-xs text-green-600 dark:text-green-400 mb-2 block">
                    Connected to Google Calendar
                  </Label>
                  <Button 
                    onClick={handleDisconnect} 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs bg-white dark:bg-gray-800 text-red-500 border-red-200"
                  >
                    Disconnect
                  </Button>
                </div>
              </>
            )}
          </>
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
