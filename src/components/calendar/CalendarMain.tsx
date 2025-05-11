
import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { EventContent } from "./EventContent";
import { CalendarToolbar } from "./CalendarToolbar";
import { CalendarEvent } from "@/types/calendar";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";

interface CalendarMainProps {
  events: CalendarEvent[];
  calendarView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  userCanCreate: boolean;
  handleDateClick: (info: any) => void;
  handleEventClick: (info: any) => void;
  handleEventDrop: (info: any) => void;
  handleEventResize: (info: any) => void;
}

export const CalendarMain = ({
  events,
  calendarView,
  currentDate,
  setCurrentDate,
  userCanCreate,
  handleDateClick,
  handleEventClick,
  handleEventDrop,
  handleEventResize
}: CalendarMainProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  
  const { 
    handlePrevClick, 
    handleNextClick, 
    handleTodayClick 
  } = useCalendarNavigation(calendarRef, setCurrentDate);
  
  const eventContent = (eventInfo: any) => {
    return <EventContent eventInfo={eventInfo} view={calendarView} />;
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <CalendarToolbar 
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
        onTodayClick={handleTodayClick}
        currentDate={currentDate}
        calendarView={calendarView}
        eventsCount={events.length}
      />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={calendarView}
        headerToolbar={false} // We use our custom header
        events={events.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          extendedProps: {
            type: event.type,
            location: event.location,
            description: event.description,
            created_by: event.created_by
          }
        }))}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={userCanCreate}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventContent={eventContent}
        height="auto"
        firstDay={0} // Start week on Sunday
        nowIndicator={true}
        dayMaxEvents={true}
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={true}
        allDayText="All day"
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: 'short'
        }}
        datesSet={(dateInfo) => {
          setCurrentDate(dateInfo.view.currentStart);
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: 'short'
        }}
        views={{
          dayGridMonth: {
            dayMaxEventRows: 3,
            titleFormat: { month: 'long', year: 'numeric' }
          },
          timeGridWeek: {
            titleFormat: { month: 'long', year: 'numeric' },
            slotDuration: '00:30:00',
            slotLabelInterval: '01:00'
          },
          timeGridDay: {
            titleFormat: { month: 'long', day: 'numeric', year: 'numeric' },
            slotDuration: '00:30:00',
            slotLabelInterval: '01:00'
          },
          listWeek: {
            titleFormat: { month: 'long', year: 'numeric' },
            listDayFormat: { weekday: 'long', month: 'short', day: 'numeric' },
            listDaySideFormat: false
          }
        }}
      />
    </div>
  );
};
