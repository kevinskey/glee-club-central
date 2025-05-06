import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  MapPin,
  Clock,
  ArrowLeft,
  Plus
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AddEventForm } from "@/components/calendar/AddEventForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  type: "concert" | "rehearsal" | "tour" | "special";
}

// Sample events data - same as what's used in the PerformanceSection
const initialEvents: Event[] = [
  {
    id: 1,
    title: "Fall Showcase",
    date: new Date(2025, 5, 15), // June 15, 2025
    time: "7:00 PM - 9:00 PM",
    location: "Sisters Chapel",
    description: "Our annual showcase featuring classical and contemporary pieces.",
    type: "concert"
  },
  {
    id: 2,
    title: "Holiday Concert",
    date: new Date(2025, 11, 10), // December 10, 2025
    time: "8:00 PM - 10:00 PM",
    location: "Atlanta Symphony Hall",
    description: "Celebrating the season with festive music and traditional carols.",
    type: "concert"
  },
  {
    id: 3,
    title: "Spring Tour",
    date: new Date(2026, 2, 5), // March 5, 2026
    time: "Various Times",
    location: "Various Venues",
    description: "Our annual tour across the southeastern United States.",
    type: "tour"
  },
  {
    id: 4,
    title: "Commencement Performance",
    date: new Date(2026, 4, 20), // May 20, 2026
    time: "10:00 AM - 11:30 AM",
    location: "Spelman College Oval",
    description: "Special performance for the graduating class of 2026.",
    type: "special"
  },
  {
    id: 5,
    title: "Weekly Rehearsal",
    date: new Date(2025, 5, 8), // June 8, 2025
    time: "6:00 PM - 8:00 PM",
    location: "Music Building, Room 101",
    description: "Regular weekly choir rehearsal.",
    type: "rehearsal"
  },
  {
    id: 6,
    title: "Weekly Rehearsal",
    date: new Date(2025, 5, 22), // June 22, 2025
    time: "6:00 PM - 8:00 PM",
    location: "Music Building, Room 101",
    description: "Regular weekly choir rehearsal.",
    type: "rehearsal"
  }
];

export default function CalendarPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  
  // Filter events for the selected date
  const eventsOnSelectedDate = date 
    ? events.filter(event => 
        event.date.getDate() === date.getDate() && 
        event.date.getMonth() === date.getMonth() && 
        event.date.getFullYear() === date.getFullYear()
      )
    : [];
    
  // Get days with events for highlighting in the calendar
  const daysWithEvents = events.map(event => event.date);
  
  // Handle event selection
  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  // Handle adding new event
  const handleAddEvent = (formValues: Omit<Event, "id">) => {
    const newEvent = {
      ...formValues,
      id: events.length + 1,
    };
    
    setEvents([...events, newEvent]);
    setIsAddEventOpen(false);
    
    // If the new event is on the currently selected date, update the calendar
    if (date && 
        formValues.date.getDate() === date.getDate() && 
        formValues.date.getMonth() === date.getMonth() && 
        formValues.date.getFullYear() === date.getFullYear()) {
      setDate(new Date(formValues.date));
    }
  };
  
  // Get badge color based on event type
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
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container py-8 sm:py-10 md:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="mb-4 sm:mb-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-glee-purple" />
              <span>Performance <span className="text-glee-purple">Calendar</span></span>
            </h1>
            <div className="flex items-center gap-3">
              <ThemeToggle variant="toggle" size="sm" />
              <Button 
                onClick={() => setIsAddEventOpen(true)}
                className="bg-glee-purple hover:bg-glee-purple/90 hidden sm:flex"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>
          </div>
          
          {/* Mobile Add Event Button */}
          <div className="flex justify-between sm:hidden mb-4 items-center">
            <ThemeToggle variant="toggle" size="sm" className="ml-auto mr-3" />
            <Button 
              onClick={() => setIsAddEventOpen(true)}
              className="bg-glee-purple hover:bg-glee-purple/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Calendar */}
            <div className="w-full lg:w-1/2">
              <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="mx-auto"
                  modifiers={{
                    event: daysWithEvents
                  }}
                  modifiersStyles={{
                    event: {
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      color: 'var(--glee-purple)'
                    }
                  }}
                  components={{
                    IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                    IconRight: () => <ChevronRight className="h-4 w-4" />,
                  }}
                />
              </div>
            </div>
            
            {/* Event details */}
            <div className="w-full lg:w-1/2">
              <div className="border rounded-lg p-6 h-full bg-white dark:bg-gray-800 shadow-sm">
                {date && (
                  <div className="mb-4">
                    <h2 className="text-xl font-medium mb-1">
                      Events on {format(date, 'MMMM d, yyyy')}
                    </h2>
                    {eventsOnSelectedDate.length === 0 ? (
                      <p className="text-muted-foreground">No events scheduled for this date.</p>
                    ) : (
                      <div className="space-y-4 mt-4">
                        {eventsOnSelectedDate.map((event) => (
                          <div 
                            key={event.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedEvent?.id === event.id 
                                ? 'border-glee-purple bg-glee-purple/5' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                            onClick={() => handleEventSelect(event)}
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-lg">{event.title}</h3>
                              <Badge className={`${getEventTypeColor(event.type)} text-white`}>
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              </Badge>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1 mb-1">
                                <Clock className="h-4 w-4" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            {selectedEvent?.id === event.id && (
                              <p className="mt-3 text-sm">{event.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {selectedEvent && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-xl font-medium mb-3">{selectedEvent.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(selectedEvent.date, 'MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    </div>
                    <p className="text-sm">{selectedEvent.description}</p>
                    
                    {/* Additional actions could go here */}
                    <div className="mt-6 flex gap-3">
                      <Button className="bg-glee-purple hover:bg-glee-purple/90">
                        Add to Calendar
                      </Button>
                      <Button variant="outline">
                        Share Event
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <AddEventForm 
            onAddEvent={handleAddEvent} 
            onCancel={() => setIsAddEventOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
