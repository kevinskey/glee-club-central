
import React from "react";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";
import { format, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

interface MobileOptimizedEventsSectionProps {
  maxEvents?: number;
  showHeader?: boolean;
  className?: string;
}

export function MobileOptimizedEventsSection({ 
  maxEvents = 4, 
  showHeader = true,
  className = ""
}: MobileOptimizedEventsSectionProps) {
  const { events, loading, error } = useCalendarEvents();

  // Filter and sort upcoming public events
  const now = new Date();
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.start_time);
      return isAfter(eventDate, now) && event.is_public;
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, maxEvents);

  if (loading) {
    return (
      <section className={cn("py-8 md:py-12", className)}>
        <div className="container mx-auto px-4">
          {showHeader && (
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">Upcoming Events</h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Join us for our upcoming performances
              </p>
            </div>
          )}
          <div className="grid gap-4 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 md:h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn("py-8 md:py-12", className)}>
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600 py-8">
            <p className="text-sm md:text-base">Unable to load events at this time</p>
          </div>
        </div>
      </section>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <section className={cn("py-8 md:py-12", className)}>
        <div className="container mx-auto px-4">
          {showHeader && (
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">Upcoming Events</h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Join us for our upcoming performances
              </p>
            </div>
          )}
          <div className="text-center py-8">
            <CalendarDays className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm md:text-base text-muted-foreground">
              No upcoming events scheduled at this time
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-8 md:py-12", className)}>
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">Upcoming Events</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Join us for our upcoming performances and community events
            </p>
          </div>
        )}
        
        <div className="grid gap-4 md:gap-6 max-w-4xl mx-auto">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Date Block */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-xl flex flex-col items-center justify-center text-primary">
                      <span className="text-xs md:text-sm font-medium">
                        {format(new Date(event.start_time), 'MMM')}
                      </span>
                      <span className="text-lg md:text-xl font-bold">
                        {format(new Date(event.start_time), 'd')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                        <span>{format(new Date(event.start_time), 'h:mm a')}</span>
                      </div>
                      
                      {event.location_name && (
                        <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{event.location_name}</span>
                        </div>
                      )}
                    </div>
                    
                    {event.short_description && (
                      <p className="text-xs md:text-sm text-muted-foreground mt-2 line-clamp-2">
                        {event.short_description}
                      </p>
                    )}
                  </div>
                  
                  {/* Event Type Badge */}
                  <div className="flex-shrink-0">
                    <div className="flex flex-col items-end gap-2">
                      {event.event_type && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {event.event_type}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {upcomingEvents.length >= maxEvents && (
          <div className="text-center mt-6 md:mt-8">
            <Button variant="outline" size="sm" className="mobile-button">
              View All Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
