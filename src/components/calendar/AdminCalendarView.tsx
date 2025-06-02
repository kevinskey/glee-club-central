import React, { useState } from 'react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEvent } from '@/types/calendar';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Edit, Trash2, Search, GraduationCap, Flag, Church } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { EventEditor } from '@/components/admin/EventEditor';
import { toast } from 'sonner';
import { getSpelmanAcademicDates, getSpelmanDateByDate } from '@/utils/spelmanAcademicDates';
import { getNationalHolidays } from '@/utils/nationalHolidays';
import { getReligiousHolidays } from '@/utils/religiousHolidays';

interface AdminCalendarViewProps {
  view: 'month' | 'week' | 'day';
  searchQuery?: string;
  selectedEventType?: string;
  enabledCategories?: string[];
}

export function AdminCalendarView({ 
  view, 
  searchQuery = '', 
  selectedEventType = 'all',
  enabledCategories = ['rehearsal', 'performance', 'meeting', 'event', 'academic', 'holiday', 'religious', 'travel']
}: AdminCalendarViewProps) {
  const { events, loading, error, updateEvent, deleteEvent } = useCalendarEvents();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isEventEditorOpen, setIsEventEditorOpen] = useState(false);

  console.log('AdminCalendarView: Raw events:', events?.length || 0);
  console.log('AdminCalendarView: Search query:', searchQuery);
  console.log('AdminCalendarView: Selected event type:', selectedEventType);
  console.log('AdminCalendarView: Enabled categories:', enabledCategories);

  // Get all holiday data for the current year and next year
  const currentYear = new Date().getFullYear();
  const spelmanDates = [
    ...getSpelmanAcademicDates(currentYear),
    ...getSpelmanAcademicDates(currentYear + 1)
  ];
  const nationalHolidays = [
    ...getNationalHolidays(currentYear),
    ...getNationalHolidays(currentYear + 1)
  ];
  const religiousHolidays = [
    ...getReligiousHolidays(currentYear),
    ...getReligiousHolidays(currentYear + 1)
  ];

  console.log('AdminCalendarView: National holidays loaded:', nationalHolidays.length);
  console.log('AdminCalendarView: Religious holidays loaded:', religiousHolidays.length);
  console.log('AdminCalendarView: Spelman dates loaded:', spelmanDates.length);

  // Convert Spelman dates to CalendarEvent format
  const spelmanEvents: CalendarEvent[] = spelmanDates.map(date => ({
    id: `spelman-${date.id}`,
    title: date.title,
    start_time: date.date.toISOString(),
    end_time: date.date.toISOString(),
    short_description: date.description,
    full_description: date.description,
    event_type: 'academic',
    event_types: ['academic'],
    is_private: true,
    is_public: false,
    allow_rsvp: false,
    allow_reminders: true,
    allow_ics_download: true,
    allow_google_map_link: false,
    created_at: new Date().toISOString(),
    feature_image_url: date.imageUrl
  }));

  // Convert national holidays to CalendarEvent format
  const nationalHolidayEvents: CalendarEvent[] = nationalHolidays.map(holiday => ({
    id: `national-${holiday.id}`,
    title: holiday.title,
    start_time: holiday.date.toISOString(),
    end_time: holiday.date.toISOString(),
    short_description: holiday.description,
    full_description: holiday.description,
    event_type: 'holiday',
    event_types: ['holiday'],
    is_private: true,
    is_public: false,
    allow_rsvp: false,
    allow_reminders: true,
    allow_ics_download: true,
    allow_google_map_link: false,
    created_at: new Date().toISOString(),
    feature_image_url: holiday.imageUrl
  }));

  // Convert religious holidays to CalendarEvent format
  const religiousHolidayEvents: CalendarEvent[] = religiousHolidays.map(holiday => ({
    id: `religious-${holiday.id}`,
    title: holiday.title,
    start_time: holiday.date.toISOString(),
    end_time: holiday.date.toISOString(),
    short_description: holiday.description,
    full_description: holiday.description,
    event_type: 'religious',
    event_types: ['religious'],
    is_private: true,
    is_public: false,
    allow_rsvp: false,
    allow_reminders: true,
    allow_ics_download: true,
    allow_google_map_link: false,
    created_at: new Date().toISOString(),
    feature_image_url: holiday.imageUrl
  }));

  // Combine all events
  const allEvents = [...(events || []), ...spelmanEvents, ...nationalHolidayEvents, ...religiousHolidayEvents];

  console.log('AdminCalendarView: Total combined events:', allEvents.length);

  // Filter events based on search, event types, and enabled categories
  const filteredEvents = React.useMemo(() => {
    return allEvents.filter(event => {
      let matchesSearch = true;
      let matchesType = true;
      let matchesCategory = true;

      // Search filter - check if search query exists and is not empty
      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        matchesSearch = 
          event.title.toLowerCase().includes(query) ||
          (event.short_description && event.short_description.toLowerCase().includes(query)) ||
          (event.full_description && event.full_description.toLowerCase().includes(query)) ||
          (event.location_name && event.location_name.toLowerCase().includes(query)) ||
          (event.event_host_name && event.event_host_name.toLowerCase().includes(query));
      }
      
      // Type filter - only apply if not 'all'
      if (selectedEventType && selectedEventType !== 'all') {
        matchesType = event.event_type === selectedEventType;
      }

      // Category filter - check if event's category is enabled
      if (event.event_type) {
        matchesCategory = enabledCategories.includes(event.event_type);
      }
      
      console.log(`Event "${event.title}": search=${matchesSearch}, type=${matchesType}, category=${matchesCategory}, query="${searchQuery}"`);
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [allEvents, searchQuery, selectedEventType, enabledCategories]);

  console.log('AdminCalendarView: Filtered events:', filteredEvents.length);

  // Handle edit event (only for non-system events)
  const handleEditEvent = (event: CalendarEvent) => {
    if (event.id.startsWith('spelman-') || event.id.startsWith('national-') || event.id.startsWith('religious-')) {
      toast.info('System dates cannot be edited');
      return;
    }
    
    console.log('Opening edit dialog for event:', event);
    
    // Ensure the event has all required fields
    const eventToEdit: CalendarEvent = {
      ...event,
      // Ensure boolean fields have default values
      is_private: event.is_private ?? false,
      is_public: event.is_public ?? true,
      allow_rsvp: event.allow_rsvp ?? true,
      allow_reminders: event.allow_reminders ?? true,
      allow_ics_download: event.allow_ics_download ?? true,
      allow_google_map_link: event.allow_google_map_link ?? true,
      // Ensure array fields exist
      event_types: event.event_types || (event.event_type ? [event.event_type] : [])
    };
    
    setEditingEvent(eventToEdit);
    setIsEventEditorOpen(true);
  };

  // Handle delete event (only for non-system events)
  const handleDeleteEvent = async (eventId: string) => {
    if (eventId.startsWith('spelman-') || eventId.startsWith('national-') || eventId.startsWith('religious-')) {
      toast.info('System dates cannot be deleted');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        toast.success('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  // Handle save event
  const handleSaveEvent = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    if (!editingEvent) return;
    
    try {
      console.log('Saving event data:', eventData);
      await updateEvent(editingEvent.id, eventData);
      toast.success('Event updated successfully');
      setIsEventEditorOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  // Handle close editor
  const handleCloseEditor = () => {
    console.log('Closing event editor');
    setIsEventEditorOpen(false);
    setEditingEvent(null);
  };

  // Get events for selected date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dayEvents = filteredEvents.filter(event => 
      isSameDay(new Date(event.start_time), date)
    );
    return dayEvents;
  };

  // Get dates that have events for the calendar modifiers
  const getDatesWithEvents = () => {
    const datesWithEvents = filteredEvents.map(event => new Date(event.start_time));
    return datesWithEvents;
  };

  // Get date range based on view
  const getDateRange = () => {
    switch (view) {
      case 'month':
        return eachDayOfInterval({
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate)
        });
      case 'week':
        return eachDayOfInterval({
          start: startOfWeek(selectedDate),
          end: endOfWeek(selectedDate)
        });
      case 'day':
        return [selectedDate];
      default:
        return [];
    }
  };

  // Render event card
  const renderEventCard = (event: CalendarEvent) => {
    const isSpelmanEvent = event.id.startsWith('spelman-');
    const isNationalHoliday = event.id.startsWith('national-');
    const isReligiousHoliday = event.id.startsWith('religious-');
    const isSystemEvent = isSpelmanEvent || isNationalHoliday || isReligiousHoliday;
    
    return (
      <Card key={event.id} className="mb-2">
        <CardContent className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {isSpelmanEvent && (
                  <GraduationCap className="h-3 w-3 text-blue-600" />
                )}
                {isNationalHoliday && (
                  <Flag className="h-3 w-3 text-red-600" />
                )}
                {isReligiousHoliday && (
                  <Church className="h-3 w-3 text-purple-600" />
                )}
                <h4 className="font-medium text-sm">{event.title}</h4>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {format(new Date(event.start_time), 'h:mm a')}
                {event.location_name && (
                  <>
                    <MapPin className="h-3 w-3 ml-2" />
                    {event.location_name}
                  </>
                )}
              </div>
              {event.short_description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {event.short_description}
                </p>
              )}
              <div className="flex gap-1 mt-2">
                {event.event_type && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      isSpelmanEvent ? 'border-blue-500 text-blue-600' : 
                      isNationalHoliday ? 'border-red-500 text-red-600' :
                      isReligiousHoliday ? 'border-purple-500 text-purple-600' : ''
                    }`}
                  >
                    {isSpelmanEvent ? 'Academic' : 
                     isNationalHoliday ? 'National Holiday' :
                     isReligiousHoliday ? 'Religious Holiday' : 
                     event.event_type}
                  </Badge>
                )}
                {event.is_private && (
                  <Badge variant="outline" className="text-xs">
                    Private
                  </Badge>
                )}
              </div>
            </div>
            {!isSystemEvent && (
              <div className="flex gap-1 ml-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditEvent(event);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvent(event.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading events: {error}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Check console for more details
        </p>
      </div>
    );
  }

  const hasActiveSearch = searchQuery && searchQuery.trim() !== '';
  const hasActiveFilter = selectedEventType && selectedEventType !== 'all';

  return (
    <div className="space-y-4">
      {/* Search/Filter Results Section - Show when there's an active search or filter */}
      {(hasActiveSearch || hasActiveFilter) && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {hasActiveSearch && hasActiveFilter ? (
                <>Search & Filter Results</>
              ) : hasActiveSearch ? (
                <>Search Results for "{searchQuery}"</>
              ) : (
                <>Filter Results: {selectedEventType}</>
              )}
              <Badge variant="secondary" className="ml-2">
                {filteredEvents.length} found
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredEvents.length > 0 ? (
                filteredEvents.slice(0, 8).map(renderEventCard)
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    No events match your {hasActiveSearch && hasActiveFilter ? 'search and filter' : hasActiveSearch ? 'search' : 'filter'} criteria
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              )}
              {filteredEvents.length > 8 && (
                <div className="pt-2 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    Showing first 8 results. {filteredEvents.length - 8} more events match your criteria.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug info - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded border">
          <strong>Debug:</strong> Total events: {events?.length || 0} | Spelman events: {spelmanEvents.length} | Filtered: {filteredEvents.length} | 
          Search: "{searchQuery}" | Type: {selectedEventType} | 
          Categories: {enabledCategories.join(', ')} |
          Has Active Search: {hasActiveSearch ? 'Yes' : 'No'} | 
          Has Active Filter: {hasActiveFilter ? 'Yes' : 'No'} |
          Editor Open: {isEventEditorOpen ? 'Yes' : 'No'} |
          Editing Event: {editingEvent?.title || 'None'}
        </div>
      )}

      {/* Calendar Views */}
      {view === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar - takes up 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  modifiers={{
                    hasEvents: filteredEvents.map(event => new Date(event.start_time)),
                    today: new Date()
                  }}
                  modifiersClassNames={{
                    hasEvents: "relative after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-blue-500 after:rounded-full",
                    today: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 font-semibold [&:not(.rdp-day_selected)]:bg-blue-100 [&:not(.rdp-day_selected)]:dark:bg-blue-900/30"
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Events for selected date - takes up 1 column */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(selectedDate, 'MMM d, yyyy')}
                  {isToday(selectedDate) && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Today
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  {getEventsForDate(selectedDate).length > 0 ? (
                    getEventsForDate(selectedDate).map(renderEventCard)
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No events scheduled for this date
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {view === 'week' && (
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {getDateRange().map((date, index) => (
              <Card key={index} className="min-h-32">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-center">
                    {format(date, 'EEE d')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-2">
                  <div className="space-y-1">
                    {getEventsForDate(date).slice(0, 3).map(event => (
                      <div key={event.id} className={`text-xs p-1 rounded ${
                        event.id.startsWith('spelman-') 
                          ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700' 
                          : 'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        {event.title}
                      </div>
                    ))}
                    {getEventsForDate(date).length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{getEventsForDate(date).length - 3} more
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {view === 'day' && (
        <Card>
          <CardHeader>
            <CardTitle>
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map(renderEventCard)
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No events scheduled for this day
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Events List - Only show when no active search or filter */}
      {!hasActiveSearch && !hasActiveFilter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              All Events ({filteredEvents.length})
              <Badge variant="outline">{view} view</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(renderEventCard)
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    No events found in database
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Editor Dialog */}
      <EventEditor
        event={editingEvent}
        isOpen={isEventEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveEvent}
      />
    </div>
  );
}
