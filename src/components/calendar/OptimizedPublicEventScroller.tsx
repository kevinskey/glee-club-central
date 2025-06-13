
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Event } from '@/types/common';
import { format } from 'date-fns';

interface OptimizedPublicEventScrollerProps {
  events: Event[];
  className?: string;
}

export function OptimizedPublicEventScroller({ 
  events, 
  className = "" 
}: OptimizedPublicEventScrollerProps) {
  if (!events || events.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            {event.imageUrl && (
              <div className="aspect-video bg-cover bg-center" 
                   style={{ backgroundImage: `url(${event.imageUrl})` }} />
            )}
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{event.title}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
