
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventDialog } from '@/components/calendar/EventDialog';
import { EventEditor } from '@/components/admin/EventEditor';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEvent } from '@/types/calendar';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Plus, Edit, Trash2, Music } from 'lucide-react';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getNationalHolidays } from '@/utils/nationalHolidays';
import { getSpelmanAcademicDates } from '@/utils/spelmanAcademicDates';

const STORAGE_KEY = 'glee-event-editor-data';

export default function AdminCalendarPage() {
  const { events, loading, error, createEvent, updateEvent, deleteEvent, fetchEvents } = useCalendarEvents();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get holidays and academic dates
  const holidays = getNationalHolidays();
  const spelmanDates = getSpelmanAcademicDates();

  // Calculate dynamic stats from all events including holidays and academic dates
  const eventStats = useMemo(() => {
    const now = new Date();
    
    // Convert holidays and academic dates to CalendarEvent format for counting
    const holidayEvents: CalendarEvent[] = holidays.map(holiday => ({
      id: `holiday-${holiday.id}`,
      title: holiday.title,
      start_time: holiday.date.toISOString(),
      end_time: holiday.date.toISOString(),
      short_description: holiday.description,
      full_description: holiday.description,
      is_private: false,
      allow_rsvp: false,
      allow_reminders: false,
      allow_ics_download: false,
      allow_google_map_link: false,
      created_at: new Date().toISOString(),
      event_types: ['holiday'],
      event_type: 'holiday'
    }));

    const spelmanEvents: CalendarEvent[] = spelmanDates.map(date => ({
      id: `spelman-${date.id}`,
      title: date.title,
      start_time: date.date.toISOString(),
      end_time: date.date.toISOString(),
      short_description: date.description,
      full_description: date.description,
      is_private: false,
      allow_rsvp: false,
      allow_reminders: false,
      allow_ics_download: false,
      allow_google_map_link: false,
      created_at: new Date().toISOString(),
      event_types: ['academic'],
      event_type: 'academic'
    }));

    // Combine all events
    const allEvents = [...events, ...holidayEvents, ...spelmanEvents];
    
    const totalEvents = allEvents.length;
    
    const upcomingEvents = allEvents.filter(event => 
      new Date(event.start_time) > now
    ).length;
    
    const concerts = allEvents.filter(event => {
      const eventTypes = event.event_types || (event.event_type ? [event.event_type] : []);
      return eventTypes.includes('performance') || 
             eventTypes.includes('concert') || 
             eventTypes.includes('tour_concert') ||
             event.event_type === 'concert' ||
             event.event_type === 'performance';
    }).length;
    
    return {
      totalEvents,
      upcomingEvents,
      concerts
    };
  }, [events, holidays, spelmanDates]);

  // Handle URL parameters for editing
  useEffect(() => {
    const editEventId = searchParams.get('edit');
    if (editEventId) {
      const eventToEdit = events.find(e => e.id === editEventId);
      if (eventToEdit) {
        setEditingEvent(eventToEdit);
      }
    }
  }, [searchParams, events]);

  // Check for saved draft on page load
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // If we have meaningful draft data, automatically open the creator
        if (parsed.isCreating && (parsed.formData?.title || parsed.formData?.short_description)) {
          setIsCreating(true);
          toast.info('Restored your event draft');
        }
      } catch (error) {
        console.error('Error checking saved data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleEventClick = (event: CalendarEvent) => {
    // Navigate to event details page
    navigate(`/admin/events/${event.id}`);
  };

  const handleEventTypesChange = async (eventId: string, newTypes: string[]) => {
    try {
      await updateEvent(eventId, { event_types: newTypes });
      toast.success('Event types updated successfully');
    } catch (error) {
      console.error('Error updating event types:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update event types';
      toast.error(errorMessage);
    }
  };

  const handleSaveEvent = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
        toast.success('Event updated successfully');
        // Clear edit parameter from URL
        navigate('/admin/calendar');
      } else {
        await createEvent(eventData);
        toast.success('Event created successfully');
      }
      
      setEditingEvent(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving event:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save event';
      toast.error(errorMessage);
    }
  };

  const handleDeleteEvent = async (event: CalendarEvent) => {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        await deleteEvent(event.id);
        toast.success('Event deleted successfully');
        setSelectedEvent(null);
        setIsDialogOpen(false);
      } catch (error) {
        console.error('Error deleting event:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete event';
        toast.error(errorMessage);
      }
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingEvent(null);
    // Clear any edit parameters from URL
    navigate('/admin/calendar');
  };

  const handleEditEvent = (event: CalendarEvent) => {
    navigate(`/admin/calendar?edit=${event.id}`);
  };

  const handleCloseEditor = () => {
    setIsCreating(false);
    setEditingEvent(null);
    // Clear edit parameter from URL
    navigate('/admin/calendar');
  };

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50/50">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <PageHeader
              title="Calendar Management"
              description="Manage all events and calendar settings"
              icon={<Calendar className="h-6 w-6" />}
            />
            <Card className="mt-6">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-purple mx-auto"></div>
                  <div className="text-muted-foreground">Loading calendar...</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50/50">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <PageHeader
              title="Calendar Management"
              description="Manage all events and calendar settings"
              icon={<Calendar className="h-6 w-6" />}
            />
            <Card className="mt-6">
              <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="text-red-600 text-center">
                  <p className="font-semibold">Error loading calendar</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
                <Button onClick={fetchEvents} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <PageHeader
              title="Calendar Management"
              description="Create, edit, and manage all Glee Club events and performances"
              icon={<Calendar className="h-6 w-6" />}
              actions={
                <Button 
                  onClick={handleCreateNew} 
                  className="bg-glee-spelman hover:bg-glee-spelman/90 text-white border-glee-spelman"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              }
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-xl font-semibold">{eventStats.totalEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming Events</p>
                    <p className="text-xl font-semibold">{eventStats.upcomingEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Music className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Concerts</p>
                    <p className="text-xl font-semibold">{eventStats.concerts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Section */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Event Calendar</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any event to view details or use the actions to edit or delete
                </p>
              </div>
              
              <div className="bg-white rounded-lg border">
                <CalendarView
                  events={events}
                  onEventClick={handleEventClick}
                  onEventTypesChange={handleEventTypesChange}
                  showPrivateEvents={true}
                  showEventTypeDropdown={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Event Details Dialog with Admin Actions */}
          {selectedEvent && (
            <EventDialog
              event={selectedEvent}
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
                setSelectedEvent(null);
              }}
              canRSVP={false}
              adminActions={
                <div className="flex gap-2 mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleEditEvent(selectedEvent)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteEvent(selectedEvent)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Event
                  </Button>
                </div>
              }
            />
          )}

          {/* Event Editor */}
          <EventEditor
            event={editingEvent}
            isOpen={isCreating || !!editingEvent}
            onClose={handleCloseEditor}
            onSave={handleSaveEvent}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
