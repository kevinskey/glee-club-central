
import React from "react";
import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export interface PerformanceEventType {
  id: number;
  title: string;
  date: Date;
  location: string;
  description: string;
  image: string;
}

interface PerformanceEventProps {
  event: PerformanceEventType;
  isSelected: boolean;
  onSelect: (event: PerformanceEventType) => void;
}

export function PerformanceEventItem({ 
  event, 
  isSelected, 
  onSelect 
}: PerformanceEventProps) {
  return (
    <div 
      className={`p-3 md:p-4 rounded-lg border transition-all cursor-pointer
        ${isSelected 
          ? 'border-glee-purple bg-glee-purple/5 dark:bg-glee-purple/20' 
          : 'border-gray-200 hover:border-glee-purple/50 hover:bg-glee-purple/5 dark:border-gray-800 dark:hover:border-glee-purple/30'}`}
      onClick={() => onSelect(event)}
    >
      <div className="flex justify-between items-center gap-3">
        <div className="font-medium text-base md:text-lg font-playfair flex items-center min-h-[1.5rem]">{event.title}</div>
        <div className="text-xs sm:text-sm bg-glee-purple/10 text-glee-purple px-3 py-1.5 rounded-full font-medium tracking-wide inline-flex items-center whitespace-nowrap">
          <Calendar className="h-3 w-3 mr-1.5" />
          {format(event.date, 'MMM d, yyyy')}
        </div>
      </div>
      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-3 flex items-center">
        <MapPin className="h-3 w-3 mr-1.5 text-gray-500 dark:text-gray-400" />
        {event.location}
      </div>
    </div>
  );
}

interface PerformanceEventDetailsProps {
  event: PerformanceEventType;
}

export function PerformanceEventDetails({ event }: PerformanceEventDetailsProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md">
      <div className="aspect-video relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-opacity duration-300"
          key={event.id} // Force re-render when image changes
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-5 md:p-7">
          <div className="inline-block px-4 py-1.5 bg-glee-purple text-white text-xs uppercase tracking-wider font-bold rounded-full mb-3 md:mb-4">
            Featured Event
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-playfair font-bold text-white mb-2 md:mb-3 flex items-center min-h-[2.5rem]">
            {event.title}
          </h3>
          <div className="text-white/90 flex items-center gap-3 mt-2 md:mt-3">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full">
              <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="text-sm md:text-base font-medium">{format(event.date, 'MMMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 md:p-7">
        <div className="font-medium text-base md:text-lg flex items-center gap-2 text-gray-800 dark:text-white mb-3 md:mb-4">
          <MapPin className="h-4 w-4 text-glee-purple" />
          {event.location}
        </div>
        <p className="mt-2 mb-5 md:mb-6 text-sm md:text-base text-gray-600 dark:text-gray-300">
          {event.description}
        </p>
        <div className="mt-4 md:mt-6 flex gap-3">
          <Button 
            variant="default" 
            className="bg-glee-purple hover:bg-glee-purple/90 text-white"
            size={isMobile ? "default" : "lg"}
          >
            Get Tickets
          </Button>
          <Button 
            variant="outline" 
            className="border-glee-purple text-glee-purple hover:bg-glee-purple/10"
            size={isMobile ? "default" : "lg"}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
