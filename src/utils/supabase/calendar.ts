
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
