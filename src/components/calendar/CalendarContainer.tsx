
import React, { memo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isAfter, startOfToday } from "date-fns";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarContainerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  daysWithEvents: Date[];
  loading: boolean;
  events: CalendarEvent[];
}

// Helper function to get upcoming events
const getUpcomingEvents = (events: CalendarEvent[], limit = 3) => {
  const today = startOfToday();
  return events
    .filter(event => isAfter(event.date, today))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, limit);
};

export const CalendarContainer = memo(({
  date,
  setDate,
  daysWithEvents,
  loading,
  events
}: CalendarContainerProps) => {
  const isMobile = useIsMobile();
  
  // Get upcoming events
  const upcomingEvents = getUpcomingEvents(events, isMobile ? 2 : 3);

  if (loading) {
    return (
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm flex justify-center items-center h-[20rem] md:h-[25rem]">
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-glee-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 h-full">
      {/* Calendar */}
      <div className="border rounded-lg p-2 md:p-4 bg-white dark:bg-gray-800 shadow-sm h-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className={isMobile ? "scale-[0.85] w-full mx-auto transform-origin-center" : "mx-auto w-full"}
          modifiers={{
            event: daysWithEvents
          }}
          modifiersStyles={{
            event: {
              fontWeight: 'bold',
              color: 'var(--glee-purple)'
            }
          }}
          styles={{
            day: { fontWeight: 'medium' },
            caption_label: { fontWeight: 'bold', fontSize: '1rem' },
            table: { width: '100%' },
            month: { width: '100%' },
            months: { width: '100%' }
          }}
          classNames={{
            day_selected: "bg-glee-purple text-white hover:bg-glee-purple hover:text-white font-bold",
            day_today: "border border-glee-purple text-glee-purple font-bold"
          }}
        />
      </div>

      {/* Upcoming Events */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader className={isMobile ? "pb-1 pt-3 px-3" : "pb-2"}>
          <CardTitle className={`text-base md:text-lg font-bold ${isMobile ? "mb-0" : ""}`}>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? "p-3 pt-2" : ""}>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events scheduled.</p>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {upcomingEvents.map(event => (
                <div 
                  key={event.id} 
                  className="p-2 md:p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setDate(event.date)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm text-gray-800 dark:text-white">{event.title}</h4>
                    <span className="text-xs font-medium bg-glee-purple/10 text-glee-purple px-2 py-0.5 rounded">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                    <div className="flex items-center gap-1">
                      <span>{format(event.date, 'MMM d')}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[180px] md:max-w-full">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

CalendarContainer.displayName = "CalendarContainer";
