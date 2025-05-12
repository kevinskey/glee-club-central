import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { EventList } from "@/components/calendar/EventList";
import { useAuth } from "@/contexts/AuthContext";
import { useCalendarEvents, EventType, CalendarEvent } from "@/hooks/useCalendarEvents";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddEventForm } from "@/components/calendar/AddEventForm";
import { EditEventForm } from "@/components/calendar/EditEventForm";
import { EventDetails } from "@/components/calendar/EventDetails";
import { toast } from "sonner";
import { usePermissions } from '@/hooks/usePermissions';

export default function SchedulePage() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const { isAuthenticated, profile } = useAuth();
  const { isSuperAdmin } = usePermissions();
  
  // Initialize state for calendar
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  
  // Get calendar events using the hook
  const { events, loading, addEvent, updateEvent, deleteEvent } = useCalendarEvents();
  
  // Check if user is admin - now check for super admin
  const isAdmin = isSuperAdmin;

  // Get days with events for the calendar
  const daysWithEvents = events.map(event => event.start);
  
  // Helper function to get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "concert":
        return "bg-glee-purple hover:bg-glee-purple/90";
      case "rehearsal":
        return "bg-blue-500 hover:bg-blue-500/90";
      case "tour":
        return "bg-green-500 hover:bg-green-500/90";
      case "special":
        return "bg-amber-500 hover:bg-amber-500/90";
      default:
        return "bg-gray-500 hover:bg-gray-500/90";
    }
  };
  
  // Handle event selection
  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsViewEventOpen(true);
  };

  // Handle add event form submission
  const handleAddEvent = async (formValues: any) => {
    try {
      const eventData = {
        ...formValues,
        start: formValues.date, // Ensure start is set
        end: formValues.date,   // Ensure end is set
        type: formValues.type as EventType
      };
      
      const result = await addEvent(eventData);
      if (result) {
        setIsAddEventOpen(false);
        toast.success("Event added successfully");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add event");
    }
  };

  // Handle edit event form submission
  const handleUpdateEvent = async (event: CalendarEvent): Promise<boolean> => {
    try {
      const success = await updateEvent(event);
      if (success) {
        setIsEditEventOpen(false);
        setIsViewEventOpen(false);
        setSelectedEvent(null);
      }
      return success;
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return false;
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      const success = await deleteEvent(selectedEvent.id);
      if (success) {
        setIsViewEventOpen(false);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Glee Club Schedule"
          description="Rehearsals, performances, and important dates"
          icon={<Calendar className="h-6 w-6" />}
        />
        
        {isAdmin && (
          <Button onClick={() => setIsAddEventOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        )}
      </div>
      
      <div className="flex flex-col-reverse md:flex-row gap-6">
        <div className={`${view === "calendar" ? "w-full" : "md:w-1/3 w-full"}`}>
          {view === "calendar" ? (
            <CalendarContainer 
              date={date}
              setDate={setDate}
              daysWithEvents={daysWithEvents}
              loading={loading}
              events={events}
            />
          ) : (
            <EventList 
              date={date}
              events={events}
              selectedEvent={selectedEvent}
              onSelectEvent={handleEventSelect}
              getEventTypeColor={getEventTypeColor}
            />
          )}
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <AddEventForm 
            onAddEvent={handleAddEvent}
            onCancel={() => setIsAddEventOpen(false)}
            initialDate={date}
          />
        </DialogContent>
      </Dialog>

      {/* View/Edit Event Dialog */}
      {selectedEvent && (
        <>
          <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Event Details</DialogTitle>
              </DialogHeader>
              <EventDetails 
                event={selectedEvent} 
                onEdit={() => {
                  setIsViewEventOpen(false);
                  setIsEditEventOpen(true);
                }}
                onDelete={handleDeleteEvent}
                isAdmin={isAdmin}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Edit Event</DialogTitle>
              </DialogHeader>
              <EditEventForm 
                event={selectedEvent} 
                onUpdateEvent={handleUpdateEvent}
                onCancel={() => setIsEditEventOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
