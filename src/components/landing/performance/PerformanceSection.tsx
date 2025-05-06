
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceEventItem, PerformanceEventDetails, PerformanceEventType } from "./PerformanceEvent";

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
  const [selectedEvent, setSelectedEvent] = useState<PerformanceEventType>(performanceEvents[0]);
  
  // Handle event selection with a more explicit function
  const handleEventSelect = (event: PerformanceEventType) => {
    console.log("Selected event:", event.title);
    setSelectedEvent(event);
  };
  
  return (
    <section className="py-20 bg-gradient-to-b from-white to-glee-light dark:from-glee-dark dark:to-black">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6 flex items-center justify-center gap-2">
            <Calendar className="h-8 w-8 text-glee-purple" />
            <span>Upcoming <span className="text-glee-purple">Performances</span></span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join us for our upcoming performances and experience the musical excellence 
            of the Spelman College Glee Club.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left column - Calendar of events */}
          <div className="space-y-4">
            <h3 className="text-2xl font-playfair font-semibold mb-6">Performance Calendar</h3>
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
            <div className="mt-6">
              <Button 
                onClick={() => navigate("/dashboard/schedule")}
                className="bg-glee-purple hover:bg-glee-purple/90 text-white"
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
