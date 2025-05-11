
import { useCallback } from "react";
import { RefObject } from "react";
import FullCalendar from "@fullcalendar/react";

export const useCalendarNavigation = (
  calendarRef: RefObject<FullCalendar>,
  setCurrentDate: (date: Date) => void
) => {
  const handlePrevClick = useCallback(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.prev();
      setCurrentDate(api.getDate());
    }
  }, [calendarRef, setCurrentDate]);

  const handleNextClick = useCallback(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.next();
      setCurrentDate(api.getDate());
    }
  }, [calendarRef, setCurrentDate]);

  const handleTodayClick = useCallback(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.today();
      setCurrentDate(api.getDate());
    }
  }, [calendarRef, setCurrentDate]);

  return {
    handlePrevClick,
    handleNextClick,
    handleTodayClick
  };
};
