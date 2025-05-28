
import React, { useState } from 'react';
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

export default function AdminCalendarPage() {
  const { events, loading, error, createEvent, updateEvent, deleteEvent, fetchEvents } = useCalendarEvents();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                  onClick={() => {
                    setEditingEvent(selectedEvent);
                    setIsDialogOpen(false);
                  }}
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

        {/* Event Editor */}
        <EventEditor
          event={editingEvent}
          isOpen={isCreating || !!editingEvent}
          onClose={() => {
            setIsCreating(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
        />
      </div>
    </ErrorBoundary>
  );
}
