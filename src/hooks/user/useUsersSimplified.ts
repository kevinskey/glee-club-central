
import { useState, useCallback } from 'react';
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

      // Try to fetch profiles directly with minimal fields to avoid recursion
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

      // Convert profiles to simple user format
      const simpleUsers: SimpleUser[] = profiles.map(profile => ({
        id: profile.id,
        first_name: profile.first_name || 'Unknown',
        last_name: profile.last_name || 'User',
        voice_part: profile.voice_part,
        status: profile.status || 'active',
        role: profile.role || 'member',
        is_super_admin: profile.is_super_admin || false
      }));

      console.log('✅ Successfully processed users:', simpleUsers.length);
      setUsers(simpleUsers);
      
    } catch (err) {
      console.error('💥 Unexpected error fetching users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Failed to load users: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    users,
    isLoading,
    error,
    refreshUsers
  };
};
