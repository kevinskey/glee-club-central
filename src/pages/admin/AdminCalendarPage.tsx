
import React, { useState, useRef, useEffect } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventDialog } from '@/components/calendar/EventDialog';
import { EventEditor } from '@/components/admin/EventEditor';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEvent } from '@/types/calendar';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';

const EDITOR_STATE_KEY = 'event-editor-state';

export default function AdminCalendarPage() {
  const { events, loading, error, createEvent, updateEvent, deleteEvent, fetchEvents } = useCalendarEvents();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Use ref to track if we're intentionally closing the dialog
  const intentionalCloseRef = useRef(false);

  // Restore editor state on page load
  useEffect(() => {
    const savedState = localStorage.getItem(EDITOR_STATE_KEY);
    if (savedState) {
      try {
        const stateData = JSON.parse(savedState);
        const timeDiff = Date.now() - stateData.timestamp;
        
        // Only restore if less than 1 hour old and was creating a new event
        if (timeDiff < 3600000 && stateData.isCreating) {
          setIsCreating(true);
          toast.info('Restored your draft event form');
        } else {
          // Clean up old state
          localStorage.removeItem(EDITOR_STATE_KEY);
        }
      } catch (error) {
        console.error('Error restoring editor state:', error);
        localStorage.removeItem(EDITOR_STATE_KEY);
      }
    }
  }, []);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleSaveEvent = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
        toast.success('Event updated successfully');
      } else {
        await createEvent(eventData);
        toast.success('Event created successfully');
      }
      
      // Mark as intentional close and clean up state
      intentionalCloseRef.current = true;
      localStorage.removeItem(EDITOR_STATE_KEY);
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
    intentionalCloseRef.current = false;
    setIsCreating(true);
    setEditingEvent(null);
    
    // Save state to localStorage
    localStorage.setItem(EDITOR_STATE_KEY, JSON.stringify({
      isCreating: true,
      timestamp: Date.now()
    }));
  };

  const handleEditEvent = (event: CalendarEvent) => {
    intentionalCloseRef.current = false;
    setEditingEvent(event);
    setIsDialogOpen(false);
  };

  const handleCloseEditor = () => {
    // Clean up state when closing
    localStorage.removeItem(EDITOR_STATE_KEY);
    intentionalCloseRef.current = true;
    setIsCreating(false);
    setEditingEvent(null);
  };

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="container mx-auto p-6">
          <PageHeader
            title="Calendar Management"
            description="Manage all events and calendar settings"
            icon={<Calendar className="h-6 w-6" />}
          />
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading calendar...</div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div className="container mx-auto p-6">
          <PageHeader
            title="Calendar Management"
            description="Manage all events and calendar settings"
            icon={<Calendar className="h-6 w-6" />}
          />
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="text-red-600 text-center">
              <p className="font-semibold">Error loading calendar</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={fetchEvents} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title="Calendar Management"
          description="Manage all events and calendar settings"
          icon={<Calendar className="h-6 w-6" />}
          actions={
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          }
        />

        <CalendarView
          events={events}
          onEventClick={handleEventClick}
          showPrivateEvents={true}
        />

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
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleEditEvent(selectedEvent)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteEvent(selectedEvent)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            }
          />
        )}

        {/* Event Editor with enhanced persistence */}
        <EventEditor
          event={editingEvent}
          isOpen={isCreating || !!editingEvent}
          onClose={handleCloseEditor}
          onSave={handleSaveEvent}
        />
      </div>
    </ErrorBoundary>
  );
}
