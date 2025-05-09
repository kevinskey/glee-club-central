
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

export interface PerformanceEventType {
  id: number;
  title: string;
  date: Date;
  location: string;
  description: string;
  image: string;
}

export const PerformanceEventItem = ({
  event,
  isSelected,
  onSelect,
}: {
  event: PerformanceEventType;
  isSelected: boolean;
  onSelect: (event: PerformanceEventType) => void;
}) => {
  return (
    <div
      className={`rounded-lg p-3 cursor-pointer transition-colors ${
        isSelected
          ? "bg-glee-purple/10 border-glee-purple border"
          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-glee-purple/70"
      }`}
      onClick={() => onSelect(event)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <h4 className="font-semibold text-base md:text-lg dark:text-white">{event.title}</h4>
          <div className="flex items-center text-sm text-gray-600 dark:text-white mt-1">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{format(event.date, "MMMM d, yyyy")}</span>
          </div>
        </div>
        <div className="bg-glee-purple/20 text-glee-purple px-2 py-1 rounded-full text-xs font-medium">
          {format(event.date, "MMM d")}
        </div>
      </div>
    </div>
  );
};

export const PerformanceEventDetails = ({ 
  event, 
  onViewCalendar 
}: { 
  event: PerformanceEventType; 
  onViewCalendar?: () => void;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="relative h-56 md:h-64 lg:h-72">
        <img
          src={event.image}
          alt={event.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-4 md:p-6">
          <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-playfair font-bold mb-2">
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-3 text-sm text-white/90">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(event.date, "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>7:00 PM</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <p className="text-gray-700 dark:text-white">{event.description}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {onViewCalendar && (
            <Button
              onClick={onViewCalendar}
              className="bg-glee-purple hover:bg-glee-purple/90 text-white"
            >
              View All Events
            </Button>
          )}
          <Button variant="outline">Get Tickets</Button>
        </div>
      </div>
    </div>
  );
};
