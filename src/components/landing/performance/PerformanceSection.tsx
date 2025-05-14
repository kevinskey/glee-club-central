
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchPerformanceEvents } from "@/utils/performanceSync";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

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

  return (
    <section id="performances" className="py-0 relative overflow-hidden min-h-[220px] sm:min-h-[240px] md:min-h-[280px] lg:min-h-[320px] xl:min-h-[360px] flex items-center bg-glee-spelman">
      <div className="container mx-auto px-0 md:px-4 w-full relative z-10">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-white/80">No upcoming performances scheduled at this time.</p>
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
                <CarouselItem key={event.id} className="pl-0 md:pl-0 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <Card className="overflow-hidden h-full border-none bg-transparent">
                      <div className="relative h-48 sm:h-56 md:h-64 bg-muted w-full">
                        {!imageErrors[event.id] ? (
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={() => handleImageError(event.id)}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-glee-purple/30"></div>
                        )}
                      </div>
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
    </section>
  );
}
