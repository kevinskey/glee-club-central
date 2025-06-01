
import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent } from '@/types/calendar';
import { useProfile } from '@/contexts/ProfileContext';
import { CalendarHeader } from './CalendarHeader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isAfter } from 'date-fns';

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
  const { isAuthenticated } = useProfile();
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const calendarRef = useRef<FullCalendar>(null);

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
    
    return (
      <div className={`p-1 ${isListView ? 'flex items-center gap-2' : ''}`}>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-xs truncate">
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

      <Card className="p-2 sm:p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView={view}
          events={calendarEvents}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          headerToolbar={false} // We use our custom header
          height="auto"
          aspectRatio={1.8}
          dayMaxEventRows={3}
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
          // Mobile optimizations
          dayHeaderFormat={window.innerWidth < 768 ? { weekday: 'narrow' } : { weekday: 'short' }}
          // Custom styling
          eventClassNames="hover:opacity-80 transition-opacity cursor-pointer"
          dayCellClassNames="hover:bg-gray-50"
          // List view customization
          listDayFormat={{ weekday: 'long', month: 'long', day: 'numeric' }}
          listDaySideFormat={{ weekday: 'narrow' }}
          // Responsive behavior
          contentHeight={window.innerWidth < 768 ? 400 : 600}
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
