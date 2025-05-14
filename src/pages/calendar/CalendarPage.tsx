import React, { useState, useEffect } from "react";
import { Footer } from "@/components/landing/Footer";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { EventModal } from "@/components/calendar/EventModal";
import { ViewEventModal } from "@/components/calendar/ViewEventModal";
import { useCalendarStore } from "@/hooks/useCalendarStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { CalendarMain } from "@/components/calendar/CalendarMain";
import { useCalendarEventHandlers } from "@/hooks/useCalendarEventHandlers";
import { toast } from "sonner";
import { CalendarPageHeader } from "@/components/calendar/CalendarPageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePermissions } from "@/hooks/usePermissions";
import { CalendarEvent } from "@/types/calendar";
import { CalendarEditTools } from "@/components/calendar/CalendarEditTools";
import { updateHeroImageWithEvents } from "@/utils/heroImageUtils";

const CalendarPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date());
  const isMobile = useIsMobile();
  
  const { events, fetchEvents, addEvent, updateEvent, deleteEvent } = useCalendarStore();
  const { isAdmin, profile } = useAuth();
  const { isSuperAdmin } = usePermissions();

  // Always allow users to create events - for this specific page
  const userCanCreate = true;

  useEffect(() => {
    console.log("CalendarPage - Initializing");
    
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        console.log("CalendarPage - Fetching events");
        await fetchEvents();
        console.log("CalendarPage - Events loaded successfully");
      } catch (error) {
        console.error("Error loading events:", error);
        toast.error("Failed to load calendar events");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [fetchEvents]);

  // Use our custom hook for event handling
  const {
    handleDateClick,
    handleEventClick,
    handleEventDrop,
    handleEventResize,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent
  } = useCalendarEventHandlers(
    events,
    updateEvent,
    addEvent,
    deleteEvent,
    setSelectedEvent,
    setIsViewModalOpen,
    setSelectedDate,
    setIsCreateModalOpen
  );

  // Handler for creating event
  const onCreateEvent = async (eventData: any): Promise<void> => {
    try {
      await handleCreateEvent(eventData);
      setIsCreateModalOpen(false);
      // Update hero image after creating an event
      await updateHeroImageWithEvents(events);
      return Promise.resolve();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      return Promise.reject(error);
    }
  };

  // Handler for updating event - Updated to return a Promise
  const onUpdateEvent = async (eventData: CalendarEvent): Promise<boolean> => {
    try {
      await handleUpdateEvent(eventData);
      setIsViewModalOpen(false);
      setSelectedEvent(null);
      
      // Update hero image after updating an event
      await updateHeroImageWithEvents(events);
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return Promise.resolve(false);
    }
  };

  // Handler for handling event clicks from UpcomingEventsList
  const handleUpcomingEventClick = async (event: CalendarEvent): Promise<boolean> => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
    return Promise.resolve(true);
  };

  // Handler for deleting event - Updated to return a Promise
  const onDeleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      await handleDeleteEvent(eventId);
      setIsViewModalOpen(false);
      setSelectedEvent(null);
      
      // Update hero image after deleting an event
      await updateHeroImageWithEvents(events.filter(e => e.id !== eventId));
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      return Promise.resolve(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-2 sm:p-4">
          {/* Use CalendarPageHeader on mobile, CalendarHeader on desktop */}
          {isMobile ? (
            <CalendarPageHeader onAddEventClick={() => userCanCreate && setIsCreateModalOpen(true)} />
          ) : (
            <CalendarHeader 
              onAddEvent={() => userCanCreate && setIsCreateModalOpen(true)} 
              view={calendarView}
              onViewChange={setCalendarView}
              userCanCreate={userCanCreate}
            />
          )}
          
          {/* Add CalendarEditTools differently based on device */}
          {!isMobile && (
            <CalendarEditTools 
              onAddEvent={() => setIsCreateModalOpen(true)}
              selectedEventId={selectedEvent?.id}
              onEditSelected={() => isViewModalOpen && setIsViewModalOpen(true)}
              onDeleteSelected={() => selectedEvent && onDeleteEvent(selectedEvent?.id)}
              className="mt-4"
            />
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mt-4 lg:mt-6">
              <div className="hidden lg:block lg:w-64">
                <CalendarSidebar />
              </div>
              
              <CalendarMain 
                events={events}
                calendarView={calendarView}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                userCanCreate={userCanCreate}
                handleDateClick={handleDateClick}
                handleEventClick={handleEventClick}
                handleEventDrop={handleEventDrop}
                handleEventResize={handleEventResize}
              />
            </div>
          )}

          {/* CalendarEditTools for mobile */}
          {isMobile && userCanCreate && (
            <CalendarEditTools 
              onAddEvent={() => setIsCreateModalOpen(true)}
              selectedEventId={selectedEvent?.id}
              onEditSelected={() => setIsViewModalOpen(true)}
              onDeleteSelected={() => selectedEvent && onDeleteEvent(selectedEvent?.id)}
            />
          )}

          {/* Create Event Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className={isMobile ? "w-[95vw] max-w-md p-4" : "sm:max-w-md"}>
              <EventModal 
                onClose={() => setIsCreateModalOpen(false)} 
                onSave={onCreateEvent} 
                initialDate={selectedDate}
              />
            </DialogContent>
          </Dialog>

          {/* View/Edit Event Modal */}
          {selectedEvent && (
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className={isMobile ? "w-[95vw] max-w-md p-4" : "sm:max-w-md"}>
                <ViewEventModal 
                  event={selectedEvent} 
                  onClose={() => setIsViewModalOpen(false)} 
                  onUpdate={onUpdateEvent}
                  onDelete={onDeleteEvent}
                  userCanEdit={userCanCreate || (profile?.id === selectedEvent.created_by && selectedEvent.type === 'sectional')}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CalendarPage;
