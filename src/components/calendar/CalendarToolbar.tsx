
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarClock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarToolbarProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  onTodayClick: () => void;
  currentDate: Date;
  calendarView: string;
  eventsCount: number;
}

export const CalendarToolbar = ({
  onPrevClick,
  onNextClick,
  onTodayClick,
  currentDate,
  calendarView,
  eventsCount
}: CalendarToolbarProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onTodayClick}
          id="today-button"
          className="text-xs sm:text-sm px-2 sm:px-3"
        >
          Today
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={onPrevClick} aria-label="Previous" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextClick} aria-label="Next" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-sm sm:text-lg font-semibold ml-1 sm:ml-2">
          {new Intl.DateTimeFormat('en-US', { 
            month: isMobile ? 'short' : 'long', 
            year: 'numeric',
            ...(calendarView === 'timeGridDay' && { day: 'numeric' }),
            ...(calendarView === 'timeGridWeek' && { day: 'numeric' })
          }).format(currentDate)}
          {calendarView === 'timeGridWeek' && (
            <span> - {new Intl.DateTimeFormat('en-US', { 
              month: isMobile ? 'short' : 'long', 
              day: 'numeric',
              year: currentDate.getMonth() + 7 > 12 ? 'numeric' : undefined
            }).format(new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000))}</span>
          )}
        </h2>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
        <CalendarClock className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 text-gray-400" />
        <span className="text-gray-500 dark:text-gray-400">
          {eventsCount} {eventsCount === 1 ? 'event' : 'events'}
        </span>
      </div>
    </div>
  );
};
