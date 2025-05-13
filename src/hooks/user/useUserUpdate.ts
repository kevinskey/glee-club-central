
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';
import { toast } from 'sonner';

interface UseUserUpdateResponse {
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  updateUserStatus: (userId: string, status: string) => Promise<boolean>;
}

export const useUserUpdate = (refreshUsers?: () => Promise<any>): UseUserUpdateResponse => {
  const updateUser = useCallback(async (userId: string, userData: Partial<User>) => {
    try {
      console.log(`Updating user ${userId} with data:`, userData);
      
      if (!userData) {
        console.log("No data provided for update, skipping");
        return true;
      }
      
      // Filter out undefined values to avoid issues with the database
      const filteredData: Record<string, any> = {};
      Object.entries(userData).forEach(([key, value]) => {
        // Only include properties that are defined
        if (value !== undefined) {
          // For date fields that come as strings, ensure proper format
          if (key === 'join_date' && value) {
            filteredData[key] = value;
          } else {
            filteredData[key] = value;
          }
        }
      });
      
      // Convert role field to is_super_admin
      if (userData.role === 'admin') {
        filteredData.is_super_admin = true;
      } else if (userData.role === 'member') {
        filteredData.is_super_admin = false;
      }
      
      console.log("Filtered data for update:", filteredData);
      
      const { error } = await supabase
        .from('profiles')
        .update(filteredData)
        .eq('id', userId);

      if (error) {
        console.error('Error updating user:', error);
        toast.error(`Failed to update user: ${error.message}`);
        return false;
      }

      console.log('User updated successfully');
      return true;
    } catch (err) {
      console.error('Unexpected error updating user:', err);
      toast.error('An unexpected error occurred while updating the user');
      return false;
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: string) => {
    try {
      console.log(`Updating user ${userId} status to ${status}`);
      const { error } = await supabase
        .rpc('update_user_status', { 
          p_user_id: userId, 
          p_status: status 
        });

      if (error) {
        console.error('Error updating user status:', error);
        return false;
      }

      console.log('User status updated successfully');
      
      // Refresh the user list after update if a refresh function was provided
      if (refreshUsers) {
        await refreshUsers();
      }
      
      return true;
    } catch (err) {
      console.error('Unexpected error updating user status:', err);
      return false;
    }
  }, [refreshUsers]);

  return {
    updateUser,
    updateUserStatus
  };
};
