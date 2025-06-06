
import React, { useState, useMemo } from 'react';
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
import { getSpelmanAcademicDates } from '@/utils/spelmanAcademicDates';
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

  // Memoize holiday data to prevent recalculation on every render
  const { spelmanEvents, nationalHolidayEvents, religiousHolidayEvents } = useMemo(() => {
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

    // Convert to CalendarEvent format
    const spelmanEvents: CalendarEvent[] = spelmanDates.map(date => ({
      id: `spelman-${date.id}`,
      title: date.title,
      start_time: date.date.toISOString(),
      end_time: date.date.toISOString(),
      short_description: date.description,
      event_type: 'academic',
      event_types: ['academic'],
      is_private: true,
      is_public: false,
      allow_rsvp: false,
      allow_reminders: true,
      allow_ics_download: true,
      allow_google_map_link: false,
      created_at: new Date().toISOString()
    }));

    const nationalHolidayEvents: CalendarEvent[] = nationalHolidays.map(holiday => ({
      id: `national-${holiday.id}`,
      title: holiday.title,
      start_time: holiday.date.toISOString(),
      end_time: holiday.date.toISOString(),
      short_description: holiday.description,
      event_type: 'holiday',
      event_types: ['holiday'],
      is_private: true,
      is_public: false,
      allow_rsvp: false,
      allow_reminders: true,
      allow_ics_download: true,
      allow_google_map_link: false,
      created_at: new Date().toISOString()
    }));

    const religiousHolidayEvents: CalendarEvent[] = religiousHolidays.map(holiday => ({
      id: `religious-${holiday.id}`,
      title: holiday.title,
      start_time: holiday.date.toISOString(),
      end_time: holiday.date.toISOString(),
      short_description: holiday.description,
      event_type: 'religious',
      event_types: ['religious'],
      is_private: true,
      is_public: false,
      allow_rsvp: false,
      allow_reminders: true,
      allow_ics_download: true,
      allow_google_map_link: false,
      created_at: new Date().toISOString()
    }));

    return { spelmanEvents, nationalHolidayEvents, religiousHolidayEvents };
  }, []);

  // Combine all events
  const allEvents = useMemo(() => {
    return [...(events || []), ...spelmanEvents, ...nationalHolidayEvents, ...religiousHolidayEvents];
  }, [events, spelmanEvents, nationalHolidayEvents, religiousHolidayEvents]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      let matchesSearch = true;
      let matchesType = true;
      let matchesCategory = true;

      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        matchesSearch = 
          event.title.toLowerCase().includes(query) ||
          (event.short_description && event.short_description.toLowerCase().includes(query)) ||
          (event.location_name && event.location_name.toLowerCase().includes(query));
      }
      
      if (selectedEventType && selectedEventType !== 'all') {
        matchesType = event.event_type === selectedEventType;
      }

      if (event.event_type) {
        matchesCategory = enabledCategories.includes(event.event_type);
      }
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [allEvents, searchQuery, selectedEventType, enabledCategories]);

  const handleEditEvent = (event: CalendarEvent) => {
    if (event.id.startsWith('spelman-') || event.id.startsWith('national-') || event.id.startsWith('religious-')) {
      toast.info('System dates cannot be edited');
      return;
    }
    
    const eventToEdit: CalendarEvent = {
      ...event,
      is_private: event.is_private ?? false,
      is_public: event.is_public ?? true,
      allow_rsvp: event.allow_rsvp ?? true,
      allow_reminders: event.allow_reminders ?? true,
      allow_ics_download: event.allow_ics_download ?? true,
      allow_google_map_link: event.allow_google_map_link ?? true,
      event_types: event.event_types || (event.event_type ? [event.event_type] : [])
    };
    
    setEditingEvent(eventToEdit);
    setIsEventEditorOpen(true);
  };

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

  const handleSaveEvent = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    if (!editingEvent) return;
    
    try {
      await updateEvent(editingEvent.id, eventData);
      toast.success('Event updated successfully');
      setIsEventEditorOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const handleCloseEditor = () => {
    setIsEventEditorOpen(false);
    setEditingEvent(null);
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return filteredEvents.filter(event => 
      isSameDay(new Date(event.start_time), date)
    );
  };

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
                {isSpelmanEvent && <GraduationCap className="h-3 w-3 text-blue-600" />}
                {isNationalHoliday && <Flag className="h-3 w-3 text-red-600" />}
                {isReligiousHoliday && <Church className="h-3 w-3 text-purple-600" />}
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
              </div>
            </div>
            {!isSystemEvent && (
              <div className="flex gap-1 ml-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0"
                  onClick={() => handleEditEvent(event)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 text-destructive"
                  onClick={() => handleDeleteEvent(event.id)}
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-spelman mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading calendar: {error}</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {view === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border w-full"
              modifiers={{
                hasEvents: filteredEvents.map(event => new Date(event.start_time))
              }}
              modifiersClassNames={{
                hasEvents: "bg-blue-100 text-blue-900 font-medium"
              }}
            />
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getEventsForDate(selectedDate).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No events on this date</p>
                ) : (
                  <div className="space-y-2">
                    {getEventsForDate(selectedDate).map(renderEventCard)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {view === 'week' && (
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {eachDayOfInterval({
              start: startOfWeek(selectedDate),
              end: endOfWeek(selectedDate)
            }).map((day) => (
              <div key={day.toISOString()} className="border rounded-lg p-2 min-h-[200px]">
                <div className={`text-sm font-medium mb-2 ${isToday(day) ? 'text-blue-600' : ''}`}>
                  {format(day, 'EEE d')}
                </div>
                <div className="space-y-1">
                  {getEventsForDate(day).map(event => (
                    <div 
                      key={event.id} 
                      className="text-xs p-1 bg-blue-100 rounded cursor-pointer"
                      onClick={() => handleEditEvent(event)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'day' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-muted-foreground">No events scheduled for this day</p>
              ) : (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map(renderEventCard)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <EventEditor
        event={editingEvent}
        isOpen={isEventEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveEvent}
      />
    </div>
  );
}
