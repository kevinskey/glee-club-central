
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { format, isAfter } from "date-fns";

interface PublicEventScrollerProps {
  title?: string;
  showViewAllButton?: boolean;
  limit?: number;
  className?: string;
}

export function PublicEventScroller({
  title = "Upcoming Events",
  showViewAllButton = true,
  limit = 6,
  className = ""
}: PublicEventScrollerProps) {
  const navigate = useNavigate();
  const { events, loading, error } = useCalendarEvents();

  // Filter for public events only and upcoming dates
  const publicEvents = events
    .filter(event => {
      const eventDate = new Date(event.start_time);
      return event.is_public && isAfter(eventDate, new Date());
    })
    .slice(0, limit);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  const handleViewAllClick = () => {
    navigate('/calendar');
  };

  if (loading) {
    return (
      <section className={`py-8 sm:py-12 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-spelman mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-8 sm:py-12 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p>Unable to load events at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  if (publicEvents.length === 0) {
    return (
      <section className={`py-8 sm:py-12 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-playfair font-bold mb-4">{title}</h2>
            <p className="text-muted-foreground">No upcoming public events at this time.</p>
            {showViewAllButton && (
              <Button 
                onClick={handleViewAllClick}
                variant="outline" 
                className="mt-4"
              >
                View Full Calendar
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-8 sm:py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-playfair font-bold">{title}</h2>
          {showViewAllButton && (
            <Button
              onClick={handleViewAllClick}
              variant="ghost"
              className="text-glee-spelman hover:text-glee-spelman/80 font-medium transition-colors self-start sm:self-auto"
            >
              View Full Calendar →
            </Button>
          )}
        </div>

        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {publicEvents.map((event) => (
              <CarouselItem key={event.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-gradient-to-br from-glee-spelman/20 to-glee-purple/20">
                      {event.feature_image_url ? (
                        <img
                          src={event.feature_image_url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="h-12 w-12 text-glee-spelman/60" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-playfair font-semibold text-lg mb-2 line-clamp-2 group-hover:text-glee-spelman transition-colors">
                        {event.title}
                      </h3>
                      
                      {event.event_type && (
                        <span className="inline-block px-2 py-1 text-xs bg-glee-spelman/10 text-glee-spelman rounded-full mb-2">
                          {event.event_type}
                        </span>
                      )}
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>{formatEventDate(event.start_time)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>{formatEventTime(event.start_time)}</span>
                        </div>
                        
                        {event.location_name && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="line-clamp-1">{event.location_name}</span>
                          </div>
                        )}
                      </div>
                      
                      {event.short_description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {event.short_description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-4" />
          <CarouselNext className="hidden sm:flex -right-4" />
        </Carousel>
      </div>
    </section>
  );
}
