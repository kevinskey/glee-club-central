
import React, { useState, useEffect } from "react";
import { fetchPerformanceEvents } from "@/utils/performanceSync";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { CalendarClock, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";

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
  const [events, setEvents] = useState<PerformanceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  
  // Fetch upcoming performance events using our centralized utility
  useEffect(() => {
    const getPerformances = async () => {
      try {
        setLoading(true);
        const performances = await fetchPerformanceEvents(10);
        // Sort events chronologically by date
        const sortedEvents = [...performances].sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setEvents(sortedEvents);
      } catch (err) {
        console.error("Error in fetchPerformanceEvents:", err);
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

  // Format date for display
  const formatEventDate = (dateStr: string) => {
    try {
      return formatDate(new Date(dateStr));
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-glee-spelman py-8">
        <div className="container mx-auto flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="w-full bg-glee-spelman py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Upcoming Performances</h2>
          <p className="text-lg text-white/80">No upcoming performances scheduled at this time.</p>
          <Button 
            variant="outline" 
            className="mt-6 border-white text-white hover:bg-white hover:text-glee-spelman"
            onClick={() => navigate('/calendar')}
          >
            View Calendar
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-black overflow-hidden">
      <div className="py-8 mb-4">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-2">Upcoming Performances</h2>
          <p className="text-lg text-white/80">Join us at our next events</p>
        </div>
      </div>
      
      <div className="relative">
        <Carousel 
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            dragFree: true
          }}
        >
          <CarouselContent className="flex">
            {events.map(event => (
              <CarouselItem key={event.id} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
                <div className="relative h-[400px] rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-xl">
                  {!imageErrors[event.id] && event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={() => handleImageError(event.id)}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-glee-purple/30 flex items-center justify-center">
                      <div className="text-4xl text-white/40 font-bold">SPELMAN GLEE</div>
                    </div>
                  )}
                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                  
                  {/* Event details overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {event.title}
                    </h3>
                    
                    <div className="flex flex-col space-y-1 mb-4">
                      <div className="flex items-center text-white/90">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        <span>{formatEventDate(event.date)}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-white/90">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-glee-orange hover:bg-glee-orange/80 text-white"
                      onClick={() => navigate('/calendar')}
                      size="sm"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="container mx-auto relative">
            <div className="hidden md:block">
              <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/20 text-white" />
              <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/20 text-white" />
            </div>
          </div>
        </Carousel>
      </div>
      
      <div className="container mx-auto px-4 py-8 flex justify-end">
        <Button 
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-black"
          onClick={() => navigate('/calendar')}
        >
          View All Events <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
