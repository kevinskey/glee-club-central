
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Delete a user from the system
 * This marks a user as deleted rather than actually removing the record
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    console.log("Deleting user with ID:", userId);
    
    // Update the user's status to 'deleted' rather than actually deleting
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'deleted' })
      .eq('id', userId);
      
    if (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
      return false;
    }
    
    // If we reach here, deletion was successful
    console.log("User marked as deleted successfully");
    toast.success("User was deleted successfully");
    
    return true;
  } catch (error) {
    console.error("Unexpected error during user deletion:", error);
    toast.error("An unexpected error occurred");
    return false;
  }
}
