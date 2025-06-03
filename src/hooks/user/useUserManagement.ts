
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  voice_part?: string;
  avatar_url?: string;
  status?: string;
  join_date?: string;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
  is_super_admin?: boolean;
  disabled?: boolean;
  class_year?: string;
  dues_paid?: boolean;
  notes?: string;
}

interface UseUserManagementResponse {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;
  addUser: (userData: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
}

export const useUserManagement = (): UseUserManagementResponse => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 useUserManagement: Fetching users...');
      
      // Get current user to check if admin
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      console.log('✅ Current user authenticated:', currentUser?.email);
      
      if (!currentUser) {
        console.log('❌ No authenticated user found');
        setUsers([]);
        setIsLoading(false);
        return;
      }

      // Fetch profiles using the fixed RLS policies
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          phone,
          voice_part,
          avatar_url,
          status,
          join_date,
          class_year,
          dues_paid,
          notes,
          created_at,
          updated_at,
          is_super_admin,
          role,
          disabled
        `)
        .order('last_name', { ascending: true });

      console.log('📊 Profiles query result:', {
        profilesCount: profiles?.length || 0,
        hasError: !!profilesError,
        errorMessage: profilesError?.message,
        profiles: profiles?.slice(0, 3) // Log first 3 for debugging
      });

      if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError);
        setError(profilesError.message);
        setUsers([]);
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('ℹ️ No profiles found');
        setUsers([]);
        return;
      }

      // Get emails for users if admin or self
      const isCurrentUserAdmin = currentUser.email === 'kevinskey@mac.com' || 
        profiles.find(p => p.id === currentUser.id)?.is_super_admin;
      
      let usersWithEmails: User[];
      
      if (isCurrentUserAdmin) {
        // Admin can fetch all user emails
        try {
          const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
          
          if (authError) {
            console.warn('Could not fetch auth users:', authError);
            // Fallback to profiles only
            usersWithEmails = profiles.map(profile => ({
              id: profile.id,
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              email: profile.id === currentUser.id ? currentUser.email || '' : '',
              phone: profile.phone,
              voice_part: profile.voice_part,
              avatar_url: profile.avatar_url,
              status: profile.status || 'active',
              join_date: profile.join_date,
              class_year: profile.class_year,
              dues_paid: profile.dues_paid || false,
              notes: profile.notes,
              created_at: profile.created_at,
              updated_at: profile.updated_at,
              is_super_admin: profile.is_super_admin || false,
              role: profile.role || 'member',
              disabled: profile.disabled || false,
            }));
          } else {
            // Create a Map from auth users for email lookup
            const authUserMap = new Map<string, string>();
            if (authData?.users) {
              authData.users.forEach((user: any) => {
                authUserMap.set(user.id, user.email || '');
              });
            }
            
            usersWithEmails = profiles.map(profile => ({
              id: profile.id,
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              email: authUserMap.get(profile.id) || '',
              phone: profile.phone,
              voice_part: profile.voice_part,
              avatar_url: profile.avatar_url,
              status: profile.status || 'active',
              join_date: profile.join_date,
              class_year: profile.class_year,
              dues_paid: profile.dues_paid || false,
              notes: profile.notes,
              created_at: profile.created_at,
              updated_at: profile.updated_at,
              is_super_admin: profile.is_super_admin || false,
              role: profile.role || 'member',
              disabled: profile.disabled || false,
            }));
          }
        } catch (authFetchError) {
          console.warn('Auth fetch failed:', authFetchError);
          usersWithEmails = profiles.map(profile => ({
            id: profile.id,
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.id === currentUser.id ? currentUser.email || '' : '',
            phone: profile.phone,
            voice_part: profile.voice_part,
            avatar_url: profile.avatar_url,
            status: profile.status || 'active',
            join_date: profile.join_date,
            class_year: profile.class_year,
            dues_paid: profile.dues_paid || false,
            notes: profile.notes,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            is_super_admin: profile.is_super_admin || false,
            role: profile.role || 'member',
            disabled: profile.disabled || false,
          }));
        }
      } else {
        // Non-admin users can only see their own profile
        usersWithEmails = profiles
          .filter(profile => profile.id === currentUser.id)
          .map(profile => ({
            id: profile.id,
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: currentUser.email || '',
            phone: profile.phone,
            voice_part: profile.voice_part,
            avatar_url: profile.avatar_url,
            status: profile.status || 'active',
            join_date: profile.join_date,
            class_year: profile.class_year,
            dues_paid: profile.dues_paid || false,
            notes: profile.notes,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            is_super_admin: profile.is_super_admin || false,
            role: profile.role || 'member',
            disabled: profile.disabled || false,
          }));
      }

      console.log('✅ Successfully processed users:', usersWithEmails.length);
      setUsers(usersWithEmails);
      
    } catch (err) {
      console.error('💥 Unexpected error fetching users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Failed to load users: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId: string, updates: Partial<User>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update user');
        return false;
      }

      // Refresh users after update
      await refreshUsers();
      return true;
    } catch (err) {
      console.error('Unexpected error updating user:', err);
      toast.error('Failed to update user');
      return false;
    }
  }, [refreshUsers]);

  const addUser = useCallback(async (userData: Partial<User>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([userData]);

      if (error) {
        console.error('Error adding user:', error);
        toast.error('Failed to add user');
        return false;
      }

      // Refresh users after add
      await refreshUsers();
      return true;
    } catch (err) {
      console.error('Unexpected error adding user:', err);
      toast.error('Failed to add user');
      return false;
    }
  }, [refreshUsers]);

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
        return false;
      }

      // Refresh users after delete
      await refreshUsers();
      return true;
    } catch (err) {
      console.error('Unexpected error deleting user:', err);
      toast.error('Failed to delete user');
      return false;
    }
  }, [refreshUsers]);

  return {
    users,
    isLoading,
    error,
    refreshUsers,
    updateUser,
    addUser,
    deleteUser
  };
};
