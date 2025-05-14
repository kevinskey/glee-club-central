
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

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
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-sm text-muted-foreground py-2">
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
              "h-20 border border-gray-200 p-1 relative",
              !isSameMonth(day, monthStart) && "bg-gray-50 text-gray-400",
              isSameDay(day, selectedDate) && "border-orange-500 border-2"
            )}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="text-sm">{formattedDate}</span>
            <div className="overflow-y-auto max-h-[70%]">
              {dayEvents.map(event => (
                <div 
                  key={event.id} 
                  className={cn(
                    "text-xs p-1 mb-1 rounded truncate",
                    event.type === "concert" && "bg-orange-500 text-white",
                    event.type === "rehearsal" && "bg-blue-500 text-white",
                    event.type === "sectional" && "bg-green-500 text-white"
                  )}
                >
                  {event.title}
                </div>
              ))}
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
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Monthly Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </CardContent>
    </Card>
  );
};

export default MonthlyCalendar;
