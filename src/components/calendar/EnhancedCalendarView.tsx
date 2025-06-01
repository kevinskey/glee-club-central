
import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent } from '@/types/calendar';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { CalendarHeader } from './CalendarHeader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isAfter } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedCalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent?: () => void;
  loading?: boolean;
}

export function EnhancedCalendarView({ 
  events, 
  onEventClick, 
  onAddEvent,
  loading = false 
}: EnhancedCalendarViewProps) {
  const { isAuthenticated } = useSimpleAuthContext();
  const isMobile = useIsMobile();
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>(
    isMobile ? 'listWeek' : 'dayGridMonth'
  );
  const calendarRef = useRef<FullCalendar>(null);

  // Update view when mobile state changes
  useEffect(() => {
    if (isMobile && view !== 'listWeek' && view !== 'dayGridMonth') {
      setView('listWeek');
    }
  }, [isMobile, view]);

  // Filter events based on authentication status and date
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    const isUpcoming = isAfter(eventDate, new Date());
    
    // Show public events to everyone, private events only to authenticated users
    const canViewEvent = event.is_public || isAuthenticated;
    
    return canViewEvent && isUpcoming;
  });

  // Transform events for FullCalendar
  const calendarEvents = filteredEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start_time,
    end: event.end_time,
    backgroundColor: event.is_private ? '#9b87f5' : '#4F9EE8',
    borderColor: event.is_private ? '#7E69AB' : '#4F9EE8',
    textColor: '#ffffff',
    extendedProps: {
      originalEvent: event,
      location: event.location_name,
      description: event.short_description,
      isPrivate: event.is_private,
      eventType: event.event_type
    }
  }));

  const handleViewChange = (newView: typeof view) => {
    setView(newView);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(newView);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const originalEvent = clickInfo.event.extendedProps.originalEvent;
    if (originalEvent) {
      onEventClick(originalEvent);
    }
  };

  const handlePrevious = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
    }
  };

  const handleAddEvent = () => {
    if (onAddEvent) {
      onAddEvent();
    }
  };

  // Custom event content for better mobile display
  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const isListView = view === 'listWeek';
    
    if (isMobile) {
      return (
        <div className="p-1 text-xs">
          <div className="font-medium truncate leading-tight">
            {event.title.length > 12 ? `${event.title.substring(0, 12)}...` : event.title}
          </div>
          {event.extendedProps.location && isListView && (
            <div className="text-xs opacity-80 truncate mt-0.5">
              📍 {event.extendedProps.location}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className={`p-1 ${isListView ? 'flex items-center gap-2' : ''}`}>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate text-sm">
            {event.title}
          </div>
          {event.extendedProps.location && (
            <div className="text-xs opacity-80 truncate">
              📍 {event.extendedProps.location}
            </div>
          )}
        </div>
        {event.extendedProps.eventType && (
          <Badge 
            variant="secondary" 
            className="text-xs bg-white/20 text-white border-white/30"
          >
            {event.extendedProps.eventType}
          </Badge>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="p-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 bg-gray-100 rounded"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CalendarHeader
        view={view}
        onViewChange={handleViewChange}
        onAddEvent={handleAddEvent}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        userCanCreate={isAuthenticated}
      />

      <Card className={`${isMobile ? 'p-2' : 'p-4'}`}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView={view}
          events={calendarEvents}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          headerToolbar={false}
          height="auto"
          aspectRatio={isMobile ? 0.8 : 1.8}
          dayMaxEventRows={isMobile ? 1 : 3}
          moreLinkClick="popover"
          eventDisplay="block"
          displayEventTime={true}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          dayHeaderFormat={isMobile ? { weekday: 'narrow' } : { weekday: 'short' }}
          eventClassNames="hover:opacity-80 transition-opacity cursor-pointer"
          dayCellClassNames="hover:bg-gray-50 dark:hover:bg-gray-800"
          listDayFormat={{ weekday: 'long', month: 'long', day: 'numeric' }}
          listDaySideFormat={isMobile ? { weekday: 'narrow' } : { weekday: 'short' }}
          contentHeight={isMobile ? 400 : 600}
          nowIndicator={true}
          scrollTime="09:00:00"
          slotMinTime="06:00:00"
          slotMaxTime="23:00:00"
          eventMinHeight={isMobile ? 25 : 30}
          dayMaxEvents={isMobile ? 1 : 4}
          themeSystem="standard"
          longPressDelay={isMobile ? 200 : 1000}
          eventInteractionEnabled={true}
        />
      </Card>

      {filteredEvents.length === 0 && (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Events Found</h3>
          <p className="text-gray-500">
            {isAuthenticated 
              ? "There are no upcoming events at this time." 
              : "There are no upcoming public events. Log in to see member events."
            }
          </p>
        </Card>
      )}
    </div>
  );
}
