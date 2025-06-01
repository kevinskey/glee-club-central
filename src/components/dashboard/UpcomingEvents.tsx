
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, MapPin, Clock } from "lucide-react";
import { format, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

interface UpcomingEventsProps {
  className?: string;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ className }) => {
  const { events, loading } = useCalendarEvents();
  
  // Filter and sort upcoming events
  const now = new Date();
  const upcomingEvents = events
    .filter(event => isAfter(new Date(event.start_time), now))
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5)
    .map(event => ({
      id: event.id,
      title: event.title,
      date: new Date(event.start_time),
      time: format(new Date(event.start_time), 'h:mm a'),
      location: event.location_name,
      type: event.event_type || 'event',
      image: event.image_url
    }));
  
  if (loading) {
    return (
      <Card className={cn("w-full overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Upcoming Events</CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Upcoming Events</CardTitle>
        <CalendarClock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0">
        {upcomingEvents.length === 0 ? (
          <div className="p-4">
            <p className="text-muted-foreground text-sm">No upcoming events</p>
          </div>
        ) : (
          <div>
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="relative overflow-hidden border-t first:border-t-0 border-gray-200 dark:border-gray-800"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-15"
                  style={{ backgroundImage: event.image ? `url(${event.image})` : 'none' }}
                />
                
                <div className="relative flex items-center p-4 space-x-4 z-10 hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                    <span className="text-xs font-medium">{format(event.date, "MMM")}</span>
                    <span className="text-lg font-bold">{format(event.date, "dd")}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{event.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {event.time && (
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                          {event.time}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    event.type === "concert" && "bg-orange-500 text-white",
                    event.type === "rehearsal" && "bg-blue-500 text-white",
                    event.type === "sectional" && "bg-green-500 text-white",
                    event.type === "special" && "bg-amber-500 text-white",
                    event.type === "tour" && "bg-red-500 text-white",
                    (!event.type || event.type === "event") && "bg-gray-500 text-white"
                  )}>
                    {event.type}
                  </div>
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
