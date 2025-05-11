
import React, { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { EventModal } from "@/components/calendar/EventModal";
import { ViewEventModal } from "@/components/calendar/ViewEventModal";
import { useCalendarStore } from "@/hooks/useCalendarStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EventType, CalendarEvent } from "@/types/calendar";
import { Spinner } from "@/components/ui/spinner";
import { CalendarClock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CalendarPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { events, fetchEvents, addEvent, updateEvent, deleteEvent } = useCalendarStore();
  const { isAdmin, profile, isAuthenticated, isLoading: authLoading } = useAuth();

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

  const handleDateClick = useCallback((info: any) => {
    if (userCanCreate) {
      setSelectedDate(info.date);
      setIsCreateModalOpen(true);
    }
  }, [userCanCreate]);

  const handleEventClick = useCallback((info: any) => {
    const eventId = info.event.id;
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsViewModalOpen(true);
    }
  }, [events]);

  const handleEventDrop = useCallback(async (info: any) => {
    if (!userCanCreate) {
      toast.error("You don't have permission to move events");
      info.revert();
      return;
    }
    
    try {
      const eventId = info.event.id;
      const event = events.find(e => e.id === eventId);
      
      if (event) {
        const updatedEvent = {
          ...event,
          start: info.event.start.toISOString(),
          end: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString()
        };
        
        await updateEvent(updatedEvent);
        toast.success("Event updated successfully");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      info.revert();
    }
  }, [events, updateEvent, userCanCreate]);

  const handleEventResize = useCallback(async (info: any) => {
    if (!userCanCreate) {
      toast.error("You don't have permission to resize events");
      info.revert();
      return;
    }
    
    try {
      const eventId = info.event.id;
      const event = events.find(e => e.id === eventId);
      
      if (event) {
        const updatedEvent = {
          ...event,
          end: info.event.end.toISOString()
        };
        
        await updateEvent(updatedEvent);
        toast.success("Event updated successfully");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      info.revert();
    }
  }, [events, updateEvent, userCanCreate]);

  const handleCreateEvent = async (eventData: Omit<CalendarEvent, 'id' | 'created_by'>) => {
    if (!profile) return;
    
    try {
      const newEvent = {
        ...eventData,
        created_by: profile.id
      };
      
      await addEvent(newEvent);
      setIsCreateModalOpen(false);
      toast.success("Event created successfully");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  const handleUpdateEvent = async (eventData: CalendarEvent) => {
    try {
      await updateEvent(eventData);
      setIsViewModalOpen(false);
      setSelectedEvent(null);
      toast.success("Event updated successfully");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      setIsViewModalOpen(false);
      setSelectedEvent(null);
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const handlePrevClick = () => {
    const calendarApi = document.querySelector('.fc')?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleNextClick = () => {
    const calendarApi = document.querySelector('.fc')?.getApi();
    if (calendarApi) {
      calendarApi.next();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleTodayClick = () => {
    const calendarApi = document.querySelector('.fc')?.getApi();
    if (calendarApi) {
      calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const eventContent = (eventInfo: any) => {
    const typeColors: Record<EventType, string> = {
      'rehearsal': 'bg-blue-500 border-blue-600',
      'concert': 'bg-orange-500 border-orange-600',
      'sectional': 'bg-green-500 border-green-600',
      'special': 'bg-purple-500 border-purple-600'
    };

    const eventType = eventInfo.event.extendedProps.type as EventType || 'special';
    const location = eventInfo.event.extendedProps.location;
    
    // Different rendering based on view type
    if (calendarView === 'dayGridMonth') {
      return (
        <div className="w-full overflow-hidden">
          <div className={`flex items-center py-1 px-2 rounded-sm ${typeColors[eventType]}`}>
            <div className="flex-1 text-white truncate">
              <div className="font-medium text-xs md:text-sm truncate">{eventInfo.event.title}</div>
              {location && <div className="text-xs text-white/80 truncate">{location}</div>}
            </div>
          </div>
        </div>
      );
    } else {
      // Week/Day view with more detailed info
      return (
        <div className="w-full h-full overflow-hidden">
          <div className={`flex flex-col h-full py-1 px-2 ${typeColors[eventType]}`}>
            <div className="font-medium text-xs md:text-sm text-white">{eventInfo.event.title}</div>
            {location && (
              <div className="text-xs text-white/80 flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  // Custom toolbar
  const CustomToolbar = () => (
    <div className="flex items-center justify-between mb-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleTodayClick}
          id="today-button"
        >
          Today
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handlePrevClick}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNextClick}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold ml-2">
          {new Intl.DateTimeFormat('en-US', { 
            month: 'long', 
            year: 'numeric',
            ...(calendarView === 'timeGridDay' && { day: 'numeric' }),
            ...(calendarView === 'timeGridWeek' && { day: 'numeric' })
          }).format(currentDate)}
          {calendarView === 'timeGridWeek' && (
            <span> - {new Intl.DateTimeFormat('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: currentDate.getMonth() + 7 > 12 ? 'numeric' : undefined
            }).format(new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000))}</span>
          )}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <CalendarClock className="h-4 w-4 mr-1 text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </span>
      </div>
    </div>
  );

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
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <CustomToolbar />
                <FullCalendar
                  ref={(ref) => {
                    // Update current date when calendar is mounted
                    if (ref) {
                      setCurrentDate(ref.getApi().getDate());
                    }
                  }}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                  initialView={calendarView}
                  headerToolbar={false} // We use our custom header
                  events={events.map(event => ({
                    id: event.id,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    extendedProps: {
                      type: event.type,
                      location: event.location,
                      description: event.description,
                      created_by: event.created_by
                    }
                  }))}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  editable={userCanCreate}
                  eventDrop={handleEventDrop}
                  eventResize={handleEventResize}
                  eventContent={eventContent}
                  height="auto"
                  firstDay={0} // Start week on Sunday
                  nowIndicator={true}
                  dayMaxEvents={true}
                  slotMinTime="07:00:00"
                  slotMaxTime="22:00:00"
                  allDaySlot={true}
                  allDayText="All day"
                  slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: 'short'
                  }}
                  datesSet={(dateInfo) => {
                    setCurrentDate(dateInfo.view.currentStart);
                  }}
                  eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: 'short'
                  }}
                  views={{
                    dayGridMonth: {
                      dayMaxEventRows: 3,
                      titleFormat: { month: 'long', year: 'numeric' }
                    },
                    timeGridWeek: {
                      titleFormat: { month: 'long', year: 'numeric' },
                      slotDuration: '00:30:00',
                      slotLabelInterval: '01:00'
                    },
                    timeGridDay: {
                      titleFormat: { month: 'long', day: 'numeric', year: 'numeric' },
                      slotDuration: '00:30:00',
                      slotLabelInterval: '01:00'
                    },
                    listWeek: {
                      titleFormat: { month: 'long', year: 'numeric' },
                      listDayFormat: { weekday: 'long', month: 'short', day: 'numeric' },
                      listDaySideFormat: false
                    }
                  }}
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
      </main>
      <Footer />
    </div>
  );
};

export default CalendarPage;
