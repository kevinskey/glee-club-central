
import { RefObject } from "react";
import FullCalendar from "@fullcalendar/react";

export const useCalendarNavigation = (
  calendarRef: RefObject<FullCalendar>,
  setCurrentDate: (date: Date) => void
) => {
  const handlePrevClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleNextClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleTodayClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }
  };

  return {
    handlePrevClick,
    handleNextClick,
    handleTodayClick,
  };
};
