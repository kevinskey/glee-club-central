
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Plus } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";

// Sample performance events data
const performanceEvents: PerformanceEventType[] = [
  {
    id: 1,
    title: "Fall Concert 2025",
    date: new Date(2025, 9, 26), // October 26, 2025
    location: "Sisters Chapel",
    description: "Our annual showcase featuring classical and contemporary pieces.",
    image: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
  },
  {
    id: 2,
    title: "A Taste of Christmas",
    date: new Date(2025, 11, 2), // December 2, 2025
    location: "Sisters Chapel",
    description: "Celebrating the season with festive music and traditional carols.",
    image: "/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png"
  },
  {
    id: 3,
    title: "99th Annual Christmas Carol",
    date: new Date(2025, 11, 6), // December 6, 2025
    location: "Sisters Chapel",
    description: "Our annual Christmas celebration with carols and special performances. Running December 6-8, 2025.",
    image: "/lovable-uploads/642b93d7-fc15-4c2c-a7df-fe81aadb2f3b.png"
  },
  {
    id: 4,
    title: "Commencement Performance",
    date: new Date(2026, 4, 20), // May 20, 2026
    location: "Sisters Chapel",
    description: "Special performance for the graduating class of 2026.",
    image: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
  }
];

export function PerformanceSection() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedEvent, setSelectedEvent] = useState<PerformanceEventType>(performanceEvents[0]);
  const { user, userProfile } = useAuth();
  
  // Handle event selection with a more explicit function
  const handleEventSelect = (event: PerformanceEventType) => {
    console.log("Selected event:", event.title);
    setSelectedEvent(event);
  };
  
  const handleAddPerformance = () => {
    navigate("/dashboard/schedule");
  };
  
  // Update the role comparison to use "administrator" instead of "admin"
  const isAuthorized = (userProfile?.role === "administrator" || userProfile?.role === "section_leader");
  
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-white to-glee-light dark:from-glee-dark dark:to-black">
      <div className="mb-3 md:mb-4 px-4 md:px-8 mx-auto">
        <div className="flex items-center justify-between mb-2 md:mb-3 container">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-playfair font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 md:h-6 md:w-6 text-glee-purple" />
            <span className="flex items-center min-h-[2rem] md:min-h-[2.5rem]">Upcoming <span className="text-glee-purple">Performances</span></span>
          </h2>
          
          {user && isAuthorized && (
            <Button 
              onClick={handleAddPerformance}
              size="sm"
              className="bg-glee-purple hover:bg-glee-purple/90 text-white h-8 px-3"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Performance
            </Button>
          )}
        </div>
        
        {/* Performance Carousel - Full Width Across Screen */}
        <div className="relative mt-4 w-full">
          <Carousel
            opts={{ 
              loop: true,
              containScroll: "trimSnaps" 
            }}
            className="w-full"
          >
            <CarouselContent>
              {performanceEvents.map((event) => (
                <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3 pl-0">
                  <div className="p-0">
                    <div 
                      className="relative overflow-hidden aspect-[16/9] cursor-pointer hover:opacity-95 transition-opacity group"
                      onClick={() => handleEventSelect(event)}
                      style={{
                        backgroundImage: `url(${event.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-center items-center">
                        <h3 className="font-bold text-white text-xl md:text-2xl lg:text-3xl font-playfair text-center px-4 md:px-6 drop-shadow-lg my-auto flex items-center min-h-[3rem] md:min-h-[3.5rem]">
                          {event.title}
                        </h3>
                        
                        <div className="p-4 md:p-5 bg-black/60 backdrop-blur-sm flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-6 md:px-8 w-full mt-auto">
                          <span className="text-white/80 text-xs md:text-sm order-1">
                            {event.location}
                          </span>
                          <span className="text-glee-purple bg-glee-purple/20 px-2 py-0.5 rounded-full text-xs md:text-sm font-medium order-2 whitespace-nowrap ml-auto">
                            {format(event.date, 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-4 z-10 bg-white/80 hover:bg-white" />
              <CarouselNext className="right-4 z-10 bg-white/80 hover:bg-white" />
            </div>
          </Carousel>
        </div>
      </div>
      
      <div className="container px-4 md:px-8 mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Left column - Calendar of events */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-playfair font-semibold mb-3 md:mb-4 flex items-center min-h-[1.75rem] md:min-h-[2rem]">Performance Calendar</h3>
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
