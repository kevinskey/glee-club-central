
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  type: string;
}

interface UpcomingEventsProps {
  events: Event[];
  className?: string;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, className }) => {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Get only upcoming events (today and future)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = sortedEvents.filter(event => event.date >= today);
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Upcoming Events</CardTitle>
        <CalendarClock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {upcomingEvents.length === 0 ? (
          <p className="text-muted-foreground text-sm">No upcoming events</p>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                  <span className="text-xs font-medium">{format(event.date, "MMM")}</span>
                  <span className="text-lg font-bold">{format(event.date, "dd")}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{event.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {event.time && `${event.time} • `}
                    {event.location}
                  </p>
                </div>
                
                <div className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  event.type === "concert" && "bg-orange-500 text-white",
                  event.type === "rehearsal" && "bg-blue-500 text-white",
                  event.type === "sectional" && "bg-green-500 text-white",
                  event.type === "other" && "bg-gray-500 text-white"
                )}>
                  {event.type}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
