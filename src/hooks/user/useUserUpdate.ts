
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
      
      if (!userData || Object.keys(userData).length === 0) {
        console.log("No data provided for update, skipping");
        return true;
      }
      
      // Filter out undefined values and prepare the update object
      const updateData: Record<string, any> = {};
      
      // Handle role conversion
      if (userData.role !== undefined) {
        updateData.role = userData.role;
        // Also update is_super_admin based on role
        updateData.is_super_admin = userData.role === 'admin';
      }
      
      // Handle other fields
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'role') {
          // Handle special field mappings
          if (key === 'is_admin') {
            updateData.is_super_admin = value;
            updateData.role = value ? 'admin' : 'member';
          } else if (key === 'email') {
            // Skip email updates for now - they require special handling
            console.log('Email updates require special auth handling, skipping for now');
          } else {
            updateData[key] = value;
          }
        }
      });
      
      console.log("Final update data:", updateData);
      
      if (Object.keys(updateData).length === 0) {
        console.log("No valid fields to update");
        return true;
      }
      
      // Add updated_at timestamp
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Error updating user:', error);
        toast.error(`Failed to update user: ${error.message}`);
        return false;
      }

      console.log('User updated successfully:', data);
      toast.success('User updated successfully');

      // Refresh users list if provided
      if (refreshUsers) {
        await refreshUsers();
      }

      return true;
    } catch (err) {
      console.error('Unexpected error updating user:', err);
      toast.error('An unexpected error occurred while updating the user');
      return false;
    }
  }, [refreshUsers]);

  const updateUserStatus = useCallback(async (userId: string, status: string) => {
    try {
      console.log(`Updating user ${userId} status to ${status}`);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Error updating user status:', error);
        toast.error(`Failed to update user status: ${error.message}`);
        return false;
      }

      console.log('User status updated successfully:', data);
      toast.success('User status updated successfully');
      
      // Refresh the user list after update if a refresh function was provided
      if (refreshUsers) {
        await refreshUsers();
      }
      
      return true;
    } catch (err) {
      console.error('Unexpected error updating user status:', err);
      toast.error('An unexpected error occurred while updating user status');
      return false;
    }
  }, [refreshUsers]);

  return {
    updateUser,
    updateUserStatus
  };
};
