
import { supabase } from '@/integrations/supabase/client';

// Delete a user (for development, this just updates their status)
export const deleteUser = async (userId: string) => {
  try {
    console.log(`Attempting to delete user with ID: ${userId}`);
    
    if (!userId) {
      console.error('Invalid user ID provided');
      throw new Error('Invalid user ID');
    }
    
    // For development, we'll just update the status to 'deleted'
    const { error, data } = await supabase
      .from('profiles')
      .update({ status: 'deleted' })
      .eq('id', userId)
      .select('id');
      
    if (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.error('User not found or failed to update');
      throw new Error('User not found or failed to delete');
    }
    
    console.log(`Successfully marked user ${userId} as deleted`);
    return { success: true, userId };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(error.message || 'Failed to delete user');
  }
};
