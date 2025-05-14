
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
      <div className="flex items-center justify-between p-0.5 sm:p-1">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevMonth}
          aria-label="Previous month"
          className="h-6 w-6"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <h2 className="text-sm font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextMonth}
          aria-label="Next month"
          className="h-6 w-6"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const daysOfWeek = isMobile ? ["S", "M", "T", "W", "T", "F", "S"] : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-xs text-muted-foreground py-0.5">
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
    const cellHeight = isMobile ? "h-11" : "h-[4.5rem]";

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
              `${cellHeight} border border-gray-200 dark:border-gray-700 p-0.5 relative`,
              !isSameMonth(day, monthStart) && "bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500",
              isSameDay(day, selectedDate) && "border-orange-500 border-2"
            )}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="text-xs">{formattedDate}</span>
            <div className="overflow-y-auto max-h-[80%]">
              {dayEvents.slice(0, isMobile ? 2 : 3).map(event => (
                <div 
                  key={event.id} 
                  className={cn(
                    "text-2xs p-0.5 mb-0.5 rounded truncate",
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
              {dayEvents.length > (isMobile ? 2 : 3) && (
                <div className="text-2xs text-center text-muted-foreground">
                  +{dayEvents.length - (isMobile ? 2 : 3)}
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
    <div className={cn("w-full", className)}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default MonthlyCalendar;
