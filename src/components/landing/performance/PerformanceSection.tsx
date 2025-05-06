
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceEventItem, PerformanceEventDetails, PerformanceEventType } from "./PerformanceEvent";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { format } from "date-fns";

// Sample performance events data
const performanceEvents: PerformanceEventType[] = [
  {
    id: 1,
    title: "Fall Showcase",
    date: new Date(2025, 5, 15), // June 15, 2025
    location: "Sisters Chapel",
    description: "Our annual showcase featuring classical and contemporary pieces.",
    image: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
  },
  {
    id: 2,
    title: "Holiday Concert",
    date: new Date(2025, 11, 10), // December 10, 2025
    location: "Atlanta Symphony Hall",
    description: "Celebrating the season with festive music and traditional carols.",
    image: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
  },
  {
    id: 3,
    title: "Spring Tour",
    date: new Date(2026, 2, 5), // March 5, 2026
    location: "Various Venues",
    description: "Our annual tour across the southeastern United States.",
    image: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
  },
  {
    id: 4,
    title: "Commencement Performance",
    date: new Date(2026, 4, 20), // May 20, 2026
    location: "Spelman College Oval",
    description: "Special performance for the graduating class of 2026.",
    image: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
  }
];

export function PerformanceSection() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedEvent, setSelectedEvent] = useState<PerformanceEventType>(performanceEvents[0]);
  
  // Handle event selection with a more explicit function
  const handleEventSelect = (event: PerformanceEventType) => {
    console.log("Selected event:", event.title);
    setSelectedEvent(event);
  };
  
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-white to-glee-light dark:from-glee-dark dark:to-black">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold mb-4 md:mb-6 flex items-center justify-center gap-2">
            <Calendar className="h-6 w-6 md:h-8 md:w-8 text-glee-purple" />
            <span>Upcoming <span className="text-glee-purple">Performances</span></span>
          </h2>
          
          {/* Performance Carousel */}
          <div className="relative mt-6 px-4 md:px-10">
            <Carousel
              opts={{ loop: true }}
              className="w-full max-w-3xl mx-auto"
            >
              <CarouselContent>
                {performanceEvents.map((event) => (
                  <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
                      <div 
                        className="relative rounded-lg overflow-hidden aspect-[4/3] cursor-pointer hover:opacity-95 transition-opacity group"
                        onClick={() => handleEventSelect(event)}
                      >
                        <img 
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col justify-end p-4">
                          <h3 className="text-white font-bold text-lg group-hover:text-glee-purple transition-colors">
                            {event.title}
                          </h3>
                          <div className="text-white/80 text-sm">
                            <span>{format(event.date, 'MMMM d, yyyy')}</span>
                            <span className="mx-1">•</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </div>
            </Carousel>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Left column - Calendar of events */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-playfair font-semibold mb-4 md:mb-6">Performance Calendar</h3>
            <div className="space-y-2">
              {performanceEvents.map((event) => (
                <PerformanceEventItem 
                  key={event.id} 
                  event={event} 
                  isSelected={selectedEvent.id === event.id}
                  onSelect={handleEventSelect}
                />
              ))}
            </div>
            <div className="mt-4 md:mt-6">
              <Button 
                onClick={() => navigate("/dashboard/schedule")}
                className="bg-glee-purple hover:bg-glee-purple/90 text-white"
                size={isMobile ? "default" : "lg"}
              >
                View Full Schedule
              </Button>
            </div>
          </div>
          
          {/* Right column - Selected event image and details */}
          <div className="mt-8 md:mt-0">
            <PerformanceEventDetails event={selectedEvent} />
          </div>
        </div>
      </div>
    </section>
  );
}
