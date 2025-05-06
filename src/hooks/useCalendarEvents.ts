
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CalendarEvent {
  id: number | string;
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string | null;
  type: "concert" | "rehearsal" | "tour" | "special";
  image_url?: string | null;
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch events from Supabase
  const fetchEvents = async () => {
    setLoading(true);
    try {
      if (!user) {
        // Use sample data if not authenticated
        setEvents(getSampleEvents());
        return;
      }

      // Using explicit type casting to handle the TypeScript limitations
      const { data, error } = await supabase
        .from("calendar_events" as any)
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching calendar events:", error);
        toast.error("Failed to load calendar events");
        // Fall back to sample data
        setEvents(getSampleEvents());
        return;
      }

      if (data) {
        // Cast data to any first to avoid TypeScript errors
        const typedData = data as any[];
        
        const formattedEvents = typedData.map(event => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date),
          time: event.time,
          location: event.location,
          description: event.description || "",
          type: event.type,
          image_url: event.image_url
        }));
        
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error("Error in fetchEvents:", err);
      setEvents(getSampleEvents());
    } finally {
      setLoading(false);
    }
  };

  // Add a new event
  const addEvent = async (event: Omit<CalendarEvent, "id">) => {
    try {
      if (!user) {
        toast.error("You must be logged in to save events");
        return null;
      }

      const newEvent = {
        ...event,
        user_id: user.id,
        date: event.date.toISOString().split('T')[0]
      };

      // Using explicit type casting
      const { data, error } = await supabase
        .from("calendar_events" as any)
        .insert([newEvent])
        .select()
        .single();

      if (error) {
        console.error("Error adding event:", error);
        toast.error("Failed to save event");
        return null;
      }

      toast.success("Event saved successfully");
      fetchEvents();
      
      // Cast the result to avoid TypeScript errors
      const typedData = data as any;
      
      return {
        id: typedData.id,
        title: typedData.title,
        date: new Date(typedData.date),
        time: typedData.time,
        location: typedData.location,
        description: typedData.description || "",
        type: typedData.type,
        image_url: typedData.image_url
      };
    } catch (err) {
      console.error("Error in addEvent:", err);
      toast.error("Failed to save event");
      return null;
    }
  };

  // Update an existing event
  const updateEvent = async (event: CalendarEvent) => {
    try {
      if (!user) {
        toast.error("You must be logged in to update events");
        return false;
      }

      // Using explicit type casting
      const { error } = await supabase
        .from("calendar_events" as any)
        .update({
          title: event.title,
          date: event.date.toISOString().split('T')[0],
          time: event.time,
          location: event.location,
          description: event.description,
          type: event.type,
          image_url: event.image_url,
          updated_at: new Date().toISOString()
        })
        .eq("id", event.id);

      if (error) {
        console.error("Error updating event:", error);
        toast.error("Failed to update event");
        return false;
      }

      toast.success("Event updated successfully");
      fetchEvents();
      return true;
    } catch (err) {
      console.error("Error in updateEvent:", err);
      toast.error("Failed to update event");
      return false;
    }
  };

  // Delete an event
  const deleteEvent = async (eventId: string | number) => {
    try {
      if (!user) {
        toast.error("You must be logged in to delete events");
        return false;
      }

      // Using explicit type casting
      const { error } = await supabase
        .from("calendar_events" as any)
        .delete()
        .eq("id", eventId);

      if (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
        return false;
      }

      toast.success("Event deleted successfully");
      fetchEvents();
      return true;
    } catch (err) {
      console.error("Error in deleteEvent:", err);
      toast.error("Failed to delete event");
      return false;
    }
  };

  // Load events on component mount or when user changes
  useEffect(() => {
    fetchEvents();
  }, [user?.id]);

  // Sample/fallback events
  const getSampleEvents = (): CalendarEvent[] => {
    return [
      {
        id: 1,
        title: "Fall Showcase",
        date: new Date(2025, 5, 15),
        time: "7:00 PM - 9:00 PM",
        location: "Sisters Chapel",
        description: "Our annual showcase featuring classical and contemporary pieces.",
        type: "concert",
        image_url: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
      },
      {
        id: 2,
        title: "Holiday Concert",
        date: new Date(2025, 11, 10),
        time: "8:00 PM - 10:00 PM",
        location: "Atlanta Symphony Hall",
        description: "Celebrating the season with festive music and traditional carols.",
        type: "concert",
        image_url: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
      },
      {
        id: 3,
        title: "Spring Tour",
        date: new Date(2026, 2, 5),
        time: "Various Times",
        location: "Various Venues",
        description: "Our annual tour across the southeastern United States.",
        type: "tour",
        image_url: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
      },
      {
        id: 4,
        title: "Commencement Performance",
        date: new Date(2026, 4, 20),
        time: "10:00 AM - 11:30 AM",
        location: "Spelman College Oval",
        description: "Special performance for the graduating class of 2026.",
        type: "special",
        image_url: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
      },
      {
        id: 5,
        title: "Weekly Rehearsal",
        date: new Date(2025, 5, 8),
        time: "6:00 PM - 8:00 PM",
        location: "Music Building, Room 101",
        description: "Regular weekly choir rehearsal.",
        type: "rehearsal"
      },
      {
        id: 6,
        title: "Weekly Rehearsal",
        date: new Date(2025, 5, 22),
        time: "6:00 PM - 8:00 PM",
        location: "Music Building, Room 101",
        description: "Regular weekly choir rehearsal.",
        type: "rehearsal"
      }
    ];
  };

  return {
    events,
    loading,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent
  };
}
