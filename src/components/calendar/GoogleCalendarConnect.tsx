
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link2Off, Calendar, RefreshCw } from "lucide-react";
import { 
  isConnectedToGoogle, 
  startGoogleAuth, 
  disconnectGoogleCalendar, 
  syncWithGoogleCalendar 
} from "@/services/googleCalendar";

export function GoogleCalendarConnect() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkConnection = async () => {
    try {
      const connected = await isConnectedToGoogle();
      setIsConnected(connected);
    } catch (error) {
      console.error("Error checking Google connection:", error);
    }
  };

  // Check connection status on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await startGoogleAuth();
      // The connection status will be updated when the user completes the OAuth flow
      // We can't immediately check the status here since OAuth happens in a separate window
    } catch (error) {
      console.error("Error connecting to Google Calendar:", error);
      toast.error("Failed to connect to Google Calendar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const success = await disconnectGoogleCalendar();
      if (success) {
        setIsConnected(false);
        toast.success("Successfully disconnected from Google Calendar");
      }
    } catch (error) {
      console.error("Error disconnecting from Google Calendar:", error);
      toast.error("Failed to disconnect from Google Calendar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await syncWithGoogleCalendar();
    } catch (error) {
      console.error("Error syncing with Google Calendar:", error);
      toast.error("Failed to sync with Google Calendar");
    } finally {
      setIsLoading(false);
      // Refresh connection status after sync attempt
      checkConnection();
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-base">Google Calendar</h3>
      <div className="flex flex-col gap-2">
        {isConnected ? (
          <>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDisconnect}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <Link2Off className="h-4 w-4" />
                Disconnect
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSync}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Sync Now
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Connect Google Calendar
          </Button>
        )}
      </div>
    </div>
  );
}
