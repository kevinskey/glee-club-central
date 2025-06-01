
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

      // Try to fetch profiles directly with email from auth.users
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
        
        // Fallback: create a minimal user list with just the current user
        const fallbackUsers: SimpleUser[] = [
          {
            id: currentUser.id,
            first_name: 'Current',
            last_name: 'User',
            email: currentUser.email || '',
            role: currentUser.email === 'kevinskey@mac.com' ? 'admin' : 'member',
            status: 'active',
            is_super_admin: currentUser.email === 'kevinskey@mac.com'
          }
        ];
        setUsers(fallbackUsers);
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('ℹ️ No profiles found, creating fallback user');
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
        return;
      }

      // Get emails for all users by fetching from auth metadata or admin function
      const usersWithEmails = await Promise.all(
        profiles.map(async (profile) => {
          try {
            // Try to get email from user metadata if available
            const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
            return {
              ...profile,
              email: authUser.user?.email || '',
              first_name: profile.first_name || 'Unknown',
              last_name: profile.last_name || 'User',
            };
          } catch {
            // Fallback if admin call fails
            return {
              ...profile,
              email: profile.id === currentUser.id ? currentUser.email || '' : '',
              first_name: profile.first_name || 'Unknown',
              last_name: profile.last_name || 'User',
            };
          }
        })
      );

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

      // Also try database search for more comprehensive results
      const { data: dbResults, error } = await supabase
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
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,voice_part.ilike.%${searchTerm}%,role.ilike.%${searchTerm}%`)
        .order('last_name', { ascending: true });

      if (!error && dbResults) {
        // Merge and deduplicate results
        const combinedResults = [...clientSideResults];
        dbResults.forEach(dbUser => {
          if (!combinedResults.find(existing => existing.id === dbUser.id)) {
            combinedResults.push({
              ...dbUser,
              first_name: dbUser.first_name || 'Unknown',
              last_name: dbUser.last_name || 'User',
            });
          }
        });
        
        console.log('🔍 Search completed:', combinedResults.length, 'results');
        return combinedResults;
      }

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
