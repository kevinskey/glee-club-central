import React, { useState } from 'react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEvent } from '@/types/calendar';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

interface AdminCalendarViewProps {
  view: 'month' | 'week' | 'day';
  searchQuery?: string;
  selectedEventType?: string;
}

export function AdminCalendarView({ view, searchQuery = '', selectedEventType = 'all' }: AdminCalendarViewProps) {
  const { events, loading, error } = useCalendarEvents();
  const [selectedDate, setSelectedDate] = useState(new Date());

  console.log('AdminCalendarView: Events loaded:', events?.length || 0);
  console.log('AdminCalendarView: Search query:', searchQuery);
  console.log('AdminCalendarView: Selected event type:', selectedEventType);

  // Filter events based on search and event types
  const filteredEvents = events.filter(event => {
    let matchesSearch = true;
    let matchesType = true;

    // Search filter
    if (searchQuery.trim()) {
      matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.short_description && event.short_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.location_name && event.location_name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    // Type filter - only apply if not 'all'
    if (selectedEventType && selectedEventType !== 'all') {
      matchesType = event.event_type === selectedEventType;
    }
    
    console.log(`Event "${event.title}": search=${matchesSearch}, type=${matchesType}`);
    return matchesSearch && matchesType;
  });

  console.log('AdminCalendarView: Filtered events:', filteredEvents.length);

  // Get events for selected date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dayEvents = filteredEvents.filter(event => 
      isSameDay(new Date(event.start_time), date)
    );
    console.log(`Events for ${format(date, 'yyyy-MM-dd')}:`, dayEvents.length);
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

  const renderEventCard = (event: CalendarEvent) => (
    <Card key={event.id} className="mb-2">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm">{event.title}</h4>
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
                <Badge variant="secondary" className="text-xs">
                  {event.event_type}
                </Badge>
              )}
              {event.is_private && (
                <Badge variant="outline" className="text-xs">
                  Private
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1 ml-2">
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-spelman"></div>
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

  return (
    <div className="space-y-4">
      {/* Debug info */}
      <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
        Total events: {events.length} | Filtered: {filteredEvents.length} | 
        Search: "{searchQuery}" | Type: {selectedEventType}
      </div>

      {view === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
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
                  hasEvents: getDatesWithEvents()
                }}
                modifiersClassNames={{
                  hasEvents: "relative"
                }}
                components={{
                  Day: ({ date, ...props }) => {
                    const hasEvents = getDatesWithEvents().some(eventDate => 
                      isSameDay(eventDate, date)
                    );
                    return (
                      <div className="relative w-full h-full">
                        <div {...props}>
                          {format(date, 'd')}
                          {hasEvents && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Events for selected date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Events for {format(selectedDate, 'MMMM d, yyyy')}
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
                      <div key={event.id} className="text-xs p-1 bg-blue-100 rounded">
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

      {/* All Events List */}
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
                  {events.length === 0 ? 'No events found in database' : 'No events match current filters'}
                </p>
                {(searchQuery || selectedEventType !== 'all') && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Try clearing the search or adjusting filters
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
