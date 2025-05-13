
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ViewEventModal } from "@/components/calendar/ViewEventModal";
import { fetchUpcomingPerformances } from "@/utils/supabase/calendar";
import { CalendarEvent, EventType } from "@/types/calendar";
import { Spinner } from "@/components/ui/spinner";

export function UpcomingEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Fetch upcoming events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchUpcomingPerformances(6);
        
        // Transform event data format to match CalendarEvent type
        const transformedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description || "",
          start: new Date(`${event.date}T${event.time || "00:00"}`).toISOString(),
          end: new Date(`${event.date}T${event.time || "00:00"}`).toISOString(),
          location: event.location,
          type: event.type as EventType,
          allDay: event.allday || false,
          image_url: event.image_url || event.image,
          created_by: event.user_id
        }));
        
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error loading upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, []);
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < events.length - 1 ? prev + 1 : prev));
  };
  
  const handleViewEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };
  
  // Function to get event type icon
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "concert":
        return "🎵";
      case "performance":
        return "🎭";
      case "tour":
        return "🚌";
      case "special":
        return "✨";
      default:
        return "🎤";
    }
  };
  
  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <Calendar className="h-12 w-12 mx-auto text-glee-purple opacity-50" />
        <h3 className="mt-4 text-xl font-semibold">No upcoming events</h3>
        <p className="mt-2 text-muted-foreground">
          Check back later for future Glee Club performances
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full py-8">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex >= events.length - 1}
              className="h-8 w-8 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(currentIndex, currentIndex + 3).map((event) => (
            <Card 
              key={event.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewEvent(event)}
            >
              {event.image_url ? (
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-glee-purple text-white">
                      {getEventTypeIcon(event.type)} {event.type}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-r from-glee-purple/20 to-glee-spelman/20 flex items-center justify-center">
                  <div className="text-4xl">{getEventTypeIcon(event.type)}</div>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-glee-purple text-white capitalize">
                      {event.type}
                    </Badge>
                  </div>
                </div>
              )}
              
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold line-clamp-2 mb-2">{event.title}</h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 opacity-70" />
                    <span>{format(new Date(event.start), "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  
                  {!event.allDay && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 opacity-70" />
                      <span>{format(new Date(event.start), "h:mm a")}</span>
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 opacity-70" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            className="border-glee-purple text-glee-purple hover:bg-glee-purple/10"
            onClick={() => window.location.href = "/calendar"}
          >
            <Calendar className="h-4 w-4 mr-2" />
            View All Events
          </Button>
        </div>
      </div>
      
      {/* View Event Modal */}
      {selectedEvent && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-md">
            <ViewEventModal 
              event={selectedEvent} 
              onClose={() => setIsViewModalOpen(false)} 
              onUpdate={async () => {}} // Empty function since we're in read-only mode
              onDelete={async () => {}} // Empty function since we're in read-only mode
              userCanEdit={false} // No editing in public view
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
