
import React, { useState } from 'react';
import { PublicPageWrapper } from '@/components/landing/PublicPageWrapper';
import { EnhancedCalendarView } from '@/components/calendar/EnhancedCalendarView';
import { EventDialog } from '@/components/calendar/EventDialog';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEvent } from '@/types/calendar';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function EnhancedCalendarPage() {
  const { events, loading, error } = useCalendarEvents();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Filter to only show public events for this public page
  const publicEvents = events.filter(event => !event.is_private);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCreateEvent = (date: Date) => {
    toast.info(`To create events for ${format(date, 'MMMM d, yyyy')}, please contact the Glee Club administration.`);
  };

  if (loading) {
    return (
      <PublicPageWrapper showTopSlider={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </PublicPageWrapper>
    );
  }

  if (error) {
    return (
      <PublicPageWrapper showTopSlider={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <p>Error loading events: {error}</p>
          </div>
        </div>
      </PublicPageWrapper>
    );
  }

  return (
    <PublicPageWrapper showTopSlider={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Events & Performances
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay updated with our upcoming performances, rehearsals, and special events
          </p>
        </div>
        
        <EnhancedCalendarView
          events={publicEvents}
          onEventClick={handleEventClick}
          onCreateEvent={handleCreateEvent}
          showPrivateEvents={false}
        />

        <EventDialog
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          canRSVP={false}
          userRSVP={null}
          onRSVP={() => {}}
        />
      </div>
    </PublicPageWrapper>
  );
}
