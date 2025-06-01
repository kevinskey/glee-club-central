
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MonthlyCalendarProps {
  events: Array<{
    id: string;
    title: string;
    date: Date;
    type: string;
  }>;
  className?: string;
  onEventClick?: (eventId: string) => void;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ events, className, onEventClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isMobile = useIsMobile();

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between p-2 border-b">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevMonth}
          aria-label="Previous month"
          className={cn("h-8 w-8", isMobile && "h-10 w-10")}
        >
          <ChevronLeft className={cn("h-4 w-4", isMobile && "h-5 w-5")} />
        </Button>
        <h2 className={cn("font-semibold", isMobile ? "text-lg" : "text-xl")}>
          {format(currentMonth, isMobile ? "MMM yyyy" : "MMMM yyyy")}
        </h2>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextMonth}
          aria-label="Next month"
          className={cn("h-8 w-8", isMobile && "h-10 w-10")}
        >
          <ChevronRight className={cn("h-4 w-4", isMobile && "h-5 w-5")} />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const daysOfWeek = isMobile ? ["S", "M", "T", "W", "T", "F", "S"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className={cn(
          "text-center font-medium text-muted-foreground py-2 border-b",
          isMobile ? "text-xs" : "text-sm"
        )}>
          {daysOfWeek[i]}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    const cellHeight = isMobile ? "h-16" : "h-24";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, "d");
        
        // Find events for this day
        const dayEvents = events.filter(event => isSameDay(event.date, cloneDay));
        const maxEventsToShow = isMobile ? 1 : 2;
        
        days.push(
          <div
            key={day.toString()}
            className={cn(
              cellHeight,
              "border border-gray-200 dark:border-gray-700 p-1 relative cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
              !isSameMonth(day, monthStart) && "bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500",
              isSameDay(day, selectedDate) && "bg-blue-50 dark:bg-blue-900/20 border-blue-500",
              isSameDay(day, new Date()) && "bg-yellow-50 dark:bg-yellow-900/20"
            )}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className={cn("font-medium", isMobile ? "text-sm" : "text-base")}>
              {formattedDate}
            </span>
            <div className={cn("overflow-hidden", isMobile ? "mt-0.5" : "mt-1")}>
              {dayEvents.slice(0, maxEventsToShow).map(event => (
                <div 
                  key={event.id} 
                  className={cn(
                    "text-xs p-0.5 mb-0.5 rounded truncate cursor-pointer transition-opacity hover:opacity-80",
                    event.type === "concert" && "bg-purple-500 text-white",
                    event.type === "rehearsal" && "bg-blue-500 text-white",
                    event.type === "sectional" && "bg-green-500 text-white",
                    event.type === "special" && "bg-amber-500 text-white",
                    event.type === "tour" && "bg-red-500 text-white",
                    isMobile && "text-xs leading-tight"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEventClick) {
                      onEventClick(event.id);
                    }
                  }}
                  title={event.title}
                >
                  {isMobile && event.title.length > 10 
                    ? `${event.title.substring(0, 10)}...` 
                    : event.title.length > 20 
                    ? `${event.title.substring(0, 20)}...`
                    : event.title
                  }
                </div>
              ))}
              {dayEvents.length > maxEventsToShow && (
                <div className="text-xs text-center text-muted-foreground font-medium">
                  +{dayEvents.length - maxEventsToShow} more
                </div>
              )}
            </div>
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      
      days = [];
    }
    
    return <div className="space-y-0">{rows}</div>;
  };

  return (
    <div className={cn("w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden", className)}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default MonthlyCalendar;
