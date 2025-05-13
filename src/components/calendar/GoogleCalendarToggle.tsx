
import React, { useState, useEffect } from "react";
import { CalendarRange } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  disconnectGoogleCalendar, 
  startGoogleOAuth, 
  checkGoogleCalendarConnection,
  syncEventsWithGoogleCalendar
} from "@/services/googleCalendar";
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
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const { isSuperAdmin, isAdminRole } = usePermissions();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isSuperAdmin || isAdminRole;

  const checkConnection = async () => {
    if (!isAuthenticated || !user) {
      setIsChecking(false);
      setIsConnected(false);
      return;
    }
    
    setIsChecking(true);
    try {
      const connected = await checkGoogleCalendarConnection();
      setIsConnected(connected);
      
      // Auto-enable Google Calendar if connected
      if (connected && !useGoogleCalendar) {
        toggleGoogleCalendar();
      }
    } catch (error) {
      console.error("Error checking Google Calendar connection:", error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Only check connection when we have an authenticated user
    if (isAuthenticated && user) {
      checkConnection();
    } else {
      setIsConnected(false);
      setIsChecking(false);
    }
  }, [isAuthenticated, user]);

  const handleConnect = async () => {
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to connect Google Calendar");
      return;
    }

    setIsConnecting(true);
    try {
      console.log("Starting Google auth process...");
      const authUrl = await startGoogleOAuth();
      
      if (!authUrl) {
        toast.error("Failed to start Google authentication");
        return;
      }

      console.log("Got auth URL:", authUrl);
      
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

      console.log("Opened popup window for authentication");
      
      // Check for connection every 2 seconds
      const interval = setInterval(async () => {
        try {
          if (popup.closed) {
            clearInterval(interval);
            console.log("Popup closed, checking connection");
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
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to disconnect Google Calendar");
      return;
    }
    
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

  const handleSync = async () => {
    if (!isAuthenticated || !user || !isConnected) {
      return;
    }
    
    setIsSyncing(true);
    try {
      const success = await syncEventsWithGoogleCalendar();
      if (success) {
        toast.success("Calendar synced successfully");
      }
    } catch (error) {
      console.error("Error syncing calendar:", error);
      toast.error("Failed to sync calendar");
    } finally {
      setIsSyncing(false);
    }
  };

  // Only certain users can view/modify the calendar integration
  if (!isAdmin && !isSuperAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 w-full lg:w-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-gray-500" />
            <Label className="text-sm font-medium">
              Google Calendar Integration
            </Label>
          </div>
        </div>
        
        {!isAuthenticated || !user ? (
          <div className="text-xs text-amber-500">Please log in to use Google Calendar integration</div>
        ) : isChecking ? (
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
                <div className="mt-2 space-y-2">
                  <Label className="text-xs text-green-600 dark:text-green-400 block">
                    Connected to Google Calendar
                  </Label>
                  
                  <Button 
                    onClick={handleSync} 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs bg-white dark:bg-gray-800"
                    disabled={isSyncing}
                  >
                    {isSyncing ? "Syncing..." : "Sync Calendar Now"}
                  </Button>
                  
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
      
      {isConnected && (
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
