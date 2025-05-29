
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';
import { toast } from 'sonner';

interface UseUsersResponse {
  fetchUsers: () => Promise<User[] | null>;
  isLoading: boolean;
  error: string | null;
  userCount: number;
  getUserCount: () => Promise<number>;
  getUserById: (userId: string) => Promise<User | null>;
}

export const useUsers = (): UseUsersResponse => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);

  const fetchUsers = useCallback(async (): Promise<User[] | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users from profiles table');
      
      // Get profiles with auth user data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .neq('status', 'deleted') // Exclude deleted users
        .order('last_name', { ascending: true });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setError(profilesError.message);
        toast.error('Failed to load users');
        return null;
      }

      // Get auth users to get email addresses - with proper typing
      let authUsers: any[] = [];
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error('Error fetching auth users:', authError);
          // Continue without auth data - we'll use profile email if available
        } else {
          authUsers = authData?.users || [];
        }
      } catch (err) {
        console.error('Error accessing auth users:', err);
        // Continue without auth data
      }

      console.log('Successfully fetched profiles:', profiles?.length || 0);
      
      // Transform the data to match User interface
      const users: User[] = (profiles || []).map(profile => {
        // Find corresponding auth user for email - with proper type checking
        const authUser = authUsers.find((u: any) => u?.id === profile.id);
        
        return {
          id: profile.id,
          email: profile.email || authUser?.email || null,
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
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
          last_sign_in_at: authUser?.last_sign_in_at || null,
          is_super_admin: profile.is_super_admin || false,
          role: profile.role || 'member'
        };
      });

      setUserCount(users.length);
      return users;
    } catch (err) {
      console.error('Unexpected error fetching users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to load users');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserCount = useCallback(async (): Promise<number> => {
    try {
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'deleted'); // Exclude deleted users

      if (countError) {
        console.error('Error getting user count:', countError);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.error('Unexpected error getting user count:', err);
      return 0;
    }
  }, []);

  const getUserById = useCallback(async (userId: string): Promise<User | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .neq('status', 'deleted') // Exclude deleted users
        .single();

      if (fetchError) {
        console.error('Error fetching user by ID:', fetchError);
        return null;
      }

      if (!data) return null;

      // Get auth user for email - with proper error handling
      let authUser: any = null;
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);
        if (!authError) {
          authUser = authData?.user;
        }
      } catch (err) {
        console.error('Error fetching auth user:', err);
        // Continue without auth data
      }
      
      return {
        id: data.id,
        email: data.email || authUser?.email || null,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone,
        voice_part: data.voice_part,
        avatar_url: data.avatar_url,
        status: data.status || 'active',
        join_date: data.join_date,
        class_year: data.class_year,
        dues_paid: data.dues_paid || false,
        notes: data.notes,
        created_at: data.created_at,
        updated_at: data.updated_at,
        last_sign_in_at: authUser?.last_sign_in_at || null,
        is_super_admin: data.is_super_admin || false,
        role: data.role || 'member'
      };
    } catch (err) {
      console.error('Unexpected error fetching user by ID:', err);
      return null;
    }
  }, []);

  return {
    fetchUsers,
    isLoading,
    error,
    userCount,
    getUserCount,
    getUserById
  };
};
