
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PracticeLog {
  id: string;
  user_id: string;
  date: string;
  minutes_practiced: number;
  category: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch all practice logs for the current user
export const fetchUserPracticeLogs = async (): Promise<PracticeLog[]> => {
  try {
    const { data, error } = await supabase
      .from("practice_logs")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    return data as PracticeLog[];
  } catch (error: any) {
    console.error("Error fetching practice logs:", error.message);
    toast.error("Failed to load practice history");
    return [];
  }
};

// Log new practice session
export const logPracticeSession = async (
  minutes: number,
  category: string,
  description: string | null = null,
  date: string = new Date().toISOString().split("T")[0]
): Promise<PracticeLog | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from("practice_logs")
      .insert({
        minutes_practiced: minutes,
        category,
        description,
        date,
        user_id: userData.user.id // Add the user_id here
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("Practice session logged successfully!");
    return data as PracticeLog;
  } catch (error: any) {
    console.error("Error logging practice:", error.message);
    toast.error("Failed to log practice session");
    return null;
  }
};

// Delete a practice log
export const deletePracticeLog = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("practice_logs")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    toast.success("Practice log deleted");
    return true;
  } catch (error: any) {
    console.error("Error deleting practice log:", error.message);
    toast.error("Failed to delete practice log");
    return false;
  }
};

// Update a practice log
export const updatePracticeLog = async (
  id: string,
  updates: Partial<Omit<PracticeLog, "id" | "user_id" | "created_at" | "updated_at">>
): Promise<PracticeLog | null> => {
  try {
    const { data, error } = await supabase
      .from("practice_logs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("Practice log updated");
    return data as PracticeLog;
  } catch (error: any) {
    console.error("Error updating practice log:", error.message);
    toast.error("Failed to update practice log");
    return null;
  }
};

// Get total minutes practiced by category
export const getPracticeStatsByCategory = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from("practice_logs")
      .select("category, minutes_practiced");

    if (error) {
      throw error;
    }

    const stats: Record<string, number> = {};
    data.forEach((item: any) => {
      const category = item.category;
      if (!stats[category]) {
        stats[category] = 0;
      }
      stats[category] += item.minutes_practiced;
    });

    return stats;
  } catch (error: any) {
    console.error("Error fetching practice stats:", error.message);
    return {};
  }
};
