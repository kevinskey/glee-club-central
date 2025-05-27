
import React from "react";
import { Button } from "@/components/ui/button";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { RefreshCw, Link, Link2Off, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function GoogleCalendarConnect() {
  const { 
    isConnected, 
    isLoading, 
    isSyncing, 
    error,
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
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        {isConnected ? (
          <>
            <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Connected to Google Calendar
            </div>
            
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
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Link className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Connecting...' : 'Connect Google Calendar'}
          </Button>
        )}
      </div>
    </div>
  );
}
