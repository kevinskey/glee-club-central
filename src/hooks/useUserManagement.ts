
import { useState } from 'react';
import { Profile } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserFormValues } from '@/components/members/form/userFormSchema';
import adminSupabase from '@/utils/admin/adminSupabase';

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

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch users from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        setUsers(data as User[]);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async (userData: UserFormValues): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First create the auth user
      const { user, error: authError } = await adminSupabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password || Math.random().toString(36).substring(2, 10), // Generate random password if not provided
        user_metadata: {
          first_name: userData.first_name,
          last_name: userData.last_name
        }
      });

      if (authError) {
        throw authError;
      }

      if (!user?.id) {
        throw new Error('Failed to create user account');
      }
      
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
        throw profileError;
      }

      toast.success(`Added ${userData.first_name} ${userData.last_name} successfully!`);
      
      // Refresh the user list
      await fetchUsers();
      return true;
    } catch (err: any) {
      console.error('Error adding user:', err);
      setError(err);
      toast.error(`Failed to add user: ${err.message}`);
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
    updateUser: async () => {}, // To be implemented
    deleteUser: async () => {}, // To be implemented
  };
};
