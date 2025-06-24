
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Music, Users } from "lucide-react";
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

interface Event {
  id: string;
  date: string;
  title: string;
  type: "performance" | "rehearsal" | "other";
  description?: string;
}

interface EventTimelineProps {
  events?: Event[];
}

export function EventTimeline({ events: propEvents }: EventTimelineProps) {
  const { events: calendarEvents, loading } = useCalendarEvents();

  const getEventIcon = (type: string) => {
    switch (type) {
      case "performance":
        return <Music className="h-5 w-5 text-purple-500" />;
      case "rehearsal":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      default:
        return <Users className="h-5 w-5 text-amber-500" />;
    }
  };

  // Use prop events if provided, otherwise use calendar events
  const displayEvents = propEvents || calendarEvents
    .filter(event => new Date(event.start_time) > new Date())
    .slice(0, 5)
    .map(event => ({
      id: event.id,
      date: new Date(event.start_time).toLocaleDateString(),
      title: event.title,
      type: (event.event_types?.[0] === 'concert' ? 'performance' : 
             event.event_types?.[0] === 'rehearsal' ? 'rehearsal' : 'other') as "performance" | "rehearsal" | "other",
      description: event.short_description
    }));

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        {displayEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="mx-auto h-10 w-10 mb-2 opacity-30" />
            <p>No upcoming events</p>
          </div>
        ) : (
          <div className="relative ml-3 space-y-4">
            {/* Timeline line */}
            <div className="absolute inset-y-0 left-0 ml-[7px] w-[1px] bg-border" />

            {displayEvents.map((event, i) => (
              <div key={event.id} className="relative pl-8">
                {/* Timeline dot */}
                <span className="absolute left-0 flex h-4 w-4 items-center justify-center rounded-full border bg-background">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getEventIcon(event.type)}
                    <h4 className="font-medium">{event.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                  {event.description && (
                    <p className="text-sm">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
