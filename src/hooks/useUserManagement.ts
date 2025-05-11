
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { toast } from 'sonner';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users from database');
      const { data, error } = await supabase
        .rpc('get_all_users');

      if (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
        return [];
      }

      console.log(`Fetched ${data.length} users`);
      setUsers(data);
      return data;
    } catch (err) {
      console.error('Unexpected error fetching users:', err);
      setError('An unexpected error occurred while fetching users');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (userId: string) => {
    try {
      console.log(`Fetching user with ID: ${userId}`);
      const { data, error } = await supabase
        .rpc('get_user_by_id', { p_user_id: userId });

      if (error) {
        console.error('Error fetching user by ID:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log('No user found with that ID');
        return null;
      }

      return data[0];
    } catch (err) {
      console.error('Unexpected error getting user by ID:', err);
      return null;
    }
  }, []);

  const updateUser = useCallback(async (userId: string, userData: any) => {
    try {
      console.log(`Updating user ${userId} with data:`, userData);
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', userId);

      if (error) {
        console.error('Error updating user:', error);
        return false;
      }

      console.log('User updated successfully');
      
      // Optionally refresh the user list after update
      fetchUsers();
      
      return true;
    } catch (err) {
      console.error('Unexpected error updating user:', err);
      return false;
    }
  }, [fetchUsers]);

  const updateUserRole = useCallback(async (userId: string, role: string) => {
    try {
      console.log(`Updating user ${userId} role to ${role}`);
      const { error } = await supabase
        .rpc('handle_user_role', { 
          p_user_id: userId, 
          p_role: role 
        });

      if (error) {
        console.error('Error updating user role:', error);
        toast.error('Failed to update user role');
        return false;
      }

      console.log('User role updated successfully');
      toast.success('User role updated successfully');
      
      // Refresh the user list after update
      fetchUsers();
      
      return true;
    } catch (err) {
      console.error('Unexpected error updating user role:', err);
      toast.error('An unexpected error occurred');
      return false;
    }
  }, [fetchUsers]);

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
      
      // Refresh the user list after update
      fetchUsers();
      
      return true;
    } catch (err) {
      console.error('Unexpected error updating user status:', err);
      return false;
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      console.log(`Deleting user ${userId}`);
      
      // First, delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error deleting user profile:', profileError);
        return false;
      }
      
      // Optionally, if you have admin access to delete auth users:
      // This would require a Supabase edge function with service role key

      console.log('User deleted successfully');
      
      // Refresh the user list after deletion
      fetchUsers();
      
      return true;
    } catch (err) {
      console.error('Unexpected error deleting user:', err);
      return false;
    }
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    getUserById,
    updateUser,
    updateUserRole,
    updateUserStatus,
    deleteUser
  };
};
