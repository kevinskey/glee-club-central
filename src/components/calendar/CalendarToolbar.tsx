
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon 
} from "lucide-react";
import { format } from "date-fns";

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
  // Determine the current view's title format
  const getFormattedDate = () => {
    if (calendarView === "dayGridMonth") {
      return format(currentDate, "MMMM yyyy");
    } else if (calendarView === "timeGridWeek") {
      const weekStart = new Date(currentDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "d, yyyy")}`;
      } else if (weekStart.getFullYear() === weekEnd.getFullYear()) {
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
      } else {
        return `${format(weekStart, "MMM d, yyyy")} - ${format(weekEnd, "MMM d, yyyy")}`;
      }
    } else if (calendarView === "timeGridDay") {
      return format(currentDate, "EEEE, MMMM d, yyyy");
    } else {
      return format(currentDate, "MMMM yyyy");
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
      <div className="flex items-center">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onPrevClick}
          className="h-8 w-8 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onTodayClick}
          className="mx-2 h-8 px-3 text-xs"
        >
          Today
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onNextClick}
          className="h-8 w-8 rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <h2 className="ml-4 text-lg font-medium">{getFormattedDate()}</h2>
      </div>
      
      <div className="text-sm text-muted-foreground flex items-center">
        <CalendarIcon className="h-4 w-4 mr-2" />
        <span>{eventsCount} {eventsCount === 1 ? "event" : "events"}</span>
      </div>
    </div>
  );
};
