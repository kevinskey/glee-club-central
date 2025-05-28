
import React, { useState, useEffect } from 'react';
import { PageHeaderWithToggle } from "@/components/ui/page-header-with-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, MapPin, CalendarPlus } from "lucide-react";
import { useCalendarStore } from "@/hooks/useCalendarStore";
import { CalendarEvent } from '@/types/calendar';
import CalendarMain from "@/components/calendar/CalendarMain";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventModal } from "@/components/calendar/EventModal";
import { ViewEventModal } from "@/components/calendar/ViewEventModal";
import { DashboardEventsSkeleton, DashboardCardSkeleton } from "@/components/ui/dashboard-skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { GoogleCalendarAuthIntegrated } from "@/components/calendar/GoogleCalendarAuthIntegrated";
import { GoogleCalendarSync } from "@/components/calendar/GoogleCalendarSync";

export default function CalendarDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<CalendarEvent[]>([]);
  
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
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [fetchEvents]);

  // Combine local events with Google Calendar events
  const allEvents = [...events, ...googleEvents];

  // Get upcoming events (next 30 days)
  const getUpcomingEvents = (events: CalendarEvent[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= today && eventDate <= thirtyDaysLater;
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5);
  };

  const upcomingEvents = getUpcomingEvents(allEvents);

  // Event handlers
  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setIsCreateModalOpen(true);
  };
  
  const handleEventClick = (event: CalendarEvent) => {
    // Only allow editing of local events, not Google Calendar events
    if (event.source === 'google') {
      toast.info("Google Calendar events can only be edited in Google Calendar");
      return;
    }
    
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };
  
  const handleCreateEvent = async (eventData: any) => {
    try {
      await addEvent({
        ...eventData,
        created_by: user?.id
      });
      
      setIsCreateModalOpen(false);
      toast.success("Event created successfully");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };
  
  const handleUpdateEvent = async (eventData: CalendarEvent): Promise<boolean> => {
    try {
      const success = await updateEvent(eventData);
      if (success) {
        setIsViewModalOpen(false);
        setSelectedEvent(null);
        toast.success("Event updated successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return false;
    }
  };
  
  const handleDeleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      const success = await deleteEvent(eventId);
      if (success) {
        setIsViewModalOpen(false);
        setSelectedEvent(null);
        toast.success("Event deleted successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      return false;
    }
  };

  const handleGoogleEventsSync = (syncedEvents: CalendarEvent[]) => {
    setGoogleEvents(syncedEvents);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <DashboardCardSkeleton />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <DashboardEventsSkeleton />
          </div>
          <div className="space-y-6">
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <PageHeaderWithToggle 
          title="Calendar"
          icon={<CalendarIcon className="h-6 w-6" />}
        />
        
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-4 sm:mt-0 bg-glee-spelman hover:bg-glee-spelman/90"
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          {allEvents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-10">
                <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No events scheduled</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Click the "Add Event" button to create your first calendar event.
                </p>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-glee-spelman hover:bg-glee-spelman/90"
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Add Your First Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <CalendarMain
              events={allEvents}
              calendarView="dayGridMonth"
              userCanCreate={true}
              handleDateClick={handleDateClick}
              handleEventClick={handleEventClick}
            />
          )}
        </div>
        
        <div className="space-y-6">
          {/* Google Calendar Integration */}
          <GoogleCalendarAuthIntegrated 
            onConnectionChange={setGoogleCalendarConnected}
          />
          
          {/* Google Calendar Sync */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Google Calendar Sync
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GoogleCalendarSync 
                onEventsSync={handleGoogleEventsSync}
                isConnected={googleCalendarConnected}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="rounded-lg border p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors" 
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{event.title}</h3>
                        {event.source === 'google' && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Google
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {new Date(event.start).toLocaleDateString()}
                        </p>
                        {event.location && (
                          <p className="flex items-center mt-1">
                            <MapPin className="mr-2 h-4 w-4" />
                            {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No upcoming events</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Add Event
              </Button>
              <Button className="w-full" variant="outline">
                View Performance Schedule
              </Button>
              <Button className="w-full" variant="outline">
                Export Calendar (iCal)
              </Button>
            </CardContent>
          </Card>
        </div>
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
}
