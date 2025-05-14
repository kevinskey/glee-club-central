
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface CalendarSyncButtonProps {
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const CalendarSyncButton: React.FC<CalendarSyncButtonProps> = ({ 
  size = "default",
  variant = "outline"
}) => {
  const [syncing, setSyncing] = useState(false);
  
  const handleSync = async () => {
    try {
      setSyncing(true);
      
      // For now we'll just simulate a sync process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Calendar synchronized successfully");
    } catch (error) {
      console.error("Calendar sync error:", error);
      toast.error("Failed to synchronize calendar");
    } finally {
      setSyncing(false);
    }
  };
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleSync} 
      disabled={syncing}
    >
      {syncing ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <RefreshCw className="h-4 w-4 mr-2" />
      )}
      Sync
    </Button>
  );
};
