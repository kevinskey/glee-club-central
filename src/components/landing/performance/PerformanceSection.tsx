
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchPerformanceEvents } from "@/utils/performanceSync";

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
  
  // Format date to display day and month
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <section id="performances" className="py-0 relative overflow-hidden min-h-[320px] sm:min-h-[360px] md:min-h-[440px] lg:min-h-[520px] xl:min-h-[550px] flex items-center">
      {/* Stage Curtain Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-glee-spelman z-0">
          {/* Curtain texture effect */}
          <div className="h-full w-full opacity-40" 
               style={{
                 backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 20px)',
                 backgroundSize: '20px 20px'
               }}>
          </div>
          {/* Curtain fold effect */}
          <div className="absolute inset-0 opacity-70"
               style={{
                 backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1) 5%, rgba(0,0,0,0.3) 10%)',
                 backgroundSize: '100px 100%'
               }}>
          </div>
          {/* Top shadow for curtain effect */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 to-transparent"></div>
          {/* Bottom shadow for stage effect */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-0 md:px-4 w-full relative z-10">
        <div className="relative">
          <div className="absolute left-0 top-0 z-10 px-4 md:px-6 py-4 flex items-center justify-between w-full">
            <h2 className="text-2xl font-bold tracking-tight text-white">Upcoming Performances</h2>
            
            <Link to="/dashboard/calendar">
              <Button size="sm" variant="outline" className="bg-white/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/30">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-28">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-28">
              <p className="text-lg text-white/80">No upcoming performances scheduled at this time.</p>
              <p className="mt-2 text-white/60">Check back soon for our upcoming events!</p>
            </div>
          ) : (
            <Carousel 
              className="w-full overflow-hidden"
              opts={{
                align: "start",
                loop: true,
                direction: "ltr",
              }}
            >
              <CarouselContent className="-ml-0 md:-ml-0">
                {events.map(event => (
                  <CarouselItem key={event.id} className="pl-0 md:pl-0 md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden h-full border-none bg-black/40 backdrop-blur-sm text-white">
                        <Link to={`/dashboard/calendar?event=${event.id}`} className="block h-full">
                          <div className="relative h-64 md:h-80 lg:h-96 bg-muted w-full">
                            {!imageErrors[event.id] ? (
                              <img 
                                src={event.image} 
                                alt={event.title} 
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={() => handleImageError(event.id)}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-glee-purple/30">
                                <div className="flex flex-col items-center justify-center">
                                  <Calendar className="h-16 w-16 text-white/70 mb-2" />
                                  <p className="text-white/80 text-lg">Performance Event</p>
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/10 flex flex-col justify-end p-6">
                              <div className="w-full">
                                <h3 className="font-bold text-white text-2xl md:text-3xl leading-tight text-shadow mb-3">{event.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 text-white text-sm md:text-base mb-4">
                                  <span className="bg-glee-purple px-3 py-1 rounded-md font-semibold">
                                    {formatEventDate(event.date)}
                                  </span>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1.5 text-white/80" />
                                    <span>7:00 PM</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1.5 text-white/80" />
                                    <span className="truncate max-w-[150px]">{event.location}</span>
                                  </div>
                                </div>
                                <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden sm:block">
                <CarouselPrevious className="-left-4 md:-left-12 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm" />
                <CarouselNext className="-right-4 md:-right-12 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm" />
              </div>
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}
