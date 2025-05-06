
import React from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      className={`p-4 rounded-lg border transition-all cursor-pointer
        ${isSelected 
          ? 'border-glee-purple bg-glee-purple/5 dark:bg-glee-purple/20' 
          : 'border-gray-200 hover:border-glee-purple/50 hover:bg-glee-purple/5 dark:border-gray-800 dark:hover:border-glee-purple/30'}`}
      onClick={() => onSelect(event)}
    >
      <div className="flex justify-between items-center">
        <div className="font-medium text-lg">{event.title}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {format(event.date, 'MMMM d, yyyy')}
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{event.location}</div>
    </div>
  );
}

interface PerformanceEventDetailsProps {
  event: PerformanceEventType;
}

export function PerformanceEventDetails({ event }: PerformanceEventDetailsProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md">
      <div className="aspect-video relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-opacity duration-300"
          key={event.id} // Force re-render when image changes
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-2xl font-playfair font-bold text-white">
            {event.title}
          </h3>
          <div className="text-white/90 flex items-center gap-2 mt-2">
            <Calendar className="h-4 w-4" />
            <span>{format(event.date, 'MMMM d, yyyy')}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="font-medium text-lg">Location: {event.location}</div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {event.description}
        </p>
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="border-glee-purple text-glee-purple hover:bg-glee-purple/10"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
