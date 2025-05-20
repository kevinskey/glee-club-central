
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Music, Users } from 'lucide-react';

interface Event {
  id: string;
  date: string;
  title: string;
  type: 'performance' | 'rehearsal' | 'other';
  description?: string;
}

interface EventTimelineProps {
  events: Event[];
}

export function EventTimeline({ events }: EventTimelineProps) {
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'performance':
        return <Music className="h-5 w-5 text-purple-500" />;
      case 'rehearsal':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      default:
        return <Users className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative ml-3 space-y-4">
          {/* Timeline line */}
          <div className="absolute inset-y-0 left-0 ml-[7px] w-[1px] bg-border" />
          
          {events.map((event, i) => (
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
      </CardContent>
    </Card>
  );
}
