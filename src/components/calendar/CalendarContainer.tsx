
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { isSameDay } from "date-fns";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { useIsMobile } from "@/hooks/use-mobile";

export interface CalendarContainerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  daysWithEvents: Date[];
  loading: boolean;
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void; // Make this prop optional
}

export function CalendarContainer({
  date,
  setDate,
  daysWithEvents,
  loading,
  events,
  onSelectEvent
}: CalendarContainerProps) {
  const isMobile = useIsMobile();
  
  // Check if a day has events to style it differently
  const isDayWithEvent = (day: Date): boolean => {
    return daysWithEvents.some(eventDay => isSameDay(day, eventDay));
  };
  
  return (
    <Card className={`p-3 md:p-4 border shadow-sm bg-white dark:bg-gray-800 ${loading ? "opacity-70" : ""}`}>
      <div className="flex flex-col">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
          modifiers={{
            hasEvent: isDayWithEvent,
          }}
          modifiersStyles={{
            hasEvent: {
              fontWeight: "bold",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              textDecorationColor: "var(--glee-purple)",
              textDecorationThickness: "2px",
            },
          }}
          disabled={loading}
        />
        
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-background/30">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-glee-purple"></div>
          </div>
        )}
      </div>
    </Card>
  );
}
