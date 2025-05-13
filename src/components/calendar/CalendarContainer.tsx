
import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { CalendarEvent } from "@/types/calendar";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarContainerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  daysWithEvents: Date[];
  loading?: boolean;
  events: CalendarEvent[];
}

export const CalendarContainer = ({
  date,
  setDate,
  daysWithEvents,
  loading,
  events
}: CalendarContainerProps) => {
  const isMobile = useIsMobile();
  
  // Custom day component rendering to show event indicators
  const renderDay = (day: Date) => {
    // Check if day has events
    const hasEvents = events.some(event => 
      isSameDay(new Date(event.start), day)
    );
    
    // Count events on this day
    const eventCount = events.filter(event => 
      isSameDay(new Date(event.start), day)
    ).length;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div>{format(day, "d")}</div>
        
        {/* Event Indicators */}
        {hasEvents && (
          <div className="absolute bottom-0.5 flex justify-center gap-0.5 w-full">
            {eventCount > 2 ? (
              <span className="h-1.5 w-1.5 rounded-full bg-glee-purple"></span>
            ) : (
              Array.from({ length: Math.min(eventCount, 2) }).map((_, i) => (
                <span key={i} className="h-1 w-1 rounded-full bg-glee-purple"></span>
              ))
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card className="p-0 overflow-hidden bg-white dark:bg-gray-800 border shadow-sm">
      <div className={`p-2 ${isMobile ? 'p-1' : 'p-2 sm:p-4'}`}>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-purple"></div>
          </div>
        ) : (
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md bg-white dark:bg-gray-800"
            components={{
              Day: ({ date: dayDate, ...props }) => (
                <button {...props}>
                  {dayDate && renderDay(dayDate)}
                </button>
              )
            }}
          />
        )}
      </div>
    </Card>
  );
};
