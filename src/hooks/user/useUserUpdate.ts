
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
      console.log(`🔄 Updating user ${userId} with data:`, userData);
      
      if (!userData || Object.keys(userData).length === 0) {
        console.log("⚠️ No data provided for update, skipping");
        return true;
      }
      
      // Prepare the update object with only valid database fields
      const updateData: Record<string, any> = {};
      
      // Handle standard profile fields that exist in the database
      if (userData.first_name !== undefined && userData.first_name?.trim()) {
        updateData.first_name = userData.first_name.trim();
      }
      if (userData.last_name !== undefined && userData.last_name?.trim()) {
        updateData.last_name = userData.last_name.trim();
      }
      if (userData.phone !== undefined) {
        updateData.phone = userData.phone?.trim() || null;
      }
      if (userData.voice_part !== undefined) {
        updateData.voice_part = userData.voice_part;
      }
      if (userData.status !== undefined) {
        updateData.status = userData.status;
      }
      if (userData.class_year !== undefined) {
        updateData.class_year = userData.class_year?.trim() || null;
      }
      if (userData.notes !== undefined) {
        updateData.notes = userData.notes?.trim() || null;
      }
      if (userData.join_date !== undefined) {
        updateData.join_date = userData.join_date;
      }
      if (userData.dues_paid !== undefined) {
        updateData.dues_paid = userData.dues_paid;
      }
      
      // Handle role field - this exists in the database
      if (userData.role !== undefined) {
        updateData.role = userData.role;
      }
      
      // Handle is_admin field - map to is_super_admin (which exists in DB)
      if (userData.is_admin !== undefined) {
        updateData.is_super_admin = userData.is_admin;
        // Also set role based on admin status
        if (!updateData.role) {
          updateData.role = userData.is_admin ? 'admin' : 'member';
        }
      }
      
      // Handle role_tags array if provided
      if (userData.role_tags !== undefined) {
        updateData.role_tags = Array.isArray(userData.role_tags) ? userData.role_tags : [];
      }
      
      // Skip title field for now as it might be causing issues
      // if (userData.title !== undefined && userData.title !== 'none') {
      //   updateData.title = userData.title;
      // }
      
      // Handle e-commerce fields if they exist in the database
      if (userData.ecommerce_enabled !== undefined) {
        updateData.ecommerce_enabled = userData.ecommerce_enabled;
      }
      if (userData.account_balance !== undefined) {
        updateData.account_balance = userData.account_balance;
      }
      if (userData.default_shipping_address !== undefined) {
        updateData.default_shipping_address = userData.default_shipping_address?.trim() || null;
      }
      
      console.log("📝 Prepared update data for database:", updateData);
      
      if (Object.keys(updateData).length === 0) {
        console.log("ℹ️ No valid fields to update");
        return true;
      }
      
      // Add updated_at timestamp
      updateData.updated_at = new Date().toISOString();
      
      console.log("🚀 Sending update to Supabase...");
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select();

      if (error) {
        console.error('❌ Supabase error updating user:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        toast.error(`Failed to update user: ${error.message}`);
        return false;
      }

      console.log('✅ User updated successfully:', data);
      toast.success('User updated successfully');

      // Refresh users list if provided
      if (refreshUsers) {
        console.log("🔄 Refreshing users list...");
        await refreshUsers();
      }

      return true;
    } catch (err) {
      console.error('💥 Unexpected error updating user:', err);
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
