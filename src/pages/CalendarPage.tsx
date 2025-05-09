
import React, { useState, useCallback, useMemo } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCalendarEvents, CalendarEvent } from "@/hooks/useCalendarEvents";
import { AddEventForm } from "@/components/calendar/AddEventForm";
import { EditEventForm } from "@/components/calendar/EditEventForm";
import { toast } from "sonner";
import { GoogleCalendarToggle } from "@/components/calendar/GoogleCalendarToggle";

// Components
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { EventList } from "@/components/calendar/EventList";
import { EventDetails } from "@/components/calendar/EventDetails";
import { CalendarPageHeader } from "@/components/calendar/CalendarPageHeader";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [daysAhead, setDaysAhead] = useState(90);
  
  const { 
    events, 
    loading, 
    addEvent, 
    updateEvent, 
    deleteEvent,
    useGoogleCalendar,
    toggleGoogleCalendar,
    googleCalendarError,
    fetchEvents
  } = useCalendarEvents(daysAhead);
  
  // Filter events for the selected date - memoized
  const eventsOnSelectedDate = useMemo(() => {
    if (!date) return [];
    
    return events.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  }, [date, events]);
    
  // Get days with events for highlighting in the calendar
  const daysWithEvents = useMemo(() => events.map(event => event.date), [events]);
  
  // Handle event selection
  const handleEventSelect = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
  }, []);

  // Handle days ahead change
  const handleDaysAheadChange = (days: number) => {
    setDaysAhead(days);
    // Trigger a refetch with the new days ahead
    fetchEvents();
  };

  // Handle adding new event
  const handleAddEvent = async (formValues: Omit<CalendarEvent, "id">) => {
    const newEvent = await addEvent(formValues);
    
    if (newEvent) {
      setIsAddEventOpen(false);
      toast.success("Event added successfully");
      
      // If the new event is on the currently selected date, select it
      if (date && 
          formValues.date.getDate() === date.getDate() && 
          formValues.date.getMonth() === date.getMonth() && 
          formValues.date.getFullYear() === date.getFullYear()) {
        // Set the date again to trigger a refresh
        setDate(new Date(date));
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
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container py-8 sm:py-10 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <CalendarPageHeader onAddEventClick={() => setIsAddEventOpen(true)} />
            
            <GoogleCalendarToggle 
              useGoogleCalendar={useGoogleCalendar}
              toggleGoogleCalendar={toggleGoogleCalendar}
              googleCalendarError={googleCalendarError}
              daysAhead={daysAhead}
              onDaysAheadChange={handleDaysAheadChange}
            />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Calendar */}
            <div className="w-full lg:w-1/2">
              <CalendarContainer 
                date={date}
                setDate={setDate}
                daysWithEvents={daysWithEvents}
                loading={loading}
                events={events}
              />
            </div>
            
            {/* Event details */}
            <div className="w-full lg:w-1/2">
              <div className="border rounded-lg p-6 h-full bg-white dark:bg-gray-800 shadow-sm">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-purple"></div>
                  </div>
                ) : (
                  <>
                    {useGoogleCalendar && googleCalendarError ? (
                      <div className="flex flex-col items-center justify-center h-32 text-center">
                        <div className="text-amber-500 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <p className="text-sm mb-2">Unable to load Google Calendar events.</p>
                        <p className="text-xs text-muted-foreground">Please check the Google Calendar API key in the configuration.</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => toggleGoogleCalendar()}
                        >
                          Switch to Local Calendar
                        </Button>
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
                            selectedEvent={selectedEvent} 
                            onDeleteEvent={handleDeleteEvent}
                            onEditEvent={handleEditEvent} 
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <AddEventForm 
            onAddEvent={handleAddEvent} 
            onCancel={() => setIsAddEventOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      {selectedEvent && (
        <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800">
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
