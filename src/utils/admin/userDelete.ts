
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Marks a user as deleted in the database
 * This is a soft delete - we just update the status field
 * 
 * @param userId User ID to mark as deleted
 * @returns Promise<boolean> Success status
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Marking user ${userId} as deleted`);
    
    // Update the user's status to "deleted"
    const { error } = await supabase
      .rpc('update_user_status', { 
        p_user_id: userId,
        p_status: 'deleted'
      });
    
    if (error) {
      console.error("Error marking user as deleted:", error);
      toast.error(`Failed to delete user: ${error.message}`);
      return false;
    }
    
    console.log("User marked as deleted successfully");
    return true;
  } catch (err) {
    console.error("Unexpected error deleting user:", err);
    toast.error("An unexpected error occurred while deleting the user");
    return false;
  }
};
