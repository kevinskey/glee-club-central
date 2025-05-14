
import { useRef } from 'react';
import type FullCalendar from '@fullcalendar/react';

export const useCalendarNavigation = (
  calendarRef: React.RefObject<FullCalendar>,
  setCurrentDate: (date: Date) => void
) => {
  const handlePrevClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleNextClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleTodayClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }
  };

  return {
    handlePrevClick,
    handleNextClick,
    handleTodayClick
  };
};
