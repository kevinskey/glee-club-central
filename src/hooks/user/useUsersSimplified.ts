
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';
import { toast } from 'sonner';

interface UseUsersSimplifiedResponse {
  fetchUsers: () => Promise<User[] | null>;
  isLoading: boolean;
  error: string | null;
  userCount: number;
}

export const useUsersSimplified = (): UseUsersSimplifiedResponse => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);

  const fetchUsers = useCallback(async (): Promise<User[] | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users with simplified approach');
      
      // First check if user is authenticated and has admin access
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        setError('You must be logged in to view users');
        return null;
      }

      // Check admin access using the new non-recursive function
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_current_user_admin_simple');
      
      if (adminCheckError) {
        console.error('Admin check failed:', adminCheckError);
        setError('Failed to verify admin access');
        return null;
      }

      if (!isAdmin && currentUser.email !== 'kevinskey@mac.com') {
        setError('Admin access required to view users');
        return null;
      }

      // Try the profiles table query with the fixed RLS policies
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('last_name', { ascending: true });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setError(profilesError.message);
        toast.error('Failed to load users: ' + profilesError.message);
        return null;
      }

      console.log('Successfully fetched profiles:', profiles?.length || 0);

      // Get auth users for additional info (fallback if this fails)
      let authUsers: any[] = [];
      try {
        const { data: authData } = await supabase.auth.admin.listUsers();
        authUsers = authData?.users || [];
      } catch (err) {
        console.log('Could not fetch auth users, continuing with profile data only');
      }

      // Transform data
      const users: User[] = (profiles || []).map(profile => {
        const authUser = authUsers.find((u: any) => u?.id === profile.id);
        
        return {
          id: profile.id,
          email: authUser?.email || profile.id, // Fallback to showing ID if no email
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
          role: profile.role || 'member',
          personal_title: profile.title,
          title: profile.title,
          special_roles: profile.special_roles
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

  return {
    fetchUsers,
    isLoading,
    error,
    userCount
  };
};
