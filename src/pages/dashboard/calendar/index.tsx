
import React, { useState, useEffect } from "react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarMain } from "@/components/calendar/CalendarMain";
import { CalendarEditTools } from "@/components/calendar/CalendarEditTools";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { GoogleCalendarToggle } from "@/components/calendar/GoogleCalendarToggle";
import { EventModal } from "@/components/calendar/EventModal";
import { ViewEventModal } from "@/components/calendar/ViewEventModal";
import { CalendarPageHeader } from "@/components/calendar/CalendarPageHeader";
import { useCalendarStore } from "@/hooks/useCalendarStore";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useCalendarEventHandlers } from "@/hooks/useCalendarEventHandlers";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from '@/hooks/usePermissions';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from "sonner";
import {
  connectGoogleCalendar,
  disconnectGoogleCalendar,
  syncWithGoogleCalendar
} from "@/services/googleCalendar";

const CalendarPage = () => {
  // Initialize state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get device type
  const isMobile = useIsMobile();
  
  // Get calendar events and functions
  const {
    events,
    loading,
    googleCalendarConnected,
    syncing,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    resetCalendar,
    checkGoogleConnection
  } = useCalendarEvents();
  
  // Get authentication and permissions
  const { isAdmin, profile, isLoading: authLoading } = useAuth();
  const { isSuperAdmin } = usePermissions();
  
  // Check if user can create/edit events
  const userCanCreate = isSuperAdmin;

  // Initialize event handlers
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

  // Handle Google Calendar connection
  const handleConnectGoogleCalendar = async () => {
    await connectGoogleCalendar();
    // We don't immediately update the connection status since the user needs to complete the auth flow
    setTimeout(async () => {
      await checkGoogleConnection();
    }, 5000);
  };

  // Handle Google Calendar disconnection
  const handleDisconnectGoogleCalendar = async () => {
    const success = await disconnectGoogleCalendar();
    if (success) {
      await checkGoogleConnection();
    }
  };

  // Handle manual sync with Google Calendar
  const handleSyncNow = async () => {
    const success = await syncWithGoogleCalendar();
    if (success) {
      await fetchEvents();
    }
  };

  // Handle editing a selected event
  const handleEditSelected = () => {
    if (selectedEvent) {
      setIsViewModalOpen(false);
      // Open edit modal with a slight delay
      setTimeout(() => {
        // Logic to edit the selected event
        // This could open a modal or navigate to an edit page
        toast.info("Edit event functionality to be implemented");
      }, 100);
    }
  };

  // Handle deleting a selected event
  const handleDeleteSelected = async () => {
    if (selectedEvent && window.confirm("Are you sure you want to delete this event?")) {
      await handleDeleteEvent(selectedEvent.id);
      setSelectedEvent(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Show CalendarPageHeader on mobile, CalendarHeader on desktop */}
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
      
      {userCanCreate && (
        <div className="mt-4 mb-4">
          <CalendarEditTools 
            onAddEvent={() => setIsCreateModalOpen(true)}
            selectedEventId={selectedEvent?.id}
            onEditSelected={handleEditSelected}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      )}
      
      {loading || authLoading ? (
        <div className="flex justify-center items-center h-96">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          <div className="hidden lg:block lg:w-64 space-y-4">
            <CalendarSidebar />
            
            {userCanCreate && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4">
                <h3 className="font-medium mb-3">Google Calendar</h3>
                <GoogleCalendarToggle 
                  connected={googleCalendarConnected}
                  syncing={syncing}
                  onConnect={handleConnectGoogleCalendar}
                  onDisconnect={handleDisconnectGoogleCalendar}
                  onSyncNow={handleSyncNow}
                />
              </div>
            )}
          </div>
          
          <div className="flex-1">
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
        </div>
      )}

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
              onClose={() => setIsViewModalOpen(false)} 
              onUpdate={handleUpdateEvent}
              onDelete={handleDeleteEvent}
              userCanEdit={userCanCreate || (profile?.id === selectedEvent.created_by && selectedEvent.type === 'sectional')}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CalendarPage;
