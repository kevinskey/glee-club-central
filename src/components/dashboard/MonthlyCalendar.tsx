
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
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ events, className }) => {
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
      <div className="flex items-center justify-between p-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevMonth}
          aria-label="Previous month"
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <h2 className="text-lg font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextMonth}
          aria-label="Next month"
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const daysOfWeek = isMobile ? ["S", "M", "T", "W", "T", "F", "S"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-xs sm:text-sm text-muted-foreground py-1 sm:py-2">
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
    const cellHeight = isMobile ? "h-12" : "h-20";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, "d");
        
        // Find events for this day
        const dayEvents = events.filter(event => isSameDay(event.date, cloneDay));
        
        days.push(
          <div
            key={day.toString()}
            className={cn(
              `${cellHeight} border border-gray-200 dark:border-gray-700 p-1 relative`,
              !isSameMonth(day, monthStart) && "bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500",
              isSameDay(day, selectedDate) && "border-orange-500 border-2"
            )}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="text-xs sm:text-sm">{formattedDate}</span>
            <div className="overflow-y-auto max-h-[60%]">
              {dayEvents.slice(0, isMobile ? 1 : 2).map(event => (
                <div 
                  key={event.id} 
                  className={cn(
                    "text-xs p-1 mb-1 rounded truncate",
                    event.type === "concert" && "bg-glee-purple text-white",
                    event.type === "rehearsal" && "bg-blue-500 text-white",
                    event.type === "sectional" && "bg-green-500 text-white",
                    event.type === "special" && "bg-amber-500 text-white",
                    event.type === "tour" && "bg-purple-500 text-white"
                  )}
                >
                  {isMobile && event.title.length > 8 ? `${event.title.substring(0, 8)}...` : event.title}
                </div>
              ))}
              {dayEvents.length > (isMobile ? 1 : 2) && (
                <div className="text-xs text-center text-muted-foreground">
                  +{dayEvents.length - (isMobile ? 1 : 2)} more
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
    
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className={cn("w-full", className)}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default MonthlyCalendar;
