
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Footer } from "@/components/landing/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCalendarStore } from "@/hooks/useCalendarStore";
import { AddEventForm } from "@/components/calendar/AddEventForm";
import { EditEventForm } from "@/components/calendar/EditEventForm";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { useLocation, useSearchParams } from "react-router-dom";
import { EventFormValues } from "@/components/calendar/EventFormFields";
import { Header } from "@/components/landing/Header";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

// Components
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { EventList } from "@/components/calendar/EventList";
import { EventDetails } from "@/components/calendar/EventDetails";
import { CalendarPageHeader } from "@/components/calendar/CalendarPageHeader";
import { CalendarEditTools } from "@/components/calendar/CalendarEditTools";
import { CalendarTools } from "@/components/calendar/CalendarTools";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event');
  const isMobile = useIsMobile();
  
  const { 
    events, 
    isLoading, 
    addEvent, 
    updateEvent, 
    deleteEvent,
    fetchEvents,
    importEvents
  } = useCalendarStore();
  
  // Use the permissions hook to check for super admin status
  const { isSuperAdmin } = usePermissions();
  
  // Filter events for the selected date - memoized
  const eventsOnSelectedDate = useMemo(() => {
    if (!date) return [];
    
    return events.filter(event => {
      // Convert the start property to a Date object if it's a string
      const eventStart = typeof event.start === 'string' 
        ? new Date(event.start) 
        : event.start;
      
      return (
        eventStart.getDate() === date.getDate() && 
        eventStart.getMonth() === date.getMonth() && 
        eventStart.getFullYear() === date.getFullYear()
      );
    });
  }, [date, events]);
  
  // Handle URL event parameter
  useEffect(() => {
    if (eventId && events.length > 0 && !isLoading) {
      // Find the event by ID
      const event = events.find(e => e.id === eventId);
      if (event) {
        // Set the selected date to the event's date
        setDate(typeof event.start === 'string' ? new Date(event.start) : event.start);
        // Select the event
        setSelectedEvent(event);
      } else {
        toast.error("Event not found");
      }
    }
  }, [eventId, events, isLoading]);
    
  // Get days with events for highlighting in the calendar - ensure they are Date objects
  const daysWithEvents = useMemo(() => 
    events.map(event => typeof event.start === 'string' ? new Date(event.start) : event.start), 
  [events]);
  
  // Handle event selection
  const handleEventSelect = useCallback((event: any) => {
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

  // Handle adding new event
  const handleAddEvent = async (formValues: EventFormValues & { start: Date, end: Date }) => {
    // Make sure we have all required fields from formValues
    const eventData: any = {
      title: formValues.title,
      description: formValues.description || "",
      date: formValues.date,
      start: formValues.start,
      end: formValues.end,
      time: formValues.time,
      location: formValues.location,
      type: formValues.type,
      image_url: formValues.image_url || undefined
    };
    
    const success = await addEvent(eventData);
    
    if (success) {
      setIsAddEventOpen(false);
      toast.success("Event added successfully");
      
      // If the new event is on the currently selected date, select it
      if (date && 
          formValues.date.getDate() === date.getDate() && 
          formValues.date.getMonth() === date.getMonth() && 
          formValues.date.getFullYear() === date.getFullYear()) {
        // Set the date again to trigger a refresh of the events list
        handleDateSelect(new Date(date));
      }
    }
  };

  // Fix the handleEditEvent function to ensure type compatibility 
  // Only updating the necessary function to fix the build error
  const handleEditEvent = async (eventData: any) => {
    if (selectedEvent) {
      // Convert date strings to appropriate format if needed
      const processedEventData = {
        ...eventData,
        // Ensure start and end are strings as expected by the CalendarEvent type
        start: typeof eventData.start === 'string' ? eventData.start : eventData.start.toISOString(),
        end: typeof eventData.end === 'string' ? eventData.end : eventData.end.toISOString()
      };

      if (await updateEvent(processedEventData)) {
        setIsEditEventOpen(false);
        setSelectedEvent(null);
        toast.success("Event updated successfully");
      }
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
    } else {
      toast.info("You need admin privileges to add events");
    }
  };
  
  // Handle calendar reset
  const handleResetCalendar = async () => {
    try {
      // Delete all events
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .neq('id', 'none');  // This will match all rows
      
      if (error) throw error;
      
      // Refresh events
      await fetchEvents();
      setIsResetDialogOpen(false);
      toast.success("Calendar has been reset successfully");
    } catch (error) {
      console.error("Error resetting calendar:", error);
      toast.error("Failed to reset calendar");
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
  
  // Import events handler
  const handleImportEvents = async (importedEvents: any[]) => {
    await importEvents(importedEvents);
    await fetchEvents();
  };
  
  // Convert CalendarEvent[] between types as needed
  const convertEvents = useCallback((events: any[]) => {
    return events.map(event => ({
      ...event,
      // Ensure description is present
      description: event.description || "",
      // Ensure start and end are Date objects
      start: typeof event.start === 'string' ? new Date(event.start) : event.start,
      end: typeof event.end === 'string' ? new Date(event.end) : event.end
    }));
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header initialShowNewsFeed={false} />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container py-8 sm:py-10 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <CalendarPageHeader onAddEventClick={handleOpenAddEvent} />
          </div>
          
          {/* Make sure the CalendarEditTools is visible and working */}
          {isSuperAdmin && (
            <CalendarEditTools 
              onAddEvent={handleOpenAddEvent}
              selectedEventId={selectedEvent?.id}
              onEditSelected={() => setIsEditEventOpen(true)}
              onDeleteSelected={handleDeleteEvent}
              onResetCalendar={() => setIsResetDialogOpen(true)}
              onExportCalendar={() => toast.info("Scroll down to use calendar tools")}
              onImportCalendar={() => toast.info("Scroll down to use calendar tools")}
              onShareCalendar={() => toast.info("Scroll down to use calendar tools")}
              className="mb-4"
            />
          )}
          
          <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* Calendar */}
            <div className="w-full lg:w-1/2">
              <CalendarContainer 
                date={date}
                setDate={handleDateSelect}
                daysWithEvents={daysWithEvents}
                loading={isLoading}
                events={convertEvents(events)}
              />
              
              {/* Add CalendarTools component for admins */}
              {isSuperAdmin && !isMobile && (
                <div className="mt-6">
                  <CalendarTools 
                    events={convertEvents(events)} 
                    onImportEvents={handleImportEvents} 
                  />
                </div>
              )}
            </div>
            
            {/* Event details */}
            <div className="w-full lg:w-1/2 h-full">
              <div className="border rounded-lg p-6 h-full bg-white dark:bg-gray-800 shadow-sm">
                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-purple"></div>
                  </div>
                ) : (
                  <>
                    <EventList 
                      date={date}
                      events={convertEvents(eventsOnSelectedDate)}
                      selectedEvent={selectedEvent}
                      onSelectEvent={handleEventSelect}
                      getEventTypeColor={getEventTypeColor}
                    />
                    
                    {selectedEvent && (
                      <EventDetails 
                        event={selectedEvent} 
                        onDelete={handleDeleteEvent}
                        onEdit={() => setIsEditEventOpen(true)}
                        isAdmin={isSuperAdmin && (!selectedEvent.source || selectedEvent.source === 'local')} 
                      />
                    )}
                  </>
                )}
              </div>
              
              {/* Show calendar tools on mobile at the bottom */}
              {isSuperAdmin && isMobile && (
                <div className="mt-6">
                  <CalendarTools 
                    events={convertEvents(events)} 
                    onImportEvents={handleImportEvents} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Add Event Dialog */}
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

      {/* Edit Event Dialog */}
      {selectedEvent && (
        <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
          <DialogContent className="w-[90vw] max-w-[600px] bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <EditEventForm 
              event={selectedEvent}
              onUpdateEvent={handleEditEvent}
              onCancel={() => setIsEditEventOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Reset Calendar Confirmation Dialog */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Calendar</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all calendar events. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetCalendar}
              className="bg-red-500 hover:bg-red-600"
            >
              Reset Calendar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
