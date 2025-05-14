
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarClock } from "lucide-react";

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
  return (
    <div className="flex items-center justify-between mb-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onTodayClick}
          id="today-button"
        >
          Today
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={onPrevClick} aria-label="Previous">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextClick} aria-label="Next">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold ml-2">
          {new Intl.DateTimeFormat('en-US', { 
            month: 'long', 
            year: 'numeric',
            ...(calendarView === 'timeGridDay' && { day: 'numeric' }),
            ...(calendarView === 'timeGridWeek' && { day: 'numeric' })
          }).format(currentDate)}
          {calendarView === 'timeGridWeek' && (
            <span> - {new Intl.DateTimeFormat('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: currentDate.getMonth() + 7 > 12 ? 'numeric' : undefined
            }).format(new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000))}</span>
          )}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <CalendarClock className="h-4 w-4 mr-1 text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {eventsCount} {eventsCount === 1 ? 'event' : 'events'}
        </span>
      </div>
    </div>
  );
};
