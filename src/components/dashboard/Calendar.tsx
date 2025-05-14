
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  className?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ className }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState([
    { 
      id: "1", 
      title: "Spring Concert", 
      date: new Date(2025, 4, 17), 
      time: "7:00 PM",
      location: "Sisters Chapel",
      type: "concert"
    },
    { 
      id: "2", 
      title: "Rehearsal", 
      date: new Date(2025, 4, 14), 
      time: "5:00 PM",
      location: "Fine Arts Building",
      type: "rehearsal"
    },
    {
      id: "3",
      title: "Soprano Sectional",
      date: new Date(2025, 4, 15),
      time: "4:30 PM",
      location: "Practice Room 2",
      type: "sectional"
    }
  ]);

  // Filter events for the selected date
  const eventsForSelectedDate = date ? events.filter(event => 
    event.date.getFullYear() === date.getFullYear() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getDate() === date.getDate()
  ) : [];

  // Function to get event badge color based on event type
  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case "concert":
        return "bg-orange-500";
      case "rehearsal":
        return "bg-blue-500";
      case "sectional":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Function to render a dot for dates with events
  const renderEventDot = (day: Date) => {
    const hasEvent = events.some(event => 
      event.date.getFullYear() === day.getFullYear() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getDate() === day.getDate()
    );

    return hasEvent ? (
      <div className="h-1 w-1 rounded-full bg-orange-500 absolute bottom-1 left-1/2 transform -translate-x-1/2"></div>
    ) : null;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Calendar</CardTitle>
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              components={{
                Day: ({ day, ...props }) => (
                  <div className="relative">
                    <button {...props}>
                      {day?.getDate()}
                    </button>
                    {day && renderEventDot(day)}
                  </div>
                ),
              }}
            />
          </div>
          <div className="md:col-span-1">
            <div className="rounded-md border p-4 h-full">
              <h3 className="font-medium text-lg mb-3">
                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
              </h3>
              
              {eventsForSelectedDate.length === 0 ? (
                <p className="text-muted-foreground text-sm">No events scheduled for this date</p>
              ) : (
                <div className="space-y-3">
                  {eventsForSelectedDate.map((event) => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {event.time} • {event.location}
                          </p>
                        </div>
                        <div className={`${getEventTypeColor(event.type)} text-xs text-white px-2 py-1 rounded-full`}>
                          {event.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
