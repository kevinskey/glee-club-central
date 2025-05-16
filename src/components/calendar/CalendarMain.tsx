
import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { CalendarEvent } from '@/types/calendar';
import EventContent from './EventContent';
import { useMobile } from '@/hooks/useMobile';
import { MobileFitCheck } from './MobileFitCheck';

interface CalendarMainProps {
  events: CalendarEvent[];
  view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  height?: string;
  onViewDidMount?: (view: any) => void;
  editable?: boolean;
  selectable?: boolean;
  headerToolbar?: boolean | {
    left: string;
    center: string;
    right: string;
  };
  footerToolbar?: boolean | {
    left: string;
    center: string;
    right: string;
  };
  onSelect?: (arg: any) => void;
  slotMinTime?: string;
  slotMaxTime?: string;
  initialDate?: Date;
  displayEventEnd?: boolean;
  eventDisplay?: 'auto' | 'block' | 'list-item' | 'background' | 'inverse-background' | 'none';
}

const CalendarMain: React.FC<CalendarMainProps> = ({
  events,
  view = 'dayGridMonth',
  onEventClick,
  onDateClick,
  height = 'auto',
  onViewDidMount,
  editable = false,
  selectable = false,
  headerToolbar,
  footerToolbar,
  onSelect,
  slotMinTime = '07:00:00',
  slotMaxTime = '21:00:00',
  initialDate,
  displayEventEnd = true,
  eventDisplay = 'block'
}) => {
  const calendarRef = useRef<any>(null);
  const { isMobile } = useMobile();
  const [currentView, setCurrentView] = useState(view);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventId = clickInfo.event.id;
    const selectedEvent = events.find(e => e.id === eventId);
    
    if (selectedEvent && onEventClick) {
      onEventClick(selectedEvent);
    }
  };

  // Handle date click
  const handleDateClick = (arg: any) => {
    if (onDateClick) {
      onDateClick(arg.date);
    }
  };

  // Handle view did mount
  const handleViewDidMount = (view: any) => {
    if (onViewDidMount) {
      onViewDidMount(view);
    }
  };

  return (
    <div className="calendar-container">
      <MobileFitCheck />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={view}
        events={events.map(event => ({
          id: event.id,
          title: event.title,
          start: event.date,
          end: event.date,
          extendedProps: event
        }))}
        eventContent={(arg) => <EventContent arg={arg} />}
        height={height}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        viewDidMount={handleViewDidMount}
        editable={editable}
        selectable={selectable}
        headerToolbar={headerToolbar || {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        titleFormat={{
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }}
        footerToolbar={footerToolbar}
        onSelect={onSelect}
        slotMinTime={slotMinTime}
        slotMaxTime={slotMaxTime}
        initialDate={initialDate}
        displayEventEnd={displayEventEnd}
        eventDisplay={eventDisplay}
      />
    </div>
  );
};

export default CalendarMain;
