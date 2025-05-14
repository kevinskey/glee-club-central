
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useCalendarStore } from "@/hooks/useCalendarStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { CalendarEvent } from "@/types/calendar";
import { EventModal } from "@/components/calendar/EventModal";
import { ViewEventModal } from "@/components/calendar/ViewEventModal";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { events, fetchEvents, addEvent, updateEvent, deleteEvent } = useCalendarStore();
  const { isAuthenticated } = useAuth();

  // Get events for the selected date
  const eventsForSelectedDate = date ? 
    events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.setHours(0,0,0,0) === date.setHours(0,0,0,0);
    }) : [];

  // Get days with events for highlighting on the calendar
  const daysWithEvents = events.map(event => {
    if (event.start instanceof Date) {
      return event.start;
    }
    return new Date(event.start);
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        await fetchEvents();
      } catch (error) {
        console.error("Error loading events:", error);
        toast.error("Failed to load calendar events");
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [fetchEvents]);

  const handleAddEvent = async (eventData: any): Promise<void> => {
    try {
      const success = await addEvent({
        ...eventData,
        start: eventData.date,
        end: eventData.date,
        date: eventData.date
      });
      
      if (success) {
        setIsAddEventOpen(false);
        toast.success("Event added successfully");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add event");
    }
  };

  const handleUpdateEvent = async (event: CalendarEvent): Promise<void> => {
    try {
      await updateEvent(event);
      setIsViewEventOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  const handleDeleteEvent = async (): Promise<void> => {
    if (!selectedEvent) return;
    
    try {
      await deleteEvent(selectedEvent.id);
      setIsViewEventOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Glee Club Calendar"
          description="View and manage your calendar events"
          icon={<CalendarIcon className="h-6 w-6" />}
        />
        
        <Button onClick={() => setIsAddEventOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/2 p-4">
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <Spinner size="lg" />
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md pointer-events-auto"
              disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 60))}
            />
          )}
        </Card>
        
        <Card className="md:w-1/2 p-4">
          <h2 className="font-semibold text-lg mb-4">
            {date ? format(date, "MMMM d, yyyy") : "Select a date"}
          </h2>
          
          {eventsForSelectedDate.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events scheduled for this date
            </div>
          ) : (
            <div className="space-y-3">
              {eventsForSelectedDate.map((event) => (
                <Card 
                  key={event.id}
                  className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsViewEventOpen(true);
                  }}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-10 rounded-full mr-3 ${
                      event.type === 'concert' ? 'bg-glee-purple' :
                      event.type === 'rehearsal' ? 'bg-blue-500' :
                      event.type === 'sectional' ? 'bg-green-500' :
                      'bg-amber-500'
                    }`} />
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {event.time ? event.time : 'All day'} 
                        {event.location ? ` • ${event.location}` : ''}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <EventModal
            onClose={() => setIsAddEventOpen(false)}
            onSave={handleAddEvent}
            initialDate={date}
          />
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      {selectedEvent && (
        <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
            </DialogHeader>
            <ViewEventModal
              event={selectedEvent}
              onClose={() => setIsViewEventOpen(false)}
              onUpdate={handleUpdateEvent}
              onDelete={handleDeleteEvent}
              userCanEdit={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
