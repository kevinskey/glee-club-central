
import React, { useRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { EventContent } from "./EventContent";
import { CalendarToolbar } from "./CalendarToolbar";
import { CalendarEvent } from "@/types/calendar";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { Card } from "@/components/ui/card";

// Import required CSS for FullCalendar
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";

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
  const [calendarReady, setCalendarReady] = useState(false);
  
  const { 
    handlePrevClick, 
    handleNextClick, 
    handleTodayClick 
  } = useCalendarNavigation(calendarRef, setCurrentDate);
  
  useEffect(() => {
    console.log("CalendarMain mounted, view:", calendarView);
    console.log("Events received:", events.length);
    
    // Mark calendar as ready after a short delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      setCalendarReady(true);
      console.log("Calendar ready state set to true");
    }, 500); // Increased timeout to ensure DOM is fully ready
    
    return () => {
      console.log("CalendarMain unmounting");
      clearTimeout(timer);
    };
  }, [calendarView, events]);
  
  const eventContent = (eventInfo: any) => {
    return <EventContent eventInfo={eventInfo} view={calendarView} />;
  };

  // Add a sample event if events array is empty (for testing purposes)
  const displayEvents = events.length > 0 ? events : [
    {
      id: "test-event",
      title: "Sample Test Event",
      start: new Date().toISOString(),
      end: new Date(Date.now() + 3600000).toISOString(),
      type: "special" as const,
      location: "Test Location",
      description: "This is a test event to verify calendar rendering"
    }
  ];

  console.log("CalendarMain rendering with events:", events.length, "View:", calendarView);

  return (
    <Card className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 overflow-visible">
      <CalendarToolbar 
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
        onTodayClick={handleTodayClick}
        currentDate={currentDate}
        calendarView={calendarView}
        eventsCount={events.length}
      />

      <div style={{ minHeight: "600px", height: "70vh", marginTop: "1rem" }} className="calendar-container">
        {calendarReady && (
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView={calendarView}
            headerToolbar={false} // We use our custom header
            events={displayEvents.map(event => ({
              id: event.id,
              title: event.title,
              start: event.start,
              end: event.end,
              extendedProps: {
                type: event.type,
                location: event.location || "",
                description: event.description || "",
                created_by: event.created_by
              }
            }))}
            dateClick={userCanCreate ? handleDateClick : undefined}
            eventClick={handleEventClick}
            editable={userCanCreate}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            eventContent={eventContent}
            height="100%"
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
              console.log("Calendar datesSet:", dateInfo.view.title);
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
        )}
      </div>
    </Card>
  );
};
