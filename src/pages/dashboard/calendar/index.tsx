
import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MonthlyCalendar from "@/components/dashboard/MonthlyCalendar";
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
import { CalendarPageHeader } from "@/components/calendar/CalendarPageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format, addDays, startOfWeek, startOfDay } from "date-fns";
import { UpcomingEventsList } from "@/components/calendar/UpcomingEventsList";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const isMobile = useIsMobile();
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  
  // Use the calendar store instead of mock data
  const { events, addEvent, updateEvent, deleteEvent, fetchEvents } = useCalendarStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Current date for calendar
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const { isSuperAdmin } = usePermissions();
  
  // Always allow users to create events - for this specific page
  const userCanCreate = true;
  
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

  // Handler for adding event - use the actual store now
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
        end: new Date(eventData.date),
        image_url: eventData.image_url || null
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
  
  // Get upcoming events for list view (next 30 days)
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.start);
      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);
      return eventDate >= today && eventDate <= thirtyDaysLater;
    })
    .sort((a, b) => {
      const dateA = new Date(a.start).getTime();
      const dateB = new Date(b.start).getTime();
      return dateA - dateB;
    });

  return (
    <>
      {/* Add the correct header based on screen size */}
      {isMobile ? <MobileHeader /> : <Header />}
      
      <div className="container mx-auto px-1 py-2 space-y-2 h-full">
        {/* Center the calendar header */}
        <CalendarPageHeader onAddEventClick={() => setIsCreateModalOpen(true)} />
        
        <div className="grid grid-cols-1 gap-1">
          {/* Calendar widget takes full width now */}
          <Card className="col-span-1 border-0 shadow-sm">
            <CardContent className="p-1">
              {/* Tabs for different calendar views */}
              <Tabs defaultValue="month" value={view} onValueChange={(v) => setView(v as 'day' | 'week' | 'month')}>
                <TabsList className="w-full grid grid-cols-3 mb-2">
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
                
                <TabsContent value="day" className="mt-0">
                  <DayView 
                    date={date || new Date()} 
                    events={events}
                    onEventClick={handleEventClick}
                  />
                </TabsContent>
                
                <TabsContent value="week" className="mt-0">
                  <WeekView 
                    date={date || new Date()}
                    events={events}
                    onEventClick={handleEventClick}
                  />
                </TabsContent>
                
                <TabsContent value="month" className="mt-0">
                  <MonthlyCalendar
                    events={events.map(event => ({
                      id: event.id,
                      title: event.title,
                      date: event.date instanceof Date ? event.date : new Date(event.date),
                      type: event.type
                    }))}
                    className="w-full"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming events list */}
        <div className="mt-4">
          <UpcomingEventsList events={upcomingEvents} onEventClick={handleEventClick} />
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
                userCanEdit={userCanCreate}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}

// Day view component for showing a single day's events
const DayView = ({ date, events, onEventClick }: { 
  date: Date, 
  events: CalendarEvent[], 
  onEventClick: (event: CalendarEvent) => void
}) => {
  // Get events for this day
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getFullYear() === date.getFullYear() &&
           eventDate.getMonth() === date.getMonth() &&
           eventDate.getDate() === date.getDate();
  }).sort((a, b) => {
    const timeA = a.time ? new Date(`1970-01-01T${a.time}`).getTime() : 0;
    const timeB = b.time ? new Date(`1970-01-01T${b.time}`).getTime() : 0;
    return timeA - timeB;
  });

  return (
    <div className="py-2">
      <h3 className="text-center font-medium mb-2">{format(date, 'EEEE, MMMM d, yyyy')}</h3>
      <div className="space-y-2">
        {dayEvents.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No events scheduled for today</p>
        ) : (
          dayEvents.map((event) => (
            <div 
              key={event.id} 
              className="p-2 rounded-md border cursor-pointer hover:bg-accent"
              onClick={() => onEventClick(event)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-full min-h-[24px] rounded-full ${getEventTypeColor(event.type)}`} />
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="text-sm text-muted-foreground">
                    {event.time && formatTime(event.time)}
                    {event.location && <> · {event.location}</>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Week view component for showing a week's worth of events
const WeekView = ({ date, events, onEventClick }: { 
  date: Date, 
  events: CalendarEvent[], 
  onEventClick: (event: CalendarEvent) => void
}) => {
  const startDate = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  return (
    <div className="grid grid-cols-7 gap-1 text-center mb-2">
      {/* Day labels */}
      {weekDays.map((day, index) => (
        <div key={index} className="text-xs font-medium">
          {format(day, 'EEE')}
          <div className="text-sm mt-1 rounded-full h-6 w-6 flex items-center justify-center mx-auto">
            {format(day, 'd')}
          </div>
        </div>
      ))}
      
      {/* Events for each day */}
      {weekDays.map((day, index) => {
        const dayEvents = events.filter(event => {
          const eventDate = new Date(event.start);
          return eventDate.getFullYear() === day.getFullYear() &&
            eventDate.getMonth() === day.getMonth() &&
            eventDate.getDate() === day.getDate();
        });
        
        return (
          <div key={`events-${index}`} className="min-h-[80px] border-t pt-1 text-left">
            {dayEvents.slice(0, 2).map(event => (
              <div 
                key={event.id} 
                className={`text-xs mb-1 p-1 rounded truncate cursor-pointer ${getEventTypeBackgroundColor(event.type)}`}
                onClick={() => onEventClick(event)}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-center text-muted-foreground">
                +{dayEvents.length - 2}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Helper functions
const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return time;
  }
};

const getEventTypeColor = (type: string): string => {
  switch (type) {
    case 'concert': return 'bg-glee-purple';
    case 'rehearsal': return 'bg-blue-500';
    case 'sectional': return 'bg-green-500';
    case 'special': return 'bg-amber-500';
    default: return 'bg-gray-500';
  }
};

const getEventTypeBackgroundColor = (type: string): string => {
  switch (type) {
    case 'concert': return 'bg-glee-purple/90 text-white';
    case 'rehearsal': return 'bg-blue-500/90 text-white';
    case 'sectional': return 'bg-green-500/90 text-white';
    case 'special': return 'bg-amber-500/90 text-white';
    default: return 'bg-gray-500/90 text-white';
  }
};
