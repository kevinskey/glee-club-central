
import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent } from '@/types/calendar';
import { EventTypeFilter } from './EventTypeFilter';
import { EventsListView } from './EventsListView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, Filter } from 'lucide-react';
import { getEventTypeLabel, getEventTypeColor } from '@/utils/eventTypes';
import { getNationalHolidays, getHolidayByDate } from '@/utils/nationalHolidays';
import { getSpelmanAcademicDates, getSpelmanDateByDate } from '@/utils/spelmanAcademicDates';
import { HolidayCard } from './HolidayCard';
import { SpelmanDateCard } from './SpelmanDateCard';
import { format, isSameDay } from 'date-fns';

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  showPrivateEvents?: boolean;
  canCreateEvents?: boolean;
  onDateSelect?: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventClick,
  showPrivateEvents = false,
  canCreateEvents = false,
  onDateSelect
}) => {
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get holidays and academic dates
  const holidays = getNationalHolidays();
  const spelmanDates = getSpelmanAcademicDates();

  // Filter events based on privacy, search, and event types
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Privacy filter
      if (!showPrivateEvents && event.is_private) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(searchLower) ||
          event.short_description?.toLowerCase().includes(searchLower) ||
          event.location_name?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Event type filter
      if (selectedEventTypes.length > 0) {
        const eventTypes = event.event_types || (event.event_type ? [event.event_type] : []);
        const hasSelectedType = eventTypes.some(type => selectedEventTypes.includes(type));
        if (!hasSelectedType) return false;
      }

      return true;
    });
  }, [events, showPrivateEvents, searchTerm, selectedEventTypes]);

  // Convert events to FullCalendar format
  const calendarEvents = useMemo(() => {
    const eventItems = filteredEvents.map(event => {
      const eventTypes = event.event_types || (event.event_type ? [event.event_type] : []);
      const primaryType = eventTypes[0] || 'meeting';
      
      return {
        id: event.id,
        title: event.title,
        start: event.start_time,
        end: event.end_time,
        backgroundColor: getEventTypeColor(primaryType).includes('purple') ? '#7c3aed' :
                        getEventTypeColor(primaryType).includes('blue') ? '#2563eb' :
                        getEventTypeColor(primaryType).includes('green') ? '#16a34a' :
                        getEventTypeColor(primaryType).includes('orange') ? '#ea580c' :
                        getEventTypeColor(primaryType).includes('red') ? '#dc2626' :
                        getEventTypeColor(primaryType).includes('yellow') ? '#ca8a04' :
                        getEventTypeColor(primaryType).includes('pink') ? '#db2777' :
                        getEventTypeColor(primaryType).includes('indigo') ? '#4f46e5' :
                        getEventTypeColor(primaryType).includes('cyan') ? '#0891b2' : '#6b7280',
        borderColor: 'transparent',
        textColor: 'white',
        extendedProps: {
          event: event,
          eventTypes: eventTypes,
          description: event.short_description,
          location: event.location_name,
          isPrivate: event.is_private
        }
      };
    });

    // Add holidays as events (without descriptions in month view)
    const holidayEvents = holidays.map(holiday => ({
      id: `holiday-${holiday.id}`,
      title: holiday.title,
      start: holiday.date.toISOString().split('T')[0],
      allDay: true,
      backgroundColor: '#dc2626',
      borderColor: '#b91c1c',
      textColor: 'white',
      extendedProps: {
        type: 'holiday',
        holiday: holiday,
        description: currentView === 'dayGridMonth' ? '' : holiday.description // Hide description in month view
      }
    }));

    // Add Spelman academic dates (without descriptions in month view)
    const spelmanEvents = spelmanDates.map(date => ({
      id: `spelman-${date.id}`,
      title: date.title,
      start: date.date.toISOString().split('T')[0],
      allDay: true,
      backgroundColor: '#7c3aed',
      borderColor: '#6d28d9',
      textColor: 'white',
      extendedProps: {
        type: 'spelman',
        spelmanDate: date,
        description: currentView === 'dayGridMonth' ? '' : date.description // Hide description in month view
      }
    }));

    return [...eventItems, ...holidayEvents, ...spelmanEvents];
  }, [filteredEvents, holidays, spelmanDates, currentView]);

  // Get special dates for selected date
  const getSpecialDatesForDay = (date: Date) => {
    const holiday = getHolidayByDate(date);
    const spelmanDate = getSpelmanDateByDate(date);
    return { holiday, spelmanDate };
  };

  const handleEventClick = (clickInfo: any) => {
    const { event } = clickInfo.event.extendedProps;
    if (event && onEventClick) {
      onEventClick(event);
    }
  };

  const handleDateClick = (dateClickInfo: any) => {
    const clickedDate = new Date(dateClickInfo.date);
    setSelectedDate(clickedDate);
    
    if (onDateSelect) {
      onDateSelect(clickedDate);
    }
  };

  const clearFilters = () => {
    setSelectedEventTypes([]);
    setSearchTerm('');
  };

  const hasActiveFilters = selectedEventTypes.length > 0 || searchTerm.length > 0;

  // Handle view changes
  const handleViewChange = (viewType: string) => {
    setCurrentView(viewType);
    setSelectedDate(null); // Clear selected date when changing views
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Event Type Filter */}
            <EventTypeFilter
              selectedTypes={selectedEventTypes}
              onTypesChange={setSelectedEventTypes}
            />

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="whitespace-nowrap"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{searchTerm}"
                </Badge>
              )}
              {selectedEventTypes.map(type => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {getEventTypeLabel(type)}
                </Badge>
              ))}
            </div>
          )}

          {/* Results Summary */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredEvents.length} of {events.length} events
            {!showPrivateEvents && (
              <span className="ml-2 text-xs">(Private events hidden)</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Toggle Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={currentView === 'dayGridMonth' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewChange('dayGridMonth')}
            >
              Month
            </Button>
            <Button
              variant={currentView === 'timeGridWeek' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewChange('timeGridWeek')}
            >
              Week
            </Button>
            <Button
              variant={currentView === 'timeGridDay' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewChange('timeGridDay')}
            >
              Day
            </Button>
            <Button
              variant={currentView === 'eventsList' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewChange('eventsList')}
            >
              Events List
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar or List View */}
      <Card>
        <CardContent className="p-6">
          {currentView === 'eventsList' ? (
            <EventsListView
              events={filteredEvents}
              onEventClick={onEventClick}
            />
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              view={currentView}
              events={calendarEvents}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              height="auto"
              eventDisplay="block"
              dayMaxEvents={3}
              moreLinkClick="popover"
              headerToolbar={{
                left: '',
                center: 'title',
                right: 'prev,next today'
              }}
              eventDidMount={(info) => {
                // Add custom styling for different event types
                const { type } = info.event.extendedProps;
                if (type === 'holiday') {
                  info.el.style.borderLeft = '4px solid #dc2626';
                } else if (type === 'spelman') {
                  info.el.style.borderLeft = '4px solid #7c3aed';
                }
              }}
              eventContent={(eventInfo) => {
                const { type, eventTypes } = eventInfo.event.extendedProps;
                
                return (
                  <div className="p-1 text-xs">
                    <div className="font-medium truncate">{eventInfo.event.title}</div>
                    {currentView !== 'dayGridMonth' && eventInfo.event.extendedProps.description && (
                      <div className="text-xs opacity-90 truncate mt-1">
                        {eventInfo.event.extendedProps.description}
                      </div>
                    )}
                    {eventTypes && eventTypes.length > 0 && currentView !== 'dayGridMonth' && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {eventTypes.slice(0, 2).map((type: string) => (
                          <span
                            key={type}
                            className="inline-block px-1 py-0.5 bg-white/20 rounded text-xs"
                          >
                            {getEventTypeLabel(type)}
                          </span>
                        ))}
                        {eventTypes.length > 2 && (
                          <span className="inline-block px-1 py-0.5 bg-white/20 rounded text-xs">
                            +{eventTypes.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && currentView !== 'eventsList' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            
            <div className="space-y-4">
              {/* Events for this date */}
              {filteredEvents
                .filter(event => isSameDay(new Date(event.start_time), selectedDate))
                .map(event => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        {event.short_description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.short_description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{format(new Date(event.start_time), 'h:mm a')}</span>
                          {event.location_name && (
                            <>
                              <span>•</span>
                              <span>{event.location_name}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 ml-4">
                        {(event.event_types || (event.event_type ? [event.event_type] : [])).map(type => (
                          <Badge
                            key={type}
                            variant="outline"
                            className={`text-xs ${getEventTypeColor(type)}`}
                          >
                            {getEventTypeLabel(type)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

              {/* Holiday for this date */}
              {(() => {
                const { holiday, spelmanDate } = getSpecialDatesForDay(selectedDate);
                return (
                  <div className="space-y-3">
                    {holiday && <HolidayCard holiday={holiday} />}
                    {spelmanDate && <SpelmanDateCard spelmanDate={spelmanDate} />}
                  </div>
                );
              })()}

              {/* No events message */}
              {filteredEvents.filter(event => isSameDay(new Date(event.start_time), selectedDate)).length === 0 && 
               !getSpecialDatesForDay(selectedDate).holiday && 
               !getSpecialDatesForDay(selectedDate).spelmanDate && (
                <p className="text-muted-foreground text-center py-4">
                  No events scheduled for this date
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
