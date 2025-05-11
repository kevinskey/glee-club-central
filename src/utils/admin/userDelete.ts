
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Delete a user from the system
 * For development purposes, this simply updates the user's status to 'deleted'
 * In production, you would want to implement proper user deletion via backend functions
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
    
    return true;
  } catch (error) {
    console.error("Unexpected error during user deletion:", error);
    return false;
  }
}
