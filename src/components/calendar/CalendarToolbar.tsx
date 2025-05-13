
import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface CalendarToolbarProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  onTodayClick: () => void;
  currentDate: Date;
  calendarView: string;
  eventsCount?: number;
}

export const CalendarToolbar = ({
  onPrevClick,
  onNextClick,
  onTodayClick,
  currentDate,
  calendarView,
  eventsCount = 0
}: CalendarToolbarProps) => {
  const getFormattedDate = () => {
    switch (calendarView) {
      case 'dayGridMonth':
        return format(currentDate, "MMMM yyyy");
      case 'timeGridWeek':
        // Get start of week based on current date
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
        
        // Get end of week
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        
        // Format based on whether they're in the same month/year
        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${format(startOfWeek, "MMMM d")} - ${format(endOfWeek, "d, yyyy")}`;
        } else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
          return `${format(startOfWeek, "MMMM d")} - ${format(endOfWeek, "MMMM d, yyyy")}`;
        } else {
          return `${format(startOfWeek, "MMMM d, yyyy")} - ${format(endOfWeek, "MMMM d, yyyy")}`;
        }
      case 'timeGridDay':
        return format(currentDate, "EEEE, MMMM d, yyyy");
      case 'listWeek':
        return format(currentDate, "MMMM yyyy");
      default:
        return format(currentDate, "MMMM yyyy");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
      <div className="flex items-center mb-2 sm:mb-0">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onPrevClick}
          className="mr-1"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onNextClick}
          className="mr-3"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold mr-3">
          {getFormattedDate()}
        </h2>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onTodayClick}
          className="flex items-center text-xs"
        >
          <Calendar className="h-3.5 w-3.5 mr-1" />
          Today
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {eventsCount} {eventsCount === 1 ? 'event' : 'events'} 
      </div>
    </div>
  );
};
