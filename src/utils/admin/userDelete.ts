
import { supabase } from '@/integrations/supabase/client';

// Delete a user (for development, this just updates their status)
export const deleteUser = async (userId: string) => {
  try {
    // For development, we'll just update the status to 'deleted'
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'deleted' })
      .eq('id', userId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(error.message || 'Failed to delete user');
  }
};
