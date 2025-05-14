
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { usePermissions } from "@/hooks/usePermissions";
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
  
  // Handlers for month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prevYear => prevYear - 1);
    } else {
      setCurrentMonth(prevMonth => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prevYear => prevYear + 1);
    } else {
      setCurrentMonth(prevMonth => prevMonth + 1);
    }
  };
  
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
      
      <div className="container mx-auto p-4 space-y-6">
        <PageHeader
          title="Glee Club Calendar"
          description="View upcoming rehearsals, performances and events"
          icon={<CalendarIcon className="h-6 w-6" />}
        />
        
        {/* Highlight the edit tools more prominently */}
        <CalendarEditTools 
          onAddEvent={() => setIsCreateModalOpen(true)}
          selectedEventId={selectedEvent?.id}
          onEditSelected={() => isViewModalOpen && setIsViewModalOpen(true)}
          onDeleteSelected={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}
          className="mb-4 border-glee-purple/20 bg-glee-purple/5"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendar widget */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  {format(new Date(currentYear, currentMonth, 1), 'MMMM yyyy')}
                </span>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  Next
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MonthlyCalendar
                events={transformedEvents}
                className=""
              />
            </CardContent>
          </Card>
          
          {/* Events for selected date */}
          <Card>
            <CardHeader>
              <CardTitle>
                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventsForSelectedDate.length === 0 ? (
                <p className="text-muted-foreground">No events scheduled for this date</p>
              ) : (
                <div className="space-y-4">
                  {eventsForSelectedDate.map((event) => (
                    <div 
                      key={event.id} 
                      className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.time} • {event.location}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            event.type === "concert" ? "default" : 
                            event.type === "rehearsal" ? "secondary" :
                            "outline"
                          }
                        >
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Button 
                  className="w-full bg-glee-purple hover:bg-glee-purple/90" 
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Add Event
                </Button>
              </div>
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
