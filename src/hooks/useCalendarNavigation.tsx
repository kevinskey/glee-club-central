
import { useCallback } from "react";
import { RefObject } from "react";
import FullCalendar from "@fullcalendar/react";

export const useCalendarNavigation = (
  calendarRef: RefObject<FullCalendar>,
  setCurrentDate: (date: Date) => void
) => {
  const handlePrevClick = useCallback(() => {
    if (calendarRef.current) {
      console.log("Navigation: Previous");
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setCurrentDate(calendarApi.getDate());
    }
  }, [calendarRef, setCurrentDate]);

  const handleNextClick = useCallback(() => {
    if (calendarRef.current) {
      console.log("Navigation: Next");
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setCurrentDate(calendarApi.getDate());
    }
  }, [calendarRef, setCurrentDate]);

  const handleTodayClick = useCallback(() => {
    if (calendarRef.current) {
      console.log("Navigation: Today");
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }
  }, [calendarRef, setCurrentDate]);

  return {
    handlePrevClick,
    handleNextClick,
    handleTodayClick
  };
};
