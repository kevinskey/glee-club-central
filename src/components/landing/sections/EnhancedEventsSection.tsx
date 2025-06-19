
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { Event } from '@/types/common';
import { format } from 'date-fns';

interface EnhancedEventsSectionProps {
  events: Event[];
  title?: string;
  className?: string;
}

export function EnhancedEventsSection({ 
  events, 
  title = "Upcoming Events",
  className = "" 
}: EnhancedEventsSectionProps) {
  if (!events || events.length === 0) {
    return null;
  }

  const displayEvents = events.slice(0, 6);

  return (
    <section className={`py-12 pt-16 md:pt-20 bg-background ${className}`}>
      <div className="mx-auto w-full max-w-[1800px] px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {event.imageUrl && (
                <div className="aspect-video bg-cover bg-center"
                     style={{ backgroundImage: `url(${event.imageUrl})` }} />
              )}
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">{event.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
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
    </section>
  );
}
