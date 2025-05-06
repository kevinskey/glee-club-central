
import React, { useState, useCallback, useMemo } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCalendarEvents, CalendarEvent } from "@/hooks/useCalendarEvents";
import { AddEventForm } from "@/components/calendar/AddEventForm";
import { toast } from "sonner";

// Newly created components
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { EventList } from "@/components/calendar/EventList";
import { EventDetails } from "@/components/calendar/EventDetails";
import { CalendarPageHeader } from "@/components/calendar/CalendarPageHeader";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const { events, loading, addEvent, deleteEvent } = useCalendarEvents();
  
  // Filter events for the selected date - memoized with useCallback
  const eventsOnSelectedDate = useMemo(() => {
    if (!date) return [];
    
    return events.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  }, [date, events]);
    
  // Get days with events for highlighting in the calendar
  const daysWithEvents = events.map(event => event.date);
  
  // Handle event selection
  const handleEventSelect = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
  }, []);

  // Handle adding new event
  const handleAddEvent = async (formValues: Omit<CalendarEvent, "id">) => {
    const newEvent = await addEvent(formValues);
    
    if (newEvent) {
      setIsAddEventOpen(false);
      
      // If the new event is on the currently selected date, update the calendar
      if (date && 
          formValues.date.getDate() === date.getDate() && 
          formValues.date.getMonth() === date.getMonth() && 
          formValues.date.getFullYear() === date.getFullYear()) {
        // Just refresh the same date to trigger a re-render
        setDate(new Date(formValues.date));
      }
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
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container py-8 sm:py-10 md:py-12">
          <CalendarPageHeader onAddEventClick={() => setIsAddEventOpen(true)} />
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Calendar */}
            <div className="w-full lg:w-1/2">
              <CalendarContainer 
                date={date}
                setDate={setDate}
                daysWithEvents={daysWithEvents}
                loading={loading}
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
    </div>
  );
}
