
import React, { useState, useEffect } from "react";
import { Header } from "@/components/landing/Header";
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

const CalendarPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { events, fetchEvents, addEvent, updateEvent, deleteEvent } = useCalendarStore();
  const { isAdmin, profile, isLoading: authLoading } = useAuth();

  const userCanCreate = isAdmin() || profile?.role === "section_leader";

  useEffect(() => {
    const loadEvents = async () => {
      if (!authLoading) {
        setIsLoading(true);
        await fetchEvents();
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [authLoading, fetchEvents]);

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
  const onCreateEvent = async (eventData: any) => {
    const success = await handleCreateEvent(eventData);
    if (success) {
      setIsCreateModalOpen(false);
    }
  };

  // Handler for updating event
  const onUpdateEvent = async (eventData: any) => {
    const success = await handleUpdateEvent(eventData);
    if (success) {
      setIsViewModalOpen(false);
      setSelectedEvent(null);
    }
  };

  // Handler for deleting event
  const onDeleteEvent = async (eventId: string) => {
    const success = await handleDeleteEvent(eventId);
    if (success) {
      setIsViewModalOpen(false);
      setSelectedEvent(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-4">
          <CalendarHeader 
            onAddEvent={() => userCanCreate && setIsCreateModalOpen(true)} 
            view={calendarView}
            onViewChange={setCalendarView}
            userCanCreate={userCanCreate}
          />
          
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
