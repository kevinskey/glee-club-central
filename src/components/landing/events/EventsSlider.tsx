
import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchUpcomingPerformances, PerformanceEvent } from "@/utils/supabase/calendar";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function EventsSlider() {
  const isMobile = useIsMobile();
  
  // Use React Query to fetch upcoming events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      // Fetch more events for the slider (up to 6)
      return fetchUpcomingPerformances(6);
    }
  });
  
  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-glee-purple"></div>
      </div>
    );
  }

  // If no events, don't show the section
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-glee-purple" />
            <h2 className="text-2xl md:text-3xl font-playfair font-bold">Upcoming Performances</h2>
          </div>
          <Link to="/calendar">
            <Button variant="ghost" className="text-glee-purple hover:text-glee-purple/90">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Carousel
          opts={{ loop: true, align: "center" }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {events.map((event) => (
              <CarouselItem key={event.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Link to={`/calendar?event=${event.id}`} className="h-full">
                  <div className="h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                    <div className={`${isMobile ? 'h-36' : 'h-48'} bg-muted relative`}>
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-glee-purple/20 to-glee-purple/10 flex items-center justify-center">
                          <Calendar className="h-12 w-12 text-glee-purple/40" />
                        </div>
                      )}
                      <div className="absolute bottom-0 w-full p-3 md:p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-lg md:text-xl font-bold text-white">{event.title}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-medium">{event.date}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{event.location}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{event.description}</p>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-5" />
          <CarouselNext className="hidden md:flex -right-5" />
        </Carousel>
      </div>
    </section>
  );
}
