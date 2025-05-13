
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, Link, LinkOff } from "lucide-react";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Google Calendar Integration</h3>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {isConnected
              ? "Your Google Calendar is connected. You can sync events between Glee World and Google Calendar."
              : "Connect your Google Calendar to sync events between Glee World and Google Calendar."}
          </p>

          <div className="flex flex-wrap gap-2">
            {!isConnected ? (
              <Button onClick={connectToGoogleCalendar} size="sm">
                <Link className="mr-2 h-4 w-4" />
                Connect Calendar
              </Button>
            ) : (
              <>
                <Button 
                  onClick={syncCalendar} 
                  disabled={isSyncing} 
                  variant="outline" 
                  size="sm"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </Button>
                <Button 
                  onClick={disconnect} 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 border-red-200 hover:bg-red-50"
                >
                  <LinkOff className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
