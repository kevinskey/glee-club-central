
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import CalendarMain from './CalendarMain';

export interface CalendarContainerProps {
  events: CalendarEvent[];
  view?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  onEventClick?: (event: CalendarEvent) => void;
  // Support for SchedulePage.tsx props
  date?: Date;
  setDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  daysWithEvents?: Date[];
  loading?: boolean;
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  events,
  view = 'dayGridMonth',
  onEventClick,
  date,
  setDate,
  daysWithEvents,
  loading
}) => {
  if (loading) {
    return <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm h-96 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-glee-purple"></div>
    </div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <CalendarMain
        events={events}
        calendarView={view}
        currentDate={date}
        setCurrentDate={date && setDate ? (newDate) => setDate(newDate) : undefined}
        handleEventClick={onEventClick}
      />
    </div>
  );
};
