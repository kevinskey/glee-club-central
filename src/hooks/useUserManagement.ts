
import { useState, useCallback } from 'react';
import { Profile } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserFormValues } from '@/components/members/form/userFormSchema';
import adminSupabase from '@/utils/admin/adminSupabase';
import { deleteUser } from '@/utils/admin/userDelete';

// Define the User type to match what profile components expect
export interface User extends Omit<Profile, 'created_at'> {
  // Adding created_at as required to match Profile
  created_at: string;
  // Additional fields that might be needed by the components but not in Profile
  email?: string | null;
  last_sign_in_at?: string | null;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    console.log("useUserManagement - fetchUsers called");
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch users from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} profiles`);
      
      if (data) {
        setUsers(data as User[]);
      }
      return data;
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err);
      toast.error('Failed to load users');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addUser = async (userData: UserFormValues): Promise<boolean> => {
    console.log("useUserManagement - addUser called with:", userData);
    setIsLoading(true);
    setError(null);
    
    try {
      // First create the auth user
      const response = await adminSupabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password || Math.random().toString(36).substring(2, 10), // Generate random password if not provided
        user_metadata: {
          first_name: userData.first_name,
          last_name: userData.last_name
        }
      });

      // Extract the user and error from the response based on the correct structure
      const { user, error: authError } = response;
      
      if (authError) {
        console.error("Auth error creating user:", authError);
        throw authError;
      }

      if (!user?.id) {
        throw new Error('Failed to create user account');
      }
      
      console.log("User created successfully, updating profile:", user.id);
      
      // Update the profile with additional data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          role: userData.role,
          voice_part: userData.voice_part,
          status: userData.status,
        })
        .eq('id', user.id);
      
      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }

      toast.success(`Added ${userData.first_name} ${userData.last_name} successfully!`);
      
      // Refresh the user list
      await fetchUsers();
      return true;
    } catch (err: any) {
      console.error('Error adding user:', err);
      setError(err);
      toast.error(`Failed to add user: ${err.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userId: string, userData: Partial<UserFormValues>): Promise<boolean> => {
    console.log("useUserManagement - updateUser called for:", userId);
    setIsLoading(true);
    setError(null);
    
    try {
      // Update the profile with provided data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          role: userData.role,
          voice_part: userData.voice_part,
          status: userData.status,
        })
        .eq('id', userId);
      
      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }

      // If email needs updating, use admin API
      if (userData.email) {
        const response = await adminSupabase.auth.admin.updateUserById(userId, {
          email: userData.email
        });
        
        if (response.error) {
          console.error("Email update error:", response.error);
          throw response.error;
        }
      }

      // If password provided, update it
      if (userData.password && userData.password.trim() !== '') {
        const response = await adminSupabase.auth.admin.updateUserById(userId, {
          password: userData.password
        });
        
        if (response.error) {
          console.error("Password update error:", response.error);
          throw response.error;
        }
      }

      toast.success(`Updated user successfully!`);
      
      // Refresh the user list
      await fetchUsers();
      return true;
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err);
      toast.error(`Failed to update user: ${err.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    console.log("useUserManagement - deleteUser called for:", userId);
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the utility function to delete the user
      const result = await adminSupabase.auth.admin.deleteUser(userId);
      
      if (!result.success) {
        throw new Error('Failed to delete user');
      }
      
      toast.success("User deleted successfully");
      
      // Refresh the user list
      await fetchUsers();
      return true;
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err);
      toast.error(`Failed to delete user: ${err.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  };
};
