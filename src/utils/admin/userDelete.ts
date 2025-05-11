
import { supabase } from '@/integrations/supabase/client';

/**
 * Marks a user as deleted in the database
 * @param userId The ID of the user to delete
 * @returns boolean indicating success or failure
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    console.log(`Marking user ${userId} as deleted`);
    
    // Update the user's status to 'deleted' in the profiles table
    const { error } = await supabase
      .rpc('update_user_status', { 
        p_user_id: userId, 
        p_status: 'deleted' 
      });
    
    if (error) {
      console.error('Error marking user as deleted:', error);
      return false;
    }
    
    console.log(`User ${userId} successfully marked as deleted`);
    
    // Dispatch a custom event that the user was deleted
    // This allows components to update their UI without a full page refresh
    const event = new CustomEvent('user:deleted', {
      detail: { userId }
    });
    window.dispatchEvent(event);
    
    return true;
  } catch (err) {
    console.error('Unexpected error in deleteUser utility:', err);
    return false;
  }
}
