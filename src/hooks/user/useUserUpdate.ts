
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
      
      // Prepare the update object with proper field mapping
      const updateData: Record<string, any> = {};
      
      // Handle standard profile fields
      const allowedFields = [
        'first_name', 'last_name', 'phone', 'voice_part', 'status', 
        'class_year', 'notes', 'dues_paid', 'join_date'
      ];
      
      allowedFields.forEach(field => {
        if (userData[field] !== undefined) {
          updateData[field] = userData[field];
        }
      });
      
      // Handle role field mapping
      if (userData.role !== undefined) {
        updateData.role = userData.role;
        // Set is_super_admin based on role
        updateData.is_super_admin = userData.role === 'admin';
      }
      
      // Handle is_admin field (convert to role and is_super_admin)
      // Note: is_admin doesn't exist in DB, we map it to is_super_admin
      if (userData.is_admin !== undefined) {
        updateData.is_super_admin = userData.is_admin;
        updateData.role = userData.is_admin ? 'admin' : 'member';
      }
      
      // Handle role_tags array
      if (userData.role_tags !== undefined) {
        updateData.role_tags = Array.isArray(userData.role_tags) ? userData.role_tags : [];
      }
      
      console.log("Prepared update data:", updateData);
      
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
        console.error('Supabase error updating user:', error);
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
