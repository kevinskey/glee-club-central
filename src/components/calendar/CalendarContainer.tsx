
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import CalendarMain from './CalendarMain';

interface CalendarContainerProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  events,
  onEventClick
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <CalendarMain
        events={events}
        handleEventClick={onEventClick}
      />
    </div>
  );
};
