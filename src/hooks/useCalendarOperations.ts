
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarEvent } from "./useCalendarEvents";

export function useCalendarOperations(refreshEvents: () => Promise<void>) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Add a new event
  const addEvent = async (event: Omit<CalendarEvent, "id">) => {
    setIsProcessing(true);
    try {
      if (!event.date) {
        toast.error("Event date is required");
        return null;
      }

      const newEvent = {
        title: event.title,
        date: event.date.toISOString().split('T')[0],
        time: event.time,
        location: event.location,
        description: event.description,
        type: event.type,
        image_url: event.image_url
      };

      const { data, error } = await supabase
        .from("calendar_events")
        .insert([newEvent])
        .select();

      if (error) {
        console.error("Error adding event:", error);
        toast.error("Failed to save event");
        return null;
      }

      toast.success("Event saved successfully");
      await refreshEvents();
      
      if (data && data[0]) {
        return {
          id: data[0].id,
          title: data[0].title,
          date: new Date(data[0].date),
          time: data[0].time,
          location: data[0].location,
          description: data[0].description || "",
          type: data[0].type as "concert" | "rehearsal" | "tour" | "special",
          image_url: data[0].image_url
        };
      }
      return null;
    } catch (err) {
      console.error("Error in addEvent:", err);
      toast.error("Failed to save event");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Update an existing event
  const updateEvent = async (event: CalendarEvent) => {
    setIsProcessing(true);
    try {
      if (!event.date) {
        toast.error("Event date is required");
        return false;
      }

      const { error } = await supabase
        .from("calendar_events")
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
      await refreshEvents();
      return true;
    } catch (err) {
      console.error("Error in updateEvent:", err);
      toast.error("Failed to update event");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete an event
  const deleteEvent = async (eventId: string | number) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", eventId);

      if (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
        return false;
      }

      toast.success("Event deleted successfully");
      await refreshEvents();
      return true;
    } catch (err) {
      console.error("Error in deleteEvent:", err);
      toast.error("Failed to delete event");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    addEvent,
    updateEvent,
    deleteEvent,
    isProcessing
  };
}
