
import React from "react";
import { Button } from "@/components/ui/button";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { RefreshCw, Link, Link2Off } from "lucide-react";

export function GoogleCalendarConnect() {
  const { 
    isConnected, 
    isLoading, 
    isSyncing, 
    connectToGoogleCalendar, 
    disconnect, 
    syncCalendar 
  } = useGoogleCalendar();
  
  return (
    <div className="rounded-lg border p-4 space-y-4 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium">Google Calendar</h3>
      
      <p className="text-sm text-muted-foreground">
        Connect with Google Calendar to sync your Glee Club events.
      </p>
      
      <div className="space-y-2">
        {isConnected ? (
          <>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={disconnect}
              disabled={isLoading}
            >
              <Link2Off className="mr-2 h-4 w-4" />
              Disconnect Google Calendar
            </Button>
            
            <Button 
              variant="default" 
              className="w-full"
              onClick={syncCalendar}
              disabled={isLoading || isSyncing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync with Google Calendar'}
            </Button>
          </>
        ) : (
          <Button 
            variant="default" 
            className="w-full"
            onClick={connectToGoogleCalendar}
            disabled={isLoading}
          >
            <Link className="mr-2 h-4 w-4" />
            Connect Google Calendar
          </Button>
        )}
      </div>
      
      {isConnected && (
        <p className="text-sm text-green-500">✓ Connected to Google Calendar</p>
      )}
    </div>
  );
}
