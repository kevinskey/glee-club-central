
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DayProps = {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events?: { title: string; color: string }[];
};

type CalendarProps = {
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  events?: Array<{
    date: Date;
    title: string;
    color?: string;
  }>;
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Day: React.FC<DayProps> = ({ date, isCurrentMonth, isToday, events = [] }) => {
  return (
    <div
      className={cn(
        "h-12 border-t p-1 sm:h-20 sm:p-2",
        !isCurrentMonth && "bg-muted/50 text-muted-foreground",
        isToday && "bg-accent/50"
      )}
    >
      <time
        dateTime={date.toString()}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:text-sm",
          isToday && "bg-primary text-primary-foreground"
        )}
      >
        {date}
      </time>
      <div className="mt-1 space-y-1 overflow-hidden">
        {events.map((event, idx) => (
          <div
            key={idx}
            className={cn(
              "truncate rounded-md px-1 py-0.5 text-xs font-medium",
              event.color || "bg-blue-100 text-blue-700"
            )}
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Calendar: React.FC<CalendarProps> = ({
  month,
  year,
  onPrevMonth,
  onNextMonth,
  events = []
}) => {
  // Calculate days for the calendar
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Calculate days from previous month
  const prevMonthDays = new Date(year, month, 0).getDate();
  
  // Current date for highlighting today
  const currentDate = new Date();
  const today = {
    date: currentDate.getDate(),
    month: currentDate.getMonth(),
    year: currentDate.getFullYear()
  };
  
  // Prepare calendar days
  const days: DayProps[] = [];
  
  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      date: prevMonthDays - i,
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === i && 
             eventDate.getMonth() === month &&
             eventDate.getFullYear() === year;
    }).map(event => ({
      title: event.title,
      color: event.color || "bg-blue-100 text-blue-700"
    }));
    
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: i === today.date && month === today.month && year === today.year,
      events: dateEvents
    });
  }
  
  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false
    });
  }

  return (
    <Card className="w-full">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button variant="outline" size="icon" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>
      <CardContent className="p-0">
        <div className="grid grid-cols-7">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="py-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
          {days.map((day, idx) => (
            <Day 
              key={idx} 
              date={day.date} 
              isCurrentMonth={day.isCurrentMonth} 
              isToday={day.isToday} 
              events={day.events}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;
