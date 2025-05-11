import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserFormValues } from '@/components/members/form/userFormSchema';
import { deleteUser as deleteUserUtil } from '@/utils/admin/userDelete';

// Export the User type so it can be imported by other components
export interface User {
  id: string;
  email?: string | null;
  first_name: string;
  last_name: string;
  phone?: string | null;
  voice_part: string | null;
  role: string;
  avatar_url?: string | null;
  status: string;
  last_login?: string | null;
  last_sign_in_at?: string | null;
  created_at: string;
  updated_at?: string | null;
  is_super_admin?: boolean;
  title?: string;
  class_year?: string;
  join_date?: string;
  special_roles?: string;
  dues_paid?: boolean;
}

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

  const deleteUser = useCallback(async (userId: string) => {
    try {
      console.log(`Deleting user ${userId}`);
      
      // Use the utility function to mark the user as deleted
      const success = await deleteUserUtil(userId);
      
      if (success) {
        console.log('User marked as deleted successfully');
        
        // Update local state to remove the deleted user from the UI immediately
        setUsers(currentUsers => 
          currentUsers.filter(user => user.id !== userId)
        );
        
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Unexpected error deleting user:', err);
      return false;
    }
  }, []);

  // Return only required functions to avoid bloating the hook response
  return {
    users,
    isLoading,
    error,
    fetchUsers,
    deleteUser,
    getUserById: useCallback(async (userId: string) => {
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
    }, []),
    updateUser: useCallback(async (userId: string, userData: any) => {
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
        
        // Refresh the user list after update
        fetchUsers();
        
        return true;
      } catch (err) {
        console.error('Unexpected error updating user:', err);
        return false;
      }
    }, [fetchUsers]),
    updateUserRole: useCallback(async (userId: string, role: string) => {
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
    }, [fetchUsers]),
    updateUserStatus: useCallback(async (userId: string, status: string) => {
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
    }, [fetchUsers]),
    addUser: useCallback(async (userData: UserFormValues): Promise<boolean> => {
      try {
        console.log('Adding new user with data:', userData);
        
        // First, create the user in auth
        let authData, authError;
        
        if (userData.email && userData.password) {
          const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              data: {
                first_name: userData.first_name,
                last_name: userData.last_name,
              }
            }
          });
          
          authData = data;
          authError = error;
        } else {
          console.error('Email and password are required to create a user');
          toast.error('Email and password are required');
          return false;
        }
        
        if (authError) {
          console.error('Error creating user in auth:', authError);
          toast.error(authError.message || 'Failed to create user account');
          return false;
        }
        
        if (!authData.user) {
          console.error('No user returned from auth signup');
          toast.error('Failed to create user');
          return false;
        }
        
        // Then update the profile with additional information
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone || null,
            role: userData.role,
            voice_part: userData.voice_part,
            status: userData.status,
            class_year: userData.class_year || null,
            notes: userData.notes || null,
            special_roles: userData.special_roles || null,
            dues_paid: userData.dues_paid || false,
          })
          .eq('id', authData.user.id);
        
        if (profileError) {
          console.error('Error updating profile:', profileError);
          toast.error('User created but profile update failed');
          // We'll still return true since the user was created
        }
        
        console.log('User added successfully with ID:', authData.user.id);
        toast.success(`Added ${userData.first_name} ${userData.last_name}`);
        
        // Dispatch event for user added
        const userAddedEvent = new CustomEvent('user:added', {
          detail: { userId: authData.user.id }
        });
        window.dispatchEvent(userAddedEvent);
        
        // Add the user to local state immediately
        const newUser: User = {
          id: authData.user.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone || null,
          role: userData.role,
          voice_part: userData.voice_part,
          status: userData.status,
          created_at: new Date().toISOString(),
          class_year: userData.class_year,
          special_roles: userData.special_roles,
          dues_paid: userData.dues_paid
        };
        
        setUsers(currentUsers => [...currentUsers, newUser]);
        
        return true;
      } catch (err) {
        console.error('Unexpected error adding user:', err);
        toast.error('An unexpected error occurred');
        return false;
      }
    }, [])
  };
};
