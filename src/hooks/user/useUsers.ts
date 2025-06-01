
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

  const fetchUsersWithFallback = useCallback(async (): Promise<User[] | null> => {
    console.log('Attempting to fetch users with RLS fallback handling');
    
    try {
      // First try the normal profiles query
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('last_name', { ascending: true });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        
        // Check if this is the RLS recursion error
        if (profilesError.code === '42P17' || profilesError.message.includes('infinite recursion')) {
          console.log('RLS recursion detected, attempting admin bypass');
          
          // Try to get current user to check if they're admin
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user?.email === 'kevinskey@mac.com') {
            console.log('Admin user detected, attempting direct auth.users fetch');
            
            // For admin users, try to get users from auth.users directly
            try {
              const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
              
              if (authError) {
                console.error('Admin listUsers failed:', authError);
                throw authError;
              }
              
              // Transform auth users to our User format
              const users: User[] = (authData?.users || []).map(authUser => ({
                id: authUser.id,
                email: authUser.email || '',
                first_name: authUser.user_metadata?.first_name || '',
                last_name: authUser.user_metadata?.last_name || '',
                phone: authUser.user_metadata?.phone || null,
                voice_part: authUser.user_metadata?.voice_part || '',
                avatar_url: authUser.user_metadata?.avatar_url || null,
                status: 'active',
                join_date: authUser.created_at,
                class_year: authUser.user_metadata?.class_year || null,
                dues_paid: false,
                notes: null,
                created_at: authUser.created_at,
                updated_at: authUser.updated_at || authUser.created_at,
                last_sign_in_at: authUser.last_sign_in_at,
                is_super_admin: authUser.email === 'kevinskey@mac.com',
                role: authUser.email === 'kevinskey@mac.com' ? 'admin' : 'member',
                personal_title: authUser.user_metadata?.title || null,
                title: authUser.user_metadata?.title || null,
                special_roles: null
              }));
              
              console.log('Successfully fetched users via admin bypass:', users.length);
              return users;
              
            } catch (adminError) {
              console.error('Admin bypass failed:', adminError);
              // Fall through to show error
            }
          }
          
          // Show specific error for RLS recursion
          setError('Database policy error detected. Please contact system administrator.');
          toast.error('Unable to load users due to database configuration issue');
          return [];
        }
        
        setError(profilesError.message);
        toast.error('Failed to load users');
        return null;
      }

      console.log('Successfully fetched profiles:', profiles?.length || 0);

      // Get auth users for email addresses
      let authUsers: any[] = [];
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error('Error fetching auth users:', authError);
        } else {
          authUsers = authData?.users || [];
          console.log('Auth users fetched:', authUsers.length);
        }
      } catch (err) {
        console.error('Error accessing auth users:', err);
      }

      // Transform the data to match User interface
      const users: User[] = (profiles || []).map(profile => {
        const authUser = authUsers.find((u: any) => u?.id === profile.id);
        
        const user: User = {
          id: profile.id,
          email: authUser?.email || null,
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

        return user;
      });

      console.log('Total users processed:', users.length);
      setUserCount(users.length);
      return users;
      
    } catch (err) {
      console.error('Unexpected error fetching users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to load users');
      return null;
    }
  }, []);

  const fetchUsers = useCallback(async (): Promise<User[] | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchUsersWithFallback();
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsersWithFallback]);

  const getUserCount = useCallback(async (): Promise<number> => {
    try {
      // Try normal count first
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        // If RLS recursion, try admin bypass
        if (countError.code === '42P17') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email === 'kevinskey@mac.com') {
            try {
              const { data: authData } = await supabase.auth.admin.listUsers();
              return authData?.users?.length || 0;
            } catch {
              return 0;
            }
          }
        }
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
        .neq('status', 'deleted')
        .single();

      if (fetchError) {
        console.error('Error fetching user by ID:', fetchError);
        return null;
      }

      if (!data) return null;

      // Get auth user for email
      let authUser: any = null;
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);
        if (!authError) {
          authUser = authData?.user;
        }
      } catch (err) {
        console.error('Error fetching auth user:', err);
      }
      
      return {
        id: data.id,
        email: authUser?.email || null,
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
        role: data.role || 'member',
        personal_title: data.title,
        title: data.title,
        special_roles: data.special_roles
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
