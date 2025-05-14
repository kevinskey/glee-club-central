
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { MonthlyCalendar } from "@/components/dashboard/MonthlyCalendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ViewEventModal } from "@/components/calendar/ViewEventModal";
import { EventModal } from "@/components/calendar/EventModal";
import { CalendarEditTools } from "@/components/calendar/CalendarEditTools";
import { useCalendarStore } from "@/hooks/useCalendarStore";
import { toast } from "sonner";
import { CalendarEvent } from "@/types/calendar";
import { usePermissions } from "@/hooks/usePermissions";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // Example events - in a real app, these would come from your API or database
  const events = [
    { 
      id: "1", 
      title: "Spring Concert", 
      date: new Date(2025, 4, 17), 
      time: "7:00 PM",
      location: "Sisters Chapel",
      type: "concert",
      start: new Date(2025, 4, 17),
      end: new Date(2025, 4, 17)
    },
    { 
      id: "2", 
      title: "Rehearsal", 
      date: new Date(2025, 4, 14), 
      time: "5:00 PM",
      location: "Fine Arts Building",
      type: "rehearsal",
      start: new Date(2025, 4, 14),
      end: new Date(2025, 4, 14)
    },
    {
      id: "3",
      title: "Soprano Sectional",
      date: new Date(2025, 4, 15),
      time: "4:30 PM",
      location: "Practice Room 2",
      type: "sectional",
      start: new Date(2025, 4, 15),
      end: new Date(2025, 4, 15)
    }
  ];

  // Current date for calendar
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const { isSuperAdmin } = usePermissions();
  
  // Allow editing for all users on this page
  const userCanEdit = true;
  
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
  const eventsForSelectedDate = date ? events.filter(event => 
    event.date.getFullYear() === date.getFullYear() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getDate() === date.getDate()
  ) : [];

  // Handle opening the event modal
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  // Handle adding event
  const handleAddEvent = async (eventData: any) => {
    toast.success("Event created successfully");
    setIsCreateModalOpen(false);
  };

  // Handle updating event
  const handleUpdateEvent = async (eventData: CalendarEvent): Promise<boolean | void> => {
    toast.success("Event updated successfully");
    setIsViewModalOpen(false);
    return true;
  };

  // Handle deleting event
  const handleDeleteEvent = async (eventId: string): Promise<boolean | void> => {
    toast.success("Event deleted successfully");
    setIsViewModalOpen(false);
    return true;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Glee Club Calendar"
        description="View upcoming rehearsals, performances and events"
        icon={<CalendarIcon className="h-6 w-6" />}
      />
      
      {/* Add Calendar Edit Tools */}
      <CalendarEditTools 
        onAddEvent={() => setIsCreateModalOpen(true)}
        selectedEventId={selectedEvent?.id}
        onEditSelected={() => isViewModalOpen && setIsViewModalOpen(true)}
        onDeleteSelected={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}
        className="mb-4"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar widget */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyCalendar
              month={currentMonth} 
              year={currentYear}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              events={events}
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
                  <div key={event.id} className="border rounded-lg p-3 cursor-pointer" onClick={() => handleEventClick(event)}>
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
              <Button className="w-full" variant="outline">
                View All Events
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
  );
}
