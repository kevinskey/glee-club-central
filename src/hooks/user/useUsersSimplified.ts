
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SimpleUser {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  voice_part?: string;
  status?: string;
  role?: string;
  is_super_admin?: boolean;
}

interface UseUsersSimplifiedResponse {
  users: SimpleUser[];
  isLoading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  searchUsers: (searchTerm: string) => Promise<SimpleUser[]>;
}

export const useUsersSimplified = (): UseUsersSimplifiedResponse => {
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 useUsersSimplified: Starting to fetch users...');
      
      // Get current user to check if admin
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      console.log('✅ Current user authenticated:', currentUser?.email);
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Fetch profiles using the fixed RLS policies
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          voice_part,
          status,
          role,
          is_super_admin
        `)
        .order('last_name', { ascending: true });

      console.log('📊 Profiles query result:', {
        profilesCount: profiles?.length || 0,
        hasError: !!profilesError,
        errorMessage: profilesError?.message,
        errorCode: profilesError?.code
      });

      if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError);
        setError(profilesError.message);
        
        // Fallback: create a minimal user list with just the current user if admin
        if (currentUser.email === 'kevinskey@mac.com') {
          const fallbackUsers: SimpleUser[] = [
            {
              id: currentUser.id,
              first_name: 'Admin',
              last_name: 'User',
              email: currentUser.email || '',
              role: 'admin',
              status: 'active',
              is_super_admin: true
            }
          ];
          setUsers(fallbackUsers);
        } else {
          setUsers([]);
        }
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('ℹ️ No profiles found');
        // If admin and no profiles, create a fallback
        if (currentUser.email === 'kevinskey@mac.com') {
          const fallbackUsers: SimpleUser[] = [
            {
              id: currentUser.id,
              first_name: 'Admin',
              last_name: 'User',
              email: currentUser.email || '',
              role: 'admin',
              status: 'active',
              is_super_admin: true
            }
          ];
          setUsers(fallbackUsers);
        } else {
          setUsers([]);
        }
        return;
      }

      // Get emails for users by querying auth.users (admin only)
      const isCurrentUserAdmin = currentUser.email === 'kevinskey@mac.com';
      
      let usersWithEmails: SimpleUser[];
      
      if (isCurrentUserAdmin) {
        // Admin can fetch all user emails
        try {
          const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
          
          if (authError) {
            console.warn('Could not fetch auth users:', authError);
            // Fallback to profiles only
            usersWithEmails = profiles.map(profile => ({
              id: profile.id,
              first_name: profile.first_name || 'Unknown',
              last_name: profile.last_name || 'User',
              email: profile.id === currentUser.id ? currentUser.email || '' : '',
              voice_part: profile.voice_part || undefined,
              status: profile.status || undefined,
              role: profile.role || undefined,
              is_super_admin: profile.is_super_admin || false,
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
              first_name: profile.first_name || 'Unknown',
              last_name: profile.last_name || 'User',
              email: authUserMap.get(profile.id) || '',
              voice_part: profile.voice_part || undefined,
              status: profile.status || undefined,
              role: profile.role || undefined,
              is_super_admin: profile.is_super_admin || false,
            }));
          }
        } catch (authFetchError) {
          console.warn('Auth fetch failed:', authFetchError);
          usersWithEmails = profiles.map(profile => ({
            id: profile.id,
            first_name: profile.first_name || 'Unknown',
            last_name: profile.last_name || 'User',
            email: profile.id === currentUser.id ? currentUser.email || '' : '',
            voice_part: profile.voice_part || undefined,
            status: profile.status || undefined,
            role: profile.role || undefined,
            is_super_admin: profile.is_super_admin || false,
          }));
        }
      } else {
        // Non-admin users can only see their own profile
        usersWithEmails = profiles
          .filter(profile => profile.id === currentUser.id)
          .map(profile => ({
            id: profile.id,
            first_name: profile.first_name || 'Unknown',
            last_name: profile.last_name || 'User',
            email: currentUser.email || '',
            voice_part: profile.voice_part || undefined,
            status: profile.status || undefined,
            role: profile.role || undefined,
            is_super_admin: profile.is_super_admin || false,
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

  const searchUsers = useCallback(async (searchTerm: string): Promise<SimpleUser[]> => {
    if (!searchTerm.trim()) {
      return users;
    }

    try {
      console.log('🔍 Searching users with term:', searchTerm);
      
      const searchTermLower = searchTerm.toLowerCase();
      
      // Search in current users list first (client-side filtering)
      const clientSideResults = users.filter(user => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        const voicePart = (user.voice_part || '').toLowerCase();
        const role = (user.role || '').toLowerCase();
        
        return fullName.includes(searchTermLower) || 
               email.includes(searchTermLower) ||
               voicePart.includes(searchTermLower) ||
               role.includes(searchTermLower);
      });

      console.log('🔍 Search completed:', clientSideResults.length, 'results');
      return clientSideResults;
    } catch (err) {
      console.error('❌ Search error:', err);
      // Fallback to client-side search
      return users.filter(user => {
        const searchTermLower = searchTerm.toLowerCase();
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        return fullName.includes(searchTermLower) || email.includes(searchTermLower);
      });
    }
  }, [users]);

  // Set up real-time subscriptions for automatic updates
  useEffect(() => {
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('🔄 Real-time update received:', payload);
          // Refresh users when any change occurs to profiles table
          refreshUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshUsers]);

  return {
    users,
    isLoading,
    error,
    refreshUsers,
    searchUsers
  };
};
