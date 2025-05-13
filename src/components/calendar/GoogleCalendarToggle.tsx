
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  startGoogleAuth, 
  syncWithGoogleCalendar, 
  isConnectedToGoogle 
} from "@/services/googleCalendar";

interface GoogleCalendarToggleProps {
  connected: boolean;
  syncing: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  onSyncNow: () => Promise<void>;
}

export function GoogleCalendarToggle({
  connected,
  syncing,
  onConnect,
  onDisconnect,
  onSyncNow
}: GoogleCalendarToggleProps) {
  const handleToggle = async (checked: boolean) => {
    if (checked) {
      await onConnect();
    } else {
      await onDisconnect();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Switch
          checked={connected}
          onCheckedChange={handleToggle}
          id="google-calendar-toggle"
        />
        <Label htmlFor="google-calendar-toggle">
          {connected ? "Google Calendar Connected" : "Connect Google Calendar"}
        </Label>
      </div>
      
      {connected && (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onSyncNow} 
          disabled={syncing}
          className="ml-6"
        >
          {syncing ? "Syncing..." : "Sync Now"}
        </Button>
      )}
    </div>
  );
}
