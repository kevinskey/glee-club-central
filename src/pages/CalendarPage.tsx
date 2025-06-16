
import React, { useState, useMemo } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventsListView } from '@/components/calendar/EventsListView';
import { EventEditor } from '@/components/admin/EventEditor';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEvent } from '@/types/calendar';
import { Calendar, CalendarDays, CalendarCheck, List, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/page-loader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { useIsPad } from '@/hooks/useIsPad';
import { getNationalHolidays } from '@/utils/nationalHolidays';
import { getReligiousHolidays } from '@/utils/religiousHolidays';
import { getSpelmanAcademicDates } from '@/utils/spelmanAcademicDates';

export default function CalendarPage() {
  const { events, loading, error, fetchEvents, createEvent } = useCalendarEvents();
  const { isAuthenticated, user } = useAuth();
  const isPad = useIsPad();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Combine regular events with holiday and academic dates
  const allEvents = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    // Get holiday and academic dates
    const nationalHolidays = getNationalHolidays(currentYear);
    const religiousHolidays = getReligiousHolidays(currentYear);
    const spelmanDates = getSpelmanAcademicDates(currentYear);
    
    // Convert holidays to calendar event format
    const holidayEvents: CalendarEvent[] = [
      ...nationalHolidays.map(holiday => ({
        id: holiday.id,
        title: holiday.title,
        start_time: holiday.date.toISOString(),
        end_time: new Date(holiday.date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        short_description: holiday.description,
        event_type: 'holiday',
        is_public: true,
        is_private: false,
        allow_rsvp: false,
        allow_reminders: false,
        allow_ics_download: true,
        allow_google_map_link: false,
        created_at: new Date().toISOString(),
        feature_image_url: holiday.imageUrl
      })),
      ...religiousHolidays.map(holiday => ({
        id: holiday.id,
        title: holiday.title,
        start_time: holiday.date.toISOString(),
        end_time: new Date(holiday.date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        short_description: holiday.description,
        event_type: 'religious',
        is_public: true,
        is_private: false,
        allow_rsvp: false,
        allow_reminders: false,
        allow_ics_download: true,
        allow_google_map_link: false,
        created_at: new Date().toISOString(),
        feature_image_url: holiday.imageUrl
      })),
      ...spelmanDates.map(date => ({
        id: date.id,
        title: date.title,
        start_time: date.date.toISOString(),
        end_time: new Date(date.date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        short_description: date.description,
        event_type: date.category,
        is_public: true,
        is_private: false,
        allow_rsvp: false,
        allow_reminders: false,
        allow_ics_download: true,
        allow_google_map_link: false,
        created_at: new Date().toISOString(),
        feature_image_url: date.imageUrl
      }))
    ];
    
    return [...events, ...holidayEvents];
  }, [events]);

  const filteredEvents = allEvents.filter(event => {
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
        <ResponsiveContainer padding={isPad ? 'lg' : 'md'}>
          <div className="flex items-center justify-center h-32 sm:h-48">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-glee-spelman mx-auto"></div>
              <p className="mt-3 text-muted-foreground text-xs sm:text-sm">Loading calendar...</p>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <ResponsiveContainer padding={isPad ? 'lg' : 'md'}>
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
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ResponsiveContainer padding={isPad ? 'xl' : 'lg'} className="space-y-6">
        {/* Page title optimized for iPad */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={cn(
              "font-bold flex items-center gap-2",
              isPad ? "text-3xl" : "text-2xl"
            )}>
              <Calendar className={isPad ? "h-8 w-8" : "h-6 w-6"} />
              Events & Performances
            </h1>
            <p className={cn(
              "text-muted-foreground mt-1",
              isPad ? "text-lg" : "text-base"
            )}>
              {isAuthenticated ? 'All events and performances' : 'Upcoming public events'}
            </p>
          </div>
          
          {isAuthenticated && (
            <Button 
              onClick={() => handleCreateEvent()}
              size={isPad ? "default" : "sm"}
              className="bg-glee-spelman hover:bg-glee-spelman/90 text-white"
            >
              <Plus className={cn("mr-2", isPad ? "h-5 w-5" : "h-4 w-4")} />
              Add Event
            </Button>
          )}
        </div>

        {/* View Toggle with iPad spacing */}
        <div className="flex items-center justify-between">
          <div className={cn(
            "flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
            isPad ? "p-2" : "p-1"
          )}>
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size={isPad ? "default" : "sm"}
              onClick={() => setViewMode('month')}
              className={cn("px-3 py-2", isPad ? "text-sm" : "text-xs")}
            >
              <CalendarDays className={cn("mr-2", isPad ? "h-5 w-5" : "h-4 w-4")} />
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size={isPad ? "default" : "sm"}
              onClick={() => setViewMode('week')}
              className={cn("px-3 py-2", isPad ? "text-sm" : "text-xs")}
            >
              <Calendar className={cn("mr-2", isPad ? "h-5 w-5" : "h-4 w-4")} />
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              size={isPad ? "default" : "sm"}
              onClick={() => setViewMode('day')}
              className={cn("px-3 py-2", isPad ? "text-sm" : "text-xs")}
            >
              <CalendarCheck className={cn("mr-2", isPad ? "h-5 w-5" : "h-4 w-4")} />
              Day
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size={isPad ? "default" : "sm"}
              onClick={() => setViewMode('list')}
              className={cn("px-3 py-2", isPad ? "text-sm" : "text-xs")}
            >
              <List className={cn("mr-2", isPad ? "h-5 w-5" : "h-4 w-4")} />
              List
            </Button>
          </div>
          
          <Badge variant="secondary" className={isPad ? "text-sm" : "text-xs"}>
            {filteredEvents.length} events
          </Badge>
        </div>

        {/* Calendar content with responsive spacing */}
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className={cn(
              "flex flex-col items-center justify-center space-y-3",
              isPad ? "h-48 p-8" : "h-32 p-4"
            )}>
              <Calendar className={cn("text-gray-400", isPad ? "h-12 w-12" : "h-8 w-8")} />
              <div className="text-center">
                <h3 className={cn("font-semibold text-gray-900", isPad ? "text-lg" : "text-sm")}>
                  No Events Found
                </h3>
                <p className={cn("text-gray-500 mt-1", isPad ? "text-base" : "text-xs")}>
                  {isAuthenticated 
                    ? "There are no upcoming events at this time." 
                    : "There are no upcoming public events. Log in to see member events."
                  }
                </p>
                {isAuthenticated && (
                  <Button 
                    onClick={() => handleCreateEvent()}
                    variant="outline" 
                    size={isPad ? "default" : "sm"}
                    className="mt-2"
                  >
                    <Plus className={cn("mr-1", isPad ? "h-4 w-4" : "h-3 w-3")} />
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

        {/* Event dialogs */}
        <EventEditor
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={handleSaveEvent}
        />

        <EventEditor
          event={null}
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSave={handleSaveEvent}
        />
      </ResponsiveContainer>
    </div>
  );
}
