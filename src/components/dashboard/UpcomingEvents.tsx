
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Event {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  type: string;
  image?: string;
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
            {upcomingEvents.slice(0, 5).map((event) => (
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
                    event.type === "other" && "bg-gray-500 text-white"
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
