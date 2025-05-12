import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Footer } from "@/components/landing/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCalendarEvents, CalendarEvent, EventType } from "@/hooks/useCalendarEvents";
import { AddEventForm } from "@/components/calendar/AddEventForm";
import { EditEventForm } from "@/components/calendar/EditEventForm";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { useLocation, useSearchParams } from "react-router-dom";
import { EventFormValues } from "@/components/calendar/EventFormFields";

// Components
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { EventList } from "@/components/calendar/EventList";
import { EventDetails } from "@/components/calendar/EventDetails";
import { CalendarPageHeader } from "@/components/calendar/CalendarPageHeader";
import { GoogleCalendarToggle } from "@/components/calendar/GoogleCalendarToggle";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event');
  
  const { 
    events, 
    loading, 
    addEvent, 
    updateEvent, 
    deleteEvent,
    fetchEvents,
    useGoogleCalendar,
    toggleGoogleCalendar,
    googleCalendarError,
    daysAhead,
    setDaysAhead
  } = useCalendarEvents();
  
  // Use the permissions hook to check for super admin status
  const { isSuperAdmin } = usePermissions();
  
  // Filter events for the selected date - memoized
  const eventsOnSelectedDate = useMemo(() => {
    if (!date) return [];
    
    return events.filter(event => 
      event.start.getDate() === date.getDate() && 
      event.start.getMonth() === date.getMonth() && 
      event.start.getFullYear() === date.getFullYear()
    );
  }, [date, events]);
  
  // Handle URL event parameter
  useEffect(() => {
    if (eventId && events.length > 0 && !loading) {
      // Find the event by ID
      const event = events.find(e => e.id === eventId);
      if (event) {
        // Set the selected date to the event's date
        setDate(new Date(event.start));
        // Select the event
        setSelectedEvent(event);
      } else {
        toast.error("Event not found");
      }
    }
  }, [eventId, events, loading]);
    
  // Get days with events for highlighting in the calendar - ensure they are Date objects
  const daysWithEvents = useMemo(() => events.map(event => event.date), [events]);
  
  // Handle event selection
  const handleEventSelect = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
  }, []);

  // Handle date selection and reset selected event
  const handleDateSelect = useCallback((newDate: Date | undefined) => {
    setDate(newDate);
    // Always reset selected event when changing dates to avoid showing events from a different date
    setSelectedEvent(null);
    
    // Fetch events when changing dates
    fetchEvents();
  }, [fetchEvents]);

  // Handle adding new event - ensuring event has all required fields
  const handleAddEvent = async (formValues: EventFormValues & { start: Date, end: Date }) => {
    // Make sure we have all required fields from formValues
    // and conform to the requirements for CalendarEvent
    const eventData: Omit<CalendarEvent, "id"> = {
      title: formValues.title,
      description: formValues.description || "",
      date: formValues.date,
      start: formValues.start,
      end: formValues.end,
      time: formValues.time,
      location: formValues.location,
      type: formValues.type as EventType, // Ensure correct type casting
      image_url: formValues.image_url || undefined
    };
    
    const newEvent = await addEvent(eventData);
    
    if (newEvent) {
      setIsAddEventOpen(false);
      toast.success("Event added successfully");
      
      // If the new event is on the currently selected date, select it
      if (date && 
          formValues.date.getDate() === date.getDate() && 
          formValues.date.getMonth() === date.getMonth() && 
          formValues.date.getFullYear() === date.getFullYear()) {
        // Set the date again to trigger a refresh of the events list
        handleDateSelect(new Date(date));
        
        // Optionally select the newly added event
        if (newEvent) {
          setTimeout(() => {
            setSelectedEvent(newEvent);
          }, 100);
        }
      }
    }
  };

  // Handle editing an event
  const handleEditEvent = () => {
    if (selectedEvent) {
      setIsEditEventOpen(true);
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    if (await deleteEvent(selectedEvent.id)) {
      setSelectedEvent(null);
      toast.success("Event deleted successfully");
      
      // Force refresh to ensure the deleted event is removed from the UI
      await fetchEvents();
    }
  };
  
  // Open add event dialog with current date selected
  const handleOpenAddEvent = () => {
    if (isSuperAdmin) {
      setIsAddEventOpen(true);
    }
  };
  
  // Get badge color based on event type
  const getEventTypeColor = useCallback((type: string) => {
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
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Removed the duplicate Header component here */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container py-8 sm:py-10 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <CalendarPageHeader onAddEventClick={handleOpenAddEvent} />
            
            {/* Only show Google Calendar toggle for super admins */}
            <GoogleCalendarToggle 
              useGoogleCalendar={useGoogleCalendar}
              toggleGoogleCalendar={toggleGoogleCalendar} 
              googleCalendarError={googleCalendarError}
              daysAhead={daysAhead}
              onDaysAheadChange={setDaysAhead}
            />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* Calendar */}
            <div className="w-full lg:w-1/2">
              <CalendarContainer 
                date={date}
                setDate={handleDateSelect}
                daysWithEvents={daysWithEvents}
                loading={loading}
                events={events}
              />
            </div>
            
            {/* Event details */}
            <div className="w-full lg:w-1/2 h-full">
              <div className="border rounded-lg p-6 h-full bg-white dark:bg-gray-800 shadow-sm">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-purple"></div>
                  </div>
                ) : (
                  <>
                    <EventList 
                      date={date}
                      events={eventsOnSelectedDate}
                      selectedEvent={selectedEvent}
                      onSelectEvent={handleEventSelect}
                      getEventTypeColor={getEventTypeColor}
                    />
                    
                    {selectedEvent && (
                      <EventDetails 
                        event={selectedEvent} 
                        onDelete={handleDeleteEvent}
                        onEdit={handleEditEvent}
                        isAdmin={!selectedEvent.source || selectedEvent.source === 'local'} 
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Add Event Dialog - Modified to limit width to 90% of viewport */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="w-[90vw] max-w-[600px] bg-white dark:bg-gray-800">
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

      {/* Edit Event Dialog - Also modified for consistency */}
      {selectedEvent && (
        <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
          <DialogContent className="w-[90vw] max-w-[600px] bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <EditEventForm 
              event={selectedEvent}
              onUpdateEvent={updateEvent}
              onCancel={() => setIsEditEventOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Needed to prevent TypeScript error - not included in original
function getEventTypeColor(type: string) {
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
}
