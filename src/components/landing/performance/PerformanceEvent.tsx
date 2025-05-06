
import React from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
        <div className="font-medium text-base md:text-lg">{event.title}</div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {format(event.date, 'MMMM d, yyyy')}
        </div>
      </div>
      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1">{event.location}</div>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 md:p-6">
          <h3 className="text-xl md:text-2xl font-playfair font-bold text-white">
            {event.title}
          </h3>
          <div className="text-white/90 flex items-center gap-2 mt-2">
            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-sm md:text-base">{format(event.date, 'MMMM d, yyyy')}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="font-medium text-base md:text-lg">Location: {event.location}</div>
        <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
          {event.description}
        </p>
        <div className="mt-4">
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
