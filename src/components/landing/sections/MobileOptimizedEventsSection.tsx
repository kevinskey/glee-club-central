
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
      <section className={cn("py-8 md:py-12 pt-6 md:pt-20", className)}>
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
      <section className={cn("py-8 md:py-12 pt-6 md:pt-20", className)}>
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
      <section className={cn("py-8 md:py-12 pt-6 md:pt-20", className)}>
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
    <section className={cn("py-8 md:py-12 pt-6 md:pt-20", className)}>
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">Upcoming Events</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Join us for our upcoming performances and community events
            </p>
          </div>
        )}
        
        {/* Mobile: Horizontal scrolling cards */}
        <div className="block md:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="flex-shrink-0 w-80 snap-start hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  {/* Event Image */}
                  {event.feature_image_url && (
                    <div className="w-full h-32 overflow-hidden rounded-t-lg">
                      <img
                        src={event.feature_image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Event Type Badge */}
                  {event.event_type && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/90 text-primary-foreground rounded-full backdrop-blur-sm">
                        {event.event_type}
                      </span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Date Block */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex flex-col items-center justify-center text-primary text-xs">
                        <span className="font-medium">
                          {format(new Date(event.start_time), 'MMM')}
                        </span>
                        <span className="text-sm font-bold">
                          {format(new Date(event.start_time), 'd')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold mb-2 text-foreground line-clamp-2">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span>{format(new Date(event.start_time), 'h:mm a')}</span>
                        </div>
                        
                        {event.location_name && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{event.location_name}</span>
                          </div>
                        )}
                      </div>
                      
                      {event.short_description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {event.short_description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                {/* Event Image */}
                {event.feature_image_url && (
                  <div className="w-full h-40 overflow-hidden rounded-t-lg">
                    <img
                      src={event.feature_image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Event Type Badge */}
                {event.event_type && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-primary/90 text-primary-foreground rounded-full backdrop-blur-sm">
                      {event.event_type}
                    </span>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Date Block */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex flex-col items-center justify-center text-primary">
                      <span className="text-sm font-medium">
                        {format(new Date(event.start_time), 'MMM')}
                      </span>
                      <span className="text-xl font-bold">
                        {format(new Date(event.start_time), 'd')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{format(new Date(event.start_time), 'h:mm a')}</span>
                      </div>
                      
                      {event.location_name && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{event.location_name}</span>
                        </div>
                      )}
                    </div>
                    
                    {event.short_description && (
                      <p className="text-muted-foreground mt-3 line-clamp-2">
                        {event.short_description}
                      </p>
                    )}
                    
                    <div className="flex justify-end mt-4">
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
