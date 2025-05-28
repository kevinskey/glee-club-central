
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Calendar {
  id: string;
  name: string;
  primary?: boolean;
}

interface CalendarSelectorProps {
  selectedCalendarId: string;
  onCalendarSelect: (calendarId: string) => void;
  isConnected: boolean;
}

export function CalendarSelector({ selectedCalendarId, onCalendarSelect, isConnected }: CalendarSelectorProps) {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadCalendars();
    }
  }, [isConnected]);

  const loadCalendars = async () => {
    setIsLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        console.error("No valid session");
        return;
      }

      console.log("Loading calendars with action: list_calendars");

      const { data, error } = await supabase.functions.invoke('google-calendar-auth', { 
        body: { action: 'list_calendars' },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error("Error loading calendars:", error);
        return;
      }

      if (data?.calendars) {
        setCalendars(data.calendars);
        
        // If no calendar is selected and we have calendars, select the primary one or first one
        if (!selectedCalendarId && data.calendars.length > 0) {
          const primaryCalendar = data.calendars.find((cal: Calendar) => cal.primary);
          onCalendarSelect(primaryCalendar?.id || data.calendars[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading calendars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Calendar to Sync</label>
      <div className="flex gap-2 items-center">
        <Select
          value={selectedCalendarId}
          onValueChange={onCalendarSelect}
          disabled={isLoading}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a calendar..." />
          </SelectTrigger>
          <SelectContent>
            {calendars.map((calendar) => (
              <SelectItem key={calendar.id} value={calendar.id}>
                {calendar.name} {calendar.primary && "(Primary)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={loadCalendars}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>
    </div>
  );
}
