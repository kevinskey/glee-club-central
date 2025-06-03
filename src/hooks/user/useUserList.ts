
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SimpleUser {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  voice_part?: string;
  status?: string;
  role?: string;
  is_super_admin?: boolean;
  class_year?: string;
  dues_paid?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
}

interface UseUserListResponse {
  users: SimpleUser[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserList = (): UseUserListResponse => {
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 useUserList: Starting to fetch users...');
      
      // Get current user first
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        console.log('❌ No authenticated user found');
        setUsers([]);
        setIsLoading(false);
        return;
      }

      console.log('✅ Current user authenticated:', currentUser.email);

      // Fetch profiles - this should work with the existing RLS policies
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          phone,
          voice_part,
          status,
          role,
          is_super_admin,
          class_year,
          dues_paid,
          notes,
          created_at,
          updated_at,
          avatar_url
        `)
        .order('last_name', { ascending: true });

      console.log('📊 Profiles query result:', {
        profilesCount: profiles?.length || 0,
        hasError: !!profilesError,
        errorMessage: profilesError?.message,
        firstProfile: profiles?.[0]
      });

      if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError);
        setError(profilesError.message);
        toast.error('Failed to load member profiles');
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('ℹ️ No profiles found');
        setUsers([]);
        return;
      }

      // Check if current user is admin
      const currentUserProfile = profiles.find(p => p.id === currentUser.id);
      const isAdmin = currentUser.email === 'kevinskey@mac.com' || 
        currentUserProfile?.is_super_admin || 
        currentUserProfile?.role === 'admin';

      console.log('👤 Admin check:', {
        currentUserEmail: currentUser.email,
        isKnownAdmin: currentUser.email === 'kevinskey@mac.com',
        profileIsAdmin: currentUserProfile?.is_super_admin,
        profileRole: currentUserProfile?.role,
        finalIsAdmin: isAdmin
      });

      let usersWithEmails: SimpleUser[];

      if (isAdmin) {
        // Admin can see all users - try to get emails
        try {
          const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
          
          if (authError || !authData?.users) {
            console.warn('Could not fetch auth users, showing all profiles with limited email access:', authError);
            // Show all profiles with email access limited to current user
            usersWithEmails = profiles.map(profile => ({
              ...profile,
              email: profile.id === currentUser.id ? currentUser.email || '' : 'Email access limited'
            }));
          } else {
            // Success: map emails from auth data to all profiles
            const emailMap = new Map<string, string>();
            authData.users.forEach((user: any) => {
              emailMap.set(user.id, user.email || '');
            });
            
            usersWithEmails = profiles.map(profile => ({
              ...profile,
              email: emailMap.get(profile.id) || 'No email found'
            }));
          }
        } catch (err) {
          console.warn('Auth admin call failed:', err);
          // Fallback: show all profiles with limited email access
          usersWithEmails = profiles.map(profile => ({
            ...profile,
            email: profile.id === currentUser.id ? currentUser.email || '' : 'Email access limited'
          }));
        }
      } else {
        // Non-admin users can only see their own profile
        usersWithEmails = profiles
          .filter(profile => profile.id === currentUser.id)
          .map(profile => ({
            ...profile,
            email: currentUser.email || ''
          }));
      }

      console.log('✅ Successfully processed users:', {
        totalUsers: usersWithEmails.length,
        isAdmin,
        sampleUser: usersWithEmails[0]
      });
      
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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers
  };
};
