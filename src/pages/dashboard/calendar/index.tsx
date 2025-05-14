
import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import MonthlyCalendar from "@/components/dashboard/MonthlyCalendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ViewEventModal } from "@/components/calendar/ViewEventModal";
import { EventModal } from "@/components/calendar/EventModal";
import { CalendarEditTools } from "@/components/calendar/CalendarEditTools";
import { useCalendarStore } from "@/hooks/useCalendarStore";
import { toast } from "sonner";
import { CalendarEvent, EventType } from "@/types/calendar";
import { usePermissions } from '@/hooks/usePermissions';
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Header } from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const isMobile = useIsMobile();
  
  // Use the calendar store instead of mock data
  const { events, addEvent, updateEvent, deleteEvent, fetchEvents } = useCalendarStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Current date for calendar
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const { isSuperAdmin } = usePermissions();
  
  // Allow editing for all users on this page
  const userCanEdit = true;
  
  // Load real events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        await fetchEvents();
      } catch (error) {
        console.error("Error loading events:", error);
        toast.error("Failed to load calendar events");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [fetchEvents]);

  // Get events for the selected date
  const eventsForSelectedDate = date ? events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate();
  }) : [];

  // Handle opening the event modal
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  // Handle adding event - use the actual store now
  const handleAddEvent = async (eventData: any) => {
    try {
      // Format the data to match what the store expects
      const newEvent = {
        title: eventData.title,
        description: eventData.description || "",
        date: eventData.date,
        time: eventData.time,
        location: eventData.location || "",
        type: eventData.type as EventType,
        start: new Date(eventData.date),
        end: new Date(eventData.date)
      };
      
      await addEvent(newEvent);
      toast.success("Event created successfully");
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to create event");
    }
  };

  // Handle updating event - use the actual store now
  const handleUpdateEvent = async (eventData: CalendarEvent): Promise<boolean | void> => {
    try {
      const success = await updateEvent(eventData);
      if (success) {
        toast.success("Event updated successfully");
        setIsViewModalOpen(false);
      }
      return success;
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return false;
    }
  };

  // Handle deleting event - use the actual store now
  const handleDeleteEvent = async (eventId: string): Promise<boolean | void> => {
    try {
      const success = await deleteEvent(eventId);
      if (success) {
        toast.success("Event deleted successfully");
        setIsViewModalOpen(false);
        setSelectedEvent(null);
      }
      return success;
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      return false;
    }
  };
  
  // Transform events for MonthlyCalendar component
  const transformedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date instanceof Date ? event.date : new Date(event.date),
    type: event.type
  }));

  return (
    <>
      {/* Add the correct header based on screen size */}
      {isMobile ? <MobileHeader /> : <Header />}
      
      <div className="container mx-auto p-2 space-y-4 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <h1 className="text-lg sm:text-xl font-semibold">Glee Club Calendar</h1>
          </div>
        </div>
        
        {/* Highlight the edit tools more prominently */}
        <CalendarEditTools 
          onAddEvent={() => setIsCreateModalOpen(true)}
          selectedEventId={selectedEvent?.id}
          onEditSelected={() => isViewModalOpen && setIsViewModalOpen(true)}
          onDeleteSelected={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}
          className="mb-2 border-glee-purple/20 bg-glee-purple/5 dark:bg-glee-purple/10"
        />
        
        <div className="grid grid-cols-1 gap-2">
          {/* Calendar widget takes full width now */}
          <Card className="col-span-1">
            <CardContent className="p-0 sm:p-1">
              <MonthlyCalendar
                events={transformedEvents}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>

        {/* Create Event Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-md">
            <EventModal 
              onClose={() => setIsCreateModalOpen(false)} 
              onSave={handleAddEvent}
              initialDate={date}
            />
          </DialogContent>
        </Dialog>

        {/* View/Edit Event Modal */}
        {selectedEvent && (
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="sm:max-w-md">
              <ViewEventModal 
                event={selectedEvent} 
                onClose={() => setIsViewModalOpen(false)} 
                onUpdate={handleUpdateEvent}
                onDelete={handleDeleteEvent}
                userCanEdit={userCanEdit}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}
