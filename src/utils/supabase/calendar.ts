
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarEvent } from "@/types/calendar";

export interface PerformanceEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  type?: string;
}

export const resetAllCalendarEvents = async (): Promise<boolean> => {
  try {
    // Delete all calendar events
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .neq('id', 'none');  // This will match all rows
    
    if (error) {
      console.error("Error resetting calendar:", error);
      toast.error("Failed to reset calendar");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in resetAllCalendarEvents:", error);
    toast.error("An error occurred while resetting the calendar");
    return false;
  }
};

export const fetchUpcomingPerformances = async (limit = 3): Promise<PerformanceEvent[]> => {
  try {
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .gte('date', today)  // Get events today or in the future
      .order('date', { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching upcoming performances:", error);
      toast.error("Failed to load upcoming performances");
      return [];
    }
    
    // Transform the data into PerformanceEvent format
    const events: PerformanceEvent[] = data.map((event: any) => {
      // Format the date nicely
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      
      return {
        id: event.id,
        title: event.title,
        date: formattedDate,
        location: event.location || "Location TBA",
        description: event.description || "No description available",
        image: event.image_url || "",
        type: event.type
      };
    });
    
    return events;
  } catch (error) {
    console.error("Error in fetchUpcomingPerformances:", error);
    toast.error("An error occurred while loading upcoming performances");
    return [];
  }
};

export const exportCalendarData = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error("Error exporting calendar data:", error);
      toast.error("Failed to export calendar data");
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in exportCalendarData:", error);
    toast.error("An error occurred while exporting calendar data");
    return [];
  }
};
