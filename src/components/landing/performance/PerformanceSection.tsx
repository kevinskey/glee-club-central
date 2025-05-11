
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { CalendarPlus, ArrowRight } from "lucide-react";
import { fetchUpcomingPerformances } from "@/utils/supabase/calendar";
import { toast } from "sonner";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface PerformanceEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  type?: string;
}

export function PerformanceSection() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [events, setEvents] = useState<PerformanceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Get the authenticated user
  const { isAuthenticated, profile } = useAuth();
  
  // Fetch upcoming performance events from the calendar
  useEffect(() => {
    const getPerformances = async () => {
      try {
        setLoading(true);
        const performances = await fetchUpcomingPerformances(6);
        setEvents(performances);
      } catch (err) {
        console.error("Error in fetchUpcomingPerformances:", err);
        toast.error("Failed to load upcoming performances");
      } finally {
        setLoading(false);
      }
    };
    
    getPerformances();
  }, []);
  
  const handleImageError = (eventId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [eventId]: true
    }));
  };

  return (
    <section id="performances" className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Upcoming Performances</h2>
          
          {isAuthenticated && profile?.role === 'admin' ? (
            <Link to="/calendar">
              <Button size="sm" variant="outline">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </Link>
          ) : (
            <Link to="/calendar">
              <Button size="sm" variant="outline" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-purple"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No upcoming performances scheduled at this time.</p>
            <p className="mt-2 text-gray-500">Check back soon for our upcoming events!</p>
          </div>
        ) : (
          <Carousel 
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {events.map(event => (
                <CarouselItem key={event.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden h-full">
                      <div className="relative h-40 bg-muted">
                        {!imageErrors[event.id] ? (
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={() => handleImageError(event.id)}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <p className="text-muted-foreground text-sm">{event.title} - Image unavailable</p>
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription className="text-xs">{event.date} | {event.location}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <ScrollArea className="h-20 mb-4">
                          <p className="text-sm">{event.description}</p>
                        </ScrollArea>
                        <Link to={`/calendar?event=${event.id}`}>
                          <Button variant="outline" size="sm" className="w-full">View Details</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="-left-12 bg-background border-accent" />
              <CarouselNext className="-right-12 bg-background border-accent" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
}
