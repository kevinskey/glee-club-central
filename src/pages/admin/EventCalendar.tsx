
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Calendar, CalendarPlus, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/hooks/useCalendarStore";
import CalendarMain from "@/components/calendar/CalendarMain"; // Fixed import
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventModal } from "@/components/calendar/EventModal";
import { ViewEventModal } from "@/components/calendar/ViewEventModal";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CalendarEvent } from "@/types/calendar";
import { connectToGoogleCalendar, syncWithGoogleCalendar, fetchGoogleCalendarToken } from "@/services/googleCalendar";
import { updateHeroImageWithEvents } from "@/utils/heroImageUtils";

const EventCalendar: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { events, fetchEvents, addEvent, updateEvent, deleteEvent } = useCalendarStore();
  const { user } = useAuth();
  
  // Load calendar events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        await fetchEvents();
      } catch (error) {
        console.error("Error loading calendar events:", error);
        toast.error("Failed to load calendar events");
      }
    };
    
    loadEvents();
  }, [fetchEvents]);
  
  // Event handlers
  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setIsCreateModalOpen(true);
  };
  
  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const clickedEvent = events.find(e => e.id === eventId);
    
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setIsViewModalOpen(true);
    }
  };
  
  const handleCreateEvent = async (eventData: any) => {
    try {
      await addEvent(eventData);
      setIsCreateModalOpen(false);
      toast.success("Event created successfully");
      
      // Update hero images with current events after creating a new one
      const updatedEvents = [...events, eventData];
      await updateHeroImageWithEvents(updatedEvents);
      return true;
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      return false;
    }
  };
  
  const handleUpdateEvent = async (eventData: CalendarEvent): Promise<boolean | void> => {
    try {
      await updateEvent(eventData);
      setIsViewModalOpen(false);
      setSelectedEvent(null);
      toast.success("Event updated successfully");
      
      // Update hero images with current events after updating
      const updatedEvents = events.map(event => 
        event.id === eventData.id ? eventData : event
      );
      await updateHeroImageWithEvents(updatedEvents);
      return true;
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return false;
    }
  };
  
  const handleDeleteEvent = async (eventId: string): Promise<boolean | void> => {
    try {
      await deleteEvent(eventId);
      setIsViewModalOpen(false);
      setSelectedEvent(null);
      toast.success("Event deleted successfully");
      
      // Update hero images after deleting an event
      const remainingEvents = events.filter(event => event.id !== eventId);
      await updateHeroImageWithEvents(remainingEvents);
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      return false;
    }
  };
  
  const handleGoogleCalendarSync = async () => {
    if (!user) {
      toast.error("You must be logged in to sync with Google Calendar");
      return;
    }
    
    try {
      setIsSyncing(true);
      
      // Check if user has already connected Google Calendar
      const token = await fetchGoogleCalendarToken(user.id);
      
      if (!token) {
        // If no token, initiate OAuth flow
        const connectUrl = connectToGoogleCalendar();
        if (connectUrl) {
          window.location.href = connectUrl;
        } else {
          toast.error("Failed to connect to Google Calendar");
        }
        return;
      }
      
      // If token exists, sync events
      const success = await syncWithGoogleCalendar("primary", token.access_token);
      
      if (success) {
        // Reload events after sync
        await fetchEvents();
        toast.success("Calendar synced successfully");
      } else {
        toast.error("Failed to sync calendar");
      }
    } catch (error) {
      console.error("Error syncing with Google Calendar:", error);
      toast.error("Failed to sync with Google Calendar");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <PageHeader
          title="Event Calendar"
          description="Manage Glee Club events and schedule"
          icon={<Calendar className="h-6 w-6" />}
        />
        
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-glee-purple hover:bg-glee-purple/90"
            type="button"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleGoogleCalendarSync}
            disabled={isSyncing}
            type="button"
          >
            {isSyncing ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <Cloud className="mr-2 h-4 w-4" />
            )}
            Sync Calendar
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No events scheduled</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Click the "Add Event" button to create your first calendar event.
            </p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-glee-purple hover:bg-glee-purple/90"
              type="button"
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add Your First Event
            </Button>
          </div>
        ) : (
          <CalendarMain
            events={events}
            calendarView={calendarView}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            userCanCreate={true}
            handleDateClick={handleDateClick}
            handleEventClick={handleEventClick}
            handleEventDrop={(info) => {
              // Handle event drag and drop
              const eventId = info.event.id;
              const updatedEvent = events.find(e => e.id === eventId);
              if (updatedEvent) {
                updateEvent({
                  ...updatedEvent,
                  start: info.event.start,
                  end: info.event.end || info.event.start
                });
              }
            }}
            handleEventResize={(info) => {
              // Handle event resize
              const eventId = info.event.id;
              const updatedEvent = events.find(e => e.id === eventId);
              if (updatedEvent) {
                updateEvent({
                  ...updatedEvent,
                  start: info.event.start,
                  end: info.event.end
                });
              }
            }}
          />
        )}
      </div>
      
      {/* Create Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <EventModal 
            onClose={() => setIsCreateModalOpen(false)} 
            onSave={handleCreateEvent} 
            initialDate={selectedDate}
          />
        </DialogContent>
      </Dialog>
      
      {/* View/Edit Event Modal */}
      {selectedEvent && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-md">
            <ViewEventModal 
              event={selectedEvent} 
              onOpenChange={setIsViewModalOpen}
              onUpdate={handleUpdateEvent}
              onDelete={handleDeleteEvent}
              userCanEdit={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EventCalendar;
