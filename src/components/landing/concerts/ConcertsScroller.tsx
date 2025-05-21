
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { getPerformanceEvents } from "@/utils/performanceSync";
import { CalendarEvent } from "@/types/calendar";
import { ResponsiveSection } from "@/components/ui/responsive-section";

export function ConcertsScroller() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const concerts = await getPerformanceEvents(5);
        setEvents(concerts);
      } catch (error) {
        console.error("Error fetching concert events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <ResponsiveSection className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Upcoming Concerts</h2>
        <div className="w-full flex justify-center">
          <div className="w-full max-w-4xl animate-pulse">
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[300px] h-[250px] bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </ResponsiveSection>
    );
  }

  if (events.length === 0) {
    return null; // Don't show section if no events
  }

  return (
    <ResponsiveSection className="py-8 bg-gray-50 dark:bg-gray-900/50">
      <h2 className="text-2xl font-bold mb-6 text-center">Upcoming Concerts</h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: events.length > 3,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {events.map((event) => (
            <CarouselItem 
              key={event.id} 
              className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="bg-background rounded-lg overflow-hidden border border-border h-full flex flex-col">
                {event.image_url ? (
                  <div className="w-full aspect-video overflow-hidden">
                    <img 
                      src={event.image_url} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Concert";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-glee-purple/20 flex items-center justify-center text-glee-purple">
                    <Calendar className="w-10 h-10" />
                  </div>
                )}
                
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
                  
                  <div className="space-y-2 mt-2 mb-4 flex-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(event.start), "MMMM d, yyyy")}
                      {event.allDay ? "" : (typeof event.start === 'string' ? 
                        ` at ${event.start.split('T')[1]?.substring(0, 5) || ''}` : 
                        ` at ${format(event.start, "HH:mm")}`)}
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm" asChild className="mt-auto">
                    <Link to={`/events`}>
                      View Details <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-0 translate-x-0" />
        <CarouselNext className="hidden md:flex right-0 translate-x-0" />
      </Carousel>
      
      <div className="flex justify-center mt-6">
        <Button asChild className="bg-glee-purple hover:bg-glee-purple/90">
          <Link to="/events">
            View All Performances <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </ResponsiveSection>
  );
}
