
import React, { memo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isAfter, startOfToday } from "date-fns";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";

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
  // Get upcoming events
  const upcomingEvents = getUpcomingEvents(events);

  if (loading) {
    return (
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm flex justify-center items-center h-[25rem]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="mx-auto"
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
            caption_label: { fontWeight: 'bold', fontSize: '1rem' }
          }}
          classNames={{
            day_selected: "bg-glee-purple text-white hover:bg-glee-purple hover:text-white font-bold",
            day_today: "border border-glee-purple text-glee-purple font-bold"
          }}
        />
      </div>

      {/* Upcoming Events */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div 
                  key={event.id} 
                  className="p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
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
                      <span>{format(event.date, 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
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
