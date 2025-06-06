
import React, { useState } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventsListView } from '@/components/calendar/EventsListView';
import { EventDialog } from '@/components/calendar/EventDialog';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEvent } from '@/types/calendar';
import { PageHeader } from '@/components/ui/page-header';
import { PageNavigationHeader } from '@/components/ui/page-navigation-header';
import { Calendar, CalendarDays, CalendarCheck, List, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/page-loader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CalendarPage() {
  const { events, loading, error, fetchEvents, createEvent } = useCalendarEvents();
  const { isAuthenticated, user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredEvents = events.filter(event => {
    if (event.is_public) return true;
    return isAuthenticated && !event.is_private;
  });

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCreateEvent = (date?: Date) => {
    setSelectedEvent(null);
    setShowCreateDialog(true);
  };

  const handleSaveEvent = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    try {
      await createEvent(eventData);
      setShowCreateDialog(false);
      await fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <PageNavigationHeader title="Calendar" />
        <div className="mobile-container mobile-section-padding">
          <div className="flex items-center justify-center h-32 sm:h-48">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-glee-spelman mx-auto"></div>
              <p className="mt-3 text-muted-foreground text-xs sm:text-sm">Loading calendar...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <PageNavigationHeader title="Calendar" />
        <div className="mobile-container mobile-section-padding">
          <Card className="mt-4">
            <CardContent className="flex flex-col items-center justify-center h-32 space-y-3">
              <div className="text-red-600 text-center">
                <p className="font-semibold text-xs sm:text-sm">Error loading calendar</p>
                <p className="text-xs mt-1">{error}</p>
              </div>
              <Button onClick={fetchEvents} variant="outline" size="sm">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageNavigationHeader title="Calendar" />
      
      <div className="mobile-container mobile-section-padding space-y-3 sm:space-y-4 mobile-scroll">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Events & Performances"
            description={`${isAuthenticated ? 'All events and performances' : 'Upcoming public events'}`}
            icon={<Calendar className="h-4 w-4 sm:h-5 sm:w-5" />}
            compact={true}
          />
          
          {isAuthenticated && (
            <Button 
              onClick={() => handleCreateEvent()}
              size="sm"
              className="bg-glee-spelman hover:bg-glee-spelman/90 text-white"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Event
            </Button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
              className="text-xs px-2 py-1 h-7"
            >
              <CalendarDays className="h-3 w-3 mr-1" />
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="text-xs px-2 py-1 h-7"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
              className="text-xs px-2 py-1 h-7"
            >
              <CalendarCheck className="h-3 w-3 mr-1" />
              Day
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs px-2 py-1 h-7"
            >
              <List className="h-3 w-3 mr-1" />
              List
            </Button>
          </div>
          
          <Badge variant="secondary" className="text-xs">
            {filteredEvents.length} events
          </Badge>
        </div>

        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-32 space-y-3">
              <Calendar className="h-8 w-8 text-gray-400" />
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-900">No Events Found</h3>
                <p className="text-gray-500 mt-1 text-xs">
                  {isAuthenticated 
                    ? "There are no upcoming events at this time." 
                    : "There are no upcoming public events. Log in to see member events."
                  }
                </p>
                {isAuthenticated && (
                  <Button 
                    onClick={() => handleCreateEvent()}
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Create First Event
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === 'list' ? (
              <EventsListView
                events={filteredEvents}
                onEventClick={handleEventClick}
              />
            ) : (
              <CalendarView
                events={filteredEvents}
                onEventClick={handleEventClick}
                onCreateEvent={handleCreateEvent}
                showPrivateEvents={isAuthenticated}
                viewMode={viewMode}
              />
            )}
          </>
        )}

        {/* Event View Dialog */}
        <EventDialog
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          canRSVP={isAuthenticated && selectedEvent?.allow_rsvp}
        />

        {/* Event Create Dialog */}
        <EventDialog
          event={null}
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSave={handleSaveEvent}
          canEdit={isAuthenticated}
        />
      </div>
    </div>
  );
}
