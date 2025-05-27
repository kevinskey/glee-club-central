
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { fetchGoogleCalendars } from "@/services/googleCalendar";

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
      const fetchedCalendars = await fetchGoogleCalendars();
      if (fetchedCalendars) {
        setCalendars(fetchedCalendars);
        
        // If no calendar is selected and we have calendars, select the primary one or first one
        if (!selectedCalendarId && fetchedCalendars.length > 0) {
          const primaryCalendar = fetchedCalendars.find(cal => cal.primary);
          onCalendarSelect(primaryCalendar?.id || fetchedCalendars[0].id);
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
