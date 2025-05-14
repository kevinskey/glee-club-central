
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchPerformanceEvents } from "@/utils/performanceSync";
import { PerformanceEvent } from "@/types/performance";

export function UpcomingEvents() {
  const [events, setEvents] = useState<PerformanceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const performances = await fetchPerformanceEvents(isMobile ? 2 : 3); // Reduced to 2 on mobile
        setEvents(performances);
      } catch (error) {
        console.error("Error loading upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [isMobile]);

  if (loading) {
    return (
      <div className="w-full py-6 sm:py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-glee-purple"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-glee-purple" />
          <h2 className="text-base sm:text-lg md:text-2xl font-semibold">Upcoming Events</h2>
        </div>
        <Link to="/calendar">
          <Button variant="ghost" size="sm" className="text-glee-purple hover:text-glee-purple/90 text-xs">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <Card className="overflow-hidden border-dashed border-2 bg-muted/30">
          <CardContent className="p-3 sm:p-4 md:p-8 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center mb-3 sm:mb-4">
              <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 md:mb-2">No Upcoming Events</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 md:mb-6 max-w-md">
              Stay tuned! The Spelman College Glee Club will announce their next performances soon.
            </p>
            <Link to="/calendar">
              <Button variant="outline" size="sm" className="border-glee-purple text-glee-purple hover:bg-glee-purple hover:text-white">
                Check Full Calendar
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="h-20 sm:h-24 md:h-36 bg-muted relative">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-glee-purple/20 to-glee-purple/10 flex items-center justify-center">
                    <CalendarIcon className="h-8 w-8 sm:h-10 sm:w-10 text-glee-purple/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 sm:p-3 md:p-4">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white truncate">{event.title}</h3>
                </div>
              </div>
              <CardContent className="p-2 sm:p-3 md:p-4">
                <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                  <div className="flex items-start gap-1.5 sm:gap-2">
                    <CalendarIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-glee-purple mt-0.5 flex-shrink-0" />
                    <span className="font-medium text-xs sm:text-sm md:text-base">{event.date}</span>
                  </div>
                  <div className="flex items-start gap-1.5 sm:gap-2">
                    <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-glee-purple mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-xs sm:text-sm md:text-base">{event.location}</span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  </div>
                  <Link to={`/calendar?event=${event.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-1 md:mt-2 border-glee-purple text-glee-purple hover:bg-glee-purple hover:text-white text-xs sm:text-sm"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
