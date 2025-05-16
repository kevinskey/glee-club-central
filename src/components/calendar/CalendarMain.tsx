
import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent } from '@/types/calendar';
import { EventContent } from '@/components/calendar/EventContent';
import { useIsMobile } from '@/hooks/use-mobile'; // Fixed import path

interface CalendarMainProps {
  events: CalendarEvent[];
  calendarView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  currentDate?: Date;
  setCurrentDate?: (date: Date) => void;
  userCanCreate?: boolean;
  handleDateClick?: (info: any) => void;
  handleEventClick?: (info: any) => void;
  handleEventDrop?: (info: any) => void;
  handleEventResize?: (info: any) => void;
}

const MobileFitCheck: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
      {title}
    </div>
  );
};

// Export as both default and named export
const CalendarMain: React.FC<CalendarMainProps> = ({
  events,
  calendarView = 'dayGridMonth',
  currentDate = new Date(),
  setCurrentDate,
  userCanCreate = false,
  handleDateClick,
  handleEventClick,
  handleEventDrop,
  handleEventResize
}) => {
  const isMobile = useIsMobile();
  const calendarRef = useRef<FullCalendar>(null);
  
  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.start),
    end: event.end ? new Date(event.end) : undefined,
    allDay: event.allDay,
    extendedProps: {
      location: event.location,
      description: event.description,
      type: event.type,
      image_url: event.image_url,
      created_by: event.created_by
    }
  }));

  const handleEventClickWrapper = (info: any) => {
    if (handleEventClick) {
      const clickedEvent = events.find(e => e.id === info.event.id);
      if (clickedEvent) {
        handleEventClick(clickedEvent);
      }
    }
  };

  return (
    <div className="calendar-container">
      {isMobile && <MobileFitCheck title="Scroll sideways to navigate calendar" />}
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={calendarView}
        events={formattedEvents}
        headerToolbar={!isMobile ? {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek'
        } : false}
        footerToolbar={isMobile ? {
          left: 'prev,next',
          center: '',
          right: 'dayGridMonth,listWeek'
        } : false}
        height={isMobile ? 'auto' : undefined}
        initialDate={currentDate}
        editable={userCanCreate}
        selectable={userCanCreate}
        selectMirror={userCanCreate}
        dayMaxEvents={true}
        eventContent={EventContent}
        dateClick={handleDateClick}
        eventClick={handleEventClickWrapper}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        datesSet={(dateInfo) => {
          if (setCurrentDate) {
            setCurrentDate(dateInfo.view.currentStart);
          }
        }}
      />
    </div>
  );
};

// Export both as named and default export
export { CalendarMain };
export default CalendarMain;
