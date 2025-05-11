
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Music, Users } from "lucide-react";

interface Event {
  id: string;
  date: string;
  title: string;
  type: 'performance' | 'rehearsal' | 'other';
  description?: string;
}

export interface EventTimelineProps {
  events: Event[];
}

export function EventTimeline({ events = [] }: EventTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <Music className="h-4 w-4 text-primary" />;
      case 'rehearsal':
        return <Users className="h-4 w-4 text-amber-500" />;
      default:
        return <Calendar className="h-4 w-4 text-sky-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="flex gap-3">
                <div className="mt-0.5 bg-muted/50 p-1.5 rounded-md">
                  {getEventIcon(event.type)}
                </div>
                <div>
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                  {event.description && (
                    <p className="text-xs mt-1">{event.description}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No upcoming events</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
