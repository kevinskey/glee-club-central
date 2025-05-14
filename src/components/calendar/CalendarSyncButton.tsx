
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { synchronizePerformances } from "@/utils/performanceSync";
import { useCalendarStore } from "@/hooks/useCalendarStore";

interface CalendarSyncButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function CalendarSyncButton({ className, variant = "outline", size = "sm" }: CalendarSyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const { fetchEvents } = useCalendarStore();

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      
      // Sync calendar events first
      await fetchEvents();
      
      // Then sync performances with calendar events
      await synchronizePerformances();
      
      toast.success("Calendar and performances synced successfully");
    } catch (error) {
      console.error("Error syncing calendar:", error);
      toast.error("Failed to sync calendar data");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleSync} 
      disabled={isSyncing}
      className={className}
    >
      {isSyncing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Syncing...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync Calendar
        </>
      )}
    </Button>
  );
}
