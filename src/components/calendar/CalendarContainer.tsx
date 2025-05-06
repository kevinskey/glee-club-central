
import React, { memo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarEvent } from "@/hooks/useCalendarEvents";

interface CalendarContainerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  daysWithEvents: Date[];
  loading: boolean;
}

export const CalendarContainer = memo(({
  date,
  setDate,
  daysWithEvents,
  loading
}: CalendarContainerProps) => {
  if (loading) {
    return (
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm flex justify-center items-center h-[25rem]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-purple"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="mx-auto"
        modifiers={{
          event: daysWithEvents
        }}
        modifiersStyles={{
          event: {
            fontWeight: 'bold',
            color: 'var(--glee-purple)'
          }
        }}
      />
    </div>
  );
});

CalendarContainer.displayName = "CalendarContainer";
