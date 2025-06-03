
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserFormValues } from '@/components/members/form/userFormSchema';
import { toast } from 'sonner';
import { User } from './types';

interface UseUserCreateResponse {
  addUser: (userData: UserFormValues) => Promise<boolean>;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useUserCreate = (
  setUsers?: React.Dispatch<React.SetStateAction<User[]>>
): UseUserCreateResponse => {
  const addUser = useCallback(async (userData: UserFormValues): Promise<boolean> => {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        console.log(`Adding user attempt ${attempt + 1}:`, userData.email);
        
        if (!userData.email || !userData.password) {
          console.error('Email and password are required to create a user');
          toast.error('Email and password are required');
          return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          console.error('Invalid email format:', userData.email);
          toast.error('Invalid email format');
          return false;
        }
        
        // Normalize email
        const normalizedEmail = userData.email.trim().toLowerCase();
        console.log('Normalized email:', normalizedEmail);
        
        // Check if user already exists in auth.users by email
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const emailExists = existingUsers.users?.some((user: any) => user.email === normalizedEmail);
        
        if (emailExists) {
          console.error('User with this email already exists in auth');
          toast.error('A user with this email already exists');
          return false;
        }
        
        // Check if user already exists in profiles table
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', normalizedEmail)
          .single();
          
        if (existingProfile) {
          console.error('User with this email already exists in profiles');
          toast.error('A user with this email already exists');
          return false;
        }
        
        // Determine admin status from role
        const isAdmin = userData.role === 'admin' || userData.is_admin;
        
        // Create the user in auth with metadata - ensure email is included
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: userData.password,
          options: {
            data: {
              first_name: userData.first_name,
              last_name: userData.last_name,
              role: isAdmin ? 'admin' : 'member',
              email: normalizedEmail
            }
          }
        });
        
        if (authError) {
          console.error('Error creating user in auth:', authError);
          
          // Check if it's a rate limit error
          if (authError.message.includes('rate limit') || authError.message.includes('429')) {
            attempt++;
            if (attempt < maxRetries) {
              const delay = Math.pow(2, attempt) * 1000; // Reduced delay: 2s, 4s, 8s
              console.log(`Rate limit hit, retrying in ${delay}ms...`);
              await sleep(delay);
              continue;
            }
          }
          
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
        
        console.log('Auth user created with ID:', authData.user.id, 'Email:', authData.user.email);
        
        // Reduced wait time for trigger
        await sleep(500);
        
        // Update the profile with additional data that wasn't in the trigger
        const updateData: any = {
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
        };
        
        console.log('Updating profile with data:', updateData);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', authData.user.id);
        
        if (profileError) {
          console.error('Error updating profile:', profileError);
          toast.error('User created but profile update failed. Please refresh and try editing the user.');
        } else {
          console.log('User added successfully with ID:', authData.user.id);
          toast.success(`Added ${userData.first_name} ${userData.last_name}`);
        }
        
        // Add the user to local state immediately if setUsers function is provided
        if (setUsers) {
          const newUser: User = {
            id: authData.user.id,
            email: normalizedEmail,
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
      } catch (err: any) {
        console.error('Unexpected error adding user:', err);
        
        // Check if it's a rate limit related error
        if (err.message?.includes('rate limit') || err.message?.includes('429')) {
          attempt++;
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000; // Reduced delay
            console.log(`Rate limit error, retrying in ${delay}ms...`);
            await sleep(delay);
            continue;
          }
        }
        
        toast.error('An unexpected error occurred while creating the user');
        return false;
      }
    }
    
    toast.error('Failed to create user after multiple attempts due to rate limiting');
    return false;
  }, [setUsers]);

  return { addUser };
};
