
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Calendar, MapPin } from 'lucide-react';
import { useIsPad } from '@/hooks/useIsPad';
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
  const isPad = useIsPad();

  return (
    <section className={`py-12 pt-16 md:pt-20 bg-background ${className}`}>
      <div className="mx-auto w-full max-w-[1800px] px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        </div>
        
        <Carousel
          opts={{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }}
          className="w-full"
          showArrows={!isPad}
        >
          <CarouselContent className="-ml-4">
            {displayEvents.map((event) => (
              <CarouselItem
                key={event.id}
                className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 touch-manipulation"
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <img
                      src="/placeholder.svg"
                      alt={`Placeholder for ${event.title}`}
                      className="aspect-video w-full object-cover bg-muted"
                    />
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        {isPad && displayEvents.length > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Swipe left or right to browse events
          </p>
        )}
      </div>
    </section>
  );
}
