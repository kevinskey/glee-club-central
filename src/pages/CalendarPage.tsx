
import React, { useState } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventDialog } from '@/components/calendar/EventDialog';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEvent } from '@/types/calendar';
import { PageHeader } from '@/components/ui/page-header';
import { Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/page-loader';
import { Card, CardContent } from '@/components/ui/card';

export default function CalendarPage() {
  const { events, loading, error, fetchEvents } = useCalendarEvents();
  const { isAuthenticated, user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const filteredEvents = events.filter(event => {
    if (event.is_public) return true;
    return isAuthenticated && !event.is_private;
  });

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  if (loading) {
    return (
      <div className="mobile-container mobile-section-padding">
        <PageHeader
          title="Calendar"
          description="View upcoming events and performances"
          icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-spelman mx-auto"></div>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mobile-container mobile-section-padding">
        <PageHeader
          title="Calendar"
          description="View upcoming events and performances"
          icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center h-48 space-y-4">
            <div className="text-red-600 text-center">
              <p className="font-semibold text-sm sm:text-base">Error loading calendar</p>
              <p className="text-xs sm:text-sm mt-1">{error}</p>
            </div>
            <Button onClick={fetchEvents} variant="outline" className="mobile-touch-target">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mobile-container mobile-section-padding space-y-4 sm:space-y-6 mobile-scroll">
      <PageHeader
        title="Calendar"
        description={`View ${isAuthenticated ? 'all events and performances' : 'upcoming public events'}`}
        icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
      />

      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48 space-y-4">
            <Calendar className="h-12 w-12 text-gray-400" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">No Events Found</h3>
              <p className="text-gray-500 mt-2">
                {isAuthenticated 
                  ? "There are no upcoming events at this time." 
                  : "There are no upcoming public events. Log in to see member events."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <CalendarView
          events={filteredEvents}
          onEventClick={handleEventClick}
          showPrivateEvents={isAuthenticated}
        />
      )}

      <EventDialog
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        canRSVP={isAuthenticated && selectedEvent?.allow_rsvp}
      />
    </div>
  );
}
