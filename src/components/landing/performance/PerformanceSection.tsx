
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  // Get the authenticated user
  const { isAuthenticated, profile } = useAuth();
  
  // Fetch upcoming performance events from the calendar
  useEffect(() => {
    const getPerformances = async () => {
      try {
        setLoading(true);
        const performances = await fetchUpcomingPerformances(10);
        // Sort events chronologically by date
        const sortedEvents = [...performances].sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setEvents(sortedEvents);
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

  // Skip rendering if we have no events or we're still loading
  if (loading || events.length === 0) {
    return null;
  }

  return (
    <section id="performances" className="py-8 md:py-12 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold">Featured Performances</h2>
          
          <Link to="/calendar">
            <Button variant="outline" size="sm" className="border-glee-purple text-glee-purple hover:bg-glee-purple/10">
              View Calendar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, isMobile ? 2 : 3).map(event => (
            <Card key={event.id} className="overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-muted">
                {!imageErrors[event.id] ? (
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => handleImageError(event.id)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-glee-purple/20 to-glee-purple/10">
                    <p className="text-muted-foreground text-sm">{event.title}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                  <div className="w-full">
                    <h3 className="font-bold text-white text-lg truncate">{event.title}</h3>
                    <p className="text-white/80 text-xs">{event.date} | {event.location}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 pt-3">
                <ScrollArea className="h-20 mb-4">
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </ScrollArea>
                <Link to={`/calendar?event=${event.id}`}>
                  <Button variant="outline" size="sm" className="w-full border-glee-purple text-glee-purple hover:bg-glee-purple/10">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
