
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserFormValues } from '@/components/members/form/userFormSchema';
import { toast } from 'sonner';
import { User } from './types';

interface UseUserCreateResponse {
  addUser: (userData: UserFormValues) => Promise<boolean>;
}

export const useUserCreate = (
  setUsers?: React.Dispatch<React.SetStateAction<User[]>>
): UseUserCreateResponse => {
  const addUser = useCallback(async (userData: UserFormValues): Promise<boolean> => {
    try {
      console.log('Adding new user with data:', userData);
      
      if (!userData.email || !userData.password) {
        console.error('Email and password are required to create a user');
        toast.error('Email and password are required');
        return false;
      }
      
      // First, create the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
          }
        }
      });
      
      if (authError) {
        console.error('Error creating user in auth:', authError);
        
        // Handle specific error cases
        if (authError.message.includes('User already registered')) {
          toast.error('A user with this email already exists');
        } else if (authError.message.includes('Database error')) {
          toast.error('Database error occurred. Please try again.');
        } else {
          toast.error(authError.message || 'Failed to create user account');
        }
        return false;
      }
      
      if (!authData.user) {
        console.error('No user returned from auth signup');
        toast.error('Failed to create user');
        return false;
      }
      
      // Wait a moment to ensure the user is properly created
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine admin status from role
      const isAdmin = userData.role === 'admin' || userData.is_admin;
      
      // Update the profile with additional data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone || null,
          voice_part: userData.voice_part,
          status: 'active',
          class_year: userData.class_year || null,
          notes: userData.notes || null,
          dues_paid: userData.dues_paid || false,
          join_date: userData.join_date || new Date().toISOString().split('T')[0],
          is_super_admin: isAdmin,
          role: isAdmin ? 'admin' : 'member',
          avatar_url: userData.avatar_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id);
      
      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast.error('User created but profile update failed');
        // Still return true since the user was created successfully
      } else {
        console.log('User added successfully with ID:', authData.user.id);
        toast.success(`Added ${userData.first_name} ${userData.last_name}`);
      }
      
      // Dispatch event for user added
      const userAddedEvent = new CustomEvent('user:added', {
        detail: { userId: authData.user.id }
      });
      window.dispatchEvent(userAddedEvent);
      
      // Add the user to local state immediately if setUsers function is provided
      if (setUsers) {
        const newUser: User = {
          id: authData.user.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone || null,
          voice_part: userData.voice_part,
          status: 'active',
          created_at: new Date().toISOString(),
          class_year: userData.class_year,
          notes: userData.notes,
          dues_paid: userData.dues_paid,
          is_super_admin: isAdmin,
          role: isAdmin ? 'admin' : 'member',
          join_date: userData.join_date,
          avatar_url: userData.avatar_url || null
        };
        
        setUsers(currentUsers => [...currentUsers, newUser]);
      }
      
      return true;
    } catch (err) {
      console.error('Unexpected error adding user:', err);
      toast.error('An unexpected error occurred while creating the user');
      return false;
    }
  }, [setUsers]);

  return { addUser };
};
