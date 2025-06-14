
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <section className={`py-16 pt-20 md:pt-24 bg-background ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join us for our upcoming performances and events
          </p>
        </div>
        
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 mb-8">
          {displayEvents.map((event) => (
            <Card key={event.id} className="flex-shrink-0 w-96 overflow-hidden hover:shadow-lg transition-shadow">
              {event.imageUrl && (
                <div className="aspect-video bg-cover bg-center" 
                     style={{ backgroundImage: `url(${event.imageUrl})` }} />
              )}
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">{event.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
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
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline">
            View All Events
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
