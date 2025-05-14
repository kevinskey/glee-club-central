
import React, { useState, useEffect } from "react";
import { fetchPerformanceEvents } from "@/utils/performanceSync";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
import { formatDate } from "@/utils/format";

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
      return formatDate(new Date(dateStr), "EEEE, MMMM d, yyyy");
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
    <section className="w-full bg-glee-spelman relative overflow-hidden">
      <div className="relative z-10">
        <Carousel 
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            direction: "ltr",
          }}
        >
          <CarouselContent>
            {events.map(event => (
              <CarouselItem key={event.id} className="pl-0 basis-full">
                <div className="relative w-full">
                  {/* Performance Event Image */}
                  <div className="relative w-full h-[50vh] bg-glee-purple/30 overflow-hidden">
                    {!imageErrors[event.id] && event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => handleImageError(event.id)}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-glee-purple/30 flex items-center justify-center">
                        <div className="text-4xl text-white/40 font-bold">SPELMAN GLEE</div>
                      </div>
                    )}
                    {/* Overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Event content overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
                      <div className="container mx-auto">
                        <div className="flex flex-col max-w-3xl">
                          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                            {event.title}
                          </h2>
                          
                          <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
                            <div className="flex items-center text-white/90">
                              <CalendarClock className="h-5 w-5 mr-2" />
                              <span>{formatEventDate(event.date)}</span>
                            </div>
                            
                            {event.location && (
                              <div className="flex items-center text-white/90">
                                <MapPin className="h-5 w-5 mr-2" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            className="mt-4 sm:self-start bg-glee-gold text-black hover:bg-white"
                            onClick={() => navigate('/calendar')}
                          >
                            View All Events <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="container mx-auto relative">
            <CarouselPrevious className="absolute left-4 md:left-10 bottom-24 bg-white/10 hover:bg-white/20 border-white/20 text-white" />
            <CarouselNext className="absolute right-4 md:right-10 bottom-24 bg-white/10 hover:bg-white/20 border-white/20 text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
