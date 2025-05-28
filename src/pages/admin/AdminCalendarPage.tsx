
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

export default function AdminCalendarPage() {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useCalendarEvents();
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
      toast.error('Failed to save event');
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
        toast.error('Failed to delete event');
      }
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Calendar Management"
        description="Manage all events and calendar settings"
        icon={<Calendar className="h-6 w-6" />}
        action={
          <Button onClick={() => setIsCreating(true)}>
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
      <EventDialog
        event={selectedEvent}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedEvent(null);
        }}
        canRSVP={false}
      />

      {selectedEvent && isDialogOpen && (
        <div className="fixed bottom-4 right-4 flex gap-2">
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
  );
}
