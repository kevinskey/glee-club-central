import React, { useState, useEffect, useRef } from "react";
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
  const { isAdmin, profile, isLoading: authLoading } = useAuth();
  const { isSuperAdmin } = usePermissions();

  console.log("CalendarPage rendering with view:", calendarView);
  console.log("Current events count:", events.length);

  // Allow all authenticated users to create events
  const userCanCreate = true;

  useEffect(() => {
    console.log("CalendarPage - Initializing");
    
    const loadEvents = async () => {
      console.log("CalendarPage - Loading events. Auth loading:", authLoading);
      if (!authLoading) {
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
      }
    };
    
    loadEvents();
  }, [authLoading, fetchEvents]);

  console.log("CalendarPage - Render state:", { isLoading, eventsCount: events.length, view: calendarView });

  // Use our custom hook for event handling
  const {
    handleDateClick,
    handleEventClick,
    handleEventDrop,
    handleEventResize,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent
  } = useCalendarEventHandlers({
    events,
    updateEvent,
    addEvent,
    deleteEvent,
    setSelectedEvent,
    setIsViewModalOpen,
    setSelectedDate,
    setIsCreateModalOpen
  });

  // Handler for creating event
  const onCreateEvent = async (eventData: any): Promise<boolean> => {
    return await handleCreateEvent(eventData);
  };

  // Handler for updating event
  const onUpdateEvent = async (eventData: CalendarEvent): Promise<boolean> => {
    return await handleUpdateEvent(eventData);
  };

  // Handler for deleting event
  const onDeleteEvent = async (eventId: string): Promise<boolean> => {
    return await handleDeleteEvent(eventId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Removed the Header component completely */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-4">
          {/* Use CalendarPageHeader on mobile, CalendarHeader on desktop */}
          {isMobile ? (
            <CalendarPageHeader onAddEventClick={() => setIsCreateModalOpen(true)} />
          ) : (
            <CalendarHeader 
              onAddEvent={() => setIsCreateModalOpen(true)} 
              view={calendarView}
              onViewChange={setCalendarView}
              userCanCreate={userCanCreate}
            />
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
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

          {/* Create Event Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-md">
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
              <DialogContent className="sm:max-w-md">
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
