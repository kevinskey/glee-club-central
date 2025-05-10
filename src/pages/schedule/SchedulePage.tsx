
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { EventList } from "@/components/calendar/EventList";
import { useAuth } from "@/contexts/AuthContext";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

export default function SchedulePage() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const { isAuthenticated, profile } = useAuth();
  
  // Initialize state for calendar
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Get calendar events using the hook
  const { events, loading } = useCalendarEvents();
  
  // Check if user is admin
  const isAdmin = profile?.role === "admin";

  // Get days with events for the calendar
  const daysWithEvents = events.map(event => event.date);
  
  // Helper function to get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "concert":
        return "bg-glee-purple hover:bg-glee-purple/90";
      case "rehearsal":
        return "bg-blue-500 hover:bg-blue-500/90";
      case "tour":
        return "bg-green-500 hover:bg-green-500/90";
      case "special":
        return "bg-amber-500 hover:bg-amber-500/90";
      default:
        return "bg-gray-500 hover:bg-gray-500/90";
    }
  };
  
  // Handle event selection
  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Glee Club Schedule"
          description="Rehearsals, performances, and important dates"
          icon={<Calendar className="h-6 w-6" />}
        />
        
        {isAdmin && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        )}
      </div>
      
      <div className="flex flex-col-reverse md:flex-row gap-6">
        <div className={`${view === "calendar" ? "w-full" : "md:w-1/3 w-full"}`}>
          {view === "calendar" ? (
            <CalendarContainer 
              date={date}
              setDate={setDate}
              daysWithEvents={daysWithEvents}
              loading={loading}
              events={events}
            />
          ) : (
            <EventList 
              date={date}
              events={events}
              selectedEvent={selectedEvent}
              onSelectEvent={handleEventSelect}
              getEventTypeColor={getEventTypeColor}
            />
          )}
        </div>
      </div>
    </div>
  );
}
