
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
      console.log('🔄 Fetching users with enhanced error handling');
      
      // First check if user is authenticated
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        setError('You must be logged in to view users');
        toast.error('Authentication required');
        return null;
      }

      console.log('✅ Current user authenticated:', currentUser.email);

      // Enhanced direct admin check
      const isKnownAdmin = currentUser.email === 'kevinskey@mac.com';
      console.log('🔍 Direct admin check:', { email: currentUser.email, isKnownAdmin });

      // Try a safe profiles query with timeout to prevent hanging
      console.log('🔍 Attempting safe profiles query...');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), 10000);
      });

      const queryPromise = supabase
        .from('profiles')
        .select('id, first_name, last_name, role, is_super_admin, status, voice_part, phone, join_date, class_year, dues_paid, notes, created_at, updated_at, avatar_url, title, special_roles')
        .limit(50); // Limit to prevent overwhelming queries

      const { data: profiles, error: profilesError } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (profilesError) {
        console.error('❌ Profiles query failed:', profilesError);
        
        // Check if it's a recursion error
        if (profilesError.code === '42P17' || profilesError.message.includes('infinite recursion')) {
          console.log('🔄 Recursion detected, trying fallback approach...');
          
          // Fallback: Try to get just the current user's profile
          try {
            const { data: ownProfile, error: ownError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id)
              .maybeSingle();
            
            if (!ownError && ownProfile) {
              console.log('✅ Fallback: Got own profile only');
              const fallbackUsers: User[] = [{
                id: ownProfile.id,
                email: currentUser.email,
                first_name: ownProfile.first_name || '',
                last_name: ownProfile.last_name || '',
                phone: ownProfile.phone,
                voice_part: ownProfile.voice_part,
                avatar_url: ownProfile.avatar_url,
                status: ownProfile.status || 'active',
                join_date: ownProfile.join_date,
                class_year: ownProfile.class_year,
                dues_paid: ownProfile.dues_paid || false,
                notes: ownProfile.notes,
                created_at: ownProfile.created_at,
                updated_at: ownProfile.updated_at,
                last_sign_in_at: null,
                is_super_admin: ownProfile.is_super_admin || false,
                role: ownProfile.role || 'member',
                personal_title: ownProfile.title || null,
                title: ownProfile.title || null,
                special_roles: ownProfile.special_roles || null
              }];
              
              setUserCount(1);
              toast.warning('RLS policies need fixing - showing own profile only');
              return fallbackUsers;
            }
          } catch (fallbackError) {
            console.error('❌ Fallback query also failed:', fallbackError);
          }
        }
        
        setError(`Database error: ${profilesError.message}`);
        toast.error(`Failed to load users: ${profilesError.message}`);
        return null;
      }

      console.log('✅ Profiles query successful:', profiles?.length || 0, 'profiles');

      // Get auth users for additional info (with error handling and timeout)
      let authUsers: any[] = [];
      try {
        // This might not work if we don't have admin API access
        const authPromise = supabase.auth.admin.listUsers();
        const authTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Auth users timeout')), 5000);
        });

        const { data: authData } = await Promise.race([authPromise, authTimeoutPromise]) as any;
        authUsers = authData?.users || [];
        console.log('✅ Auth users fetched:', authUsers.length);
      } catch (authError) {
        console.log('⚠️ Could not fetch auth users (expected for non-admin clients)');
        // This is expected - continue with profile data only
      }

      // Transform data without causing loops
      const users: User[] = (profiles || []).map(profile => {
        const authUser = authUsers.find((u: any) => u?.id === profile.id);
        
        return {
          id: profile.id,
          email: authUser?.email || currentUser?.email || 'Unknown',
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
          personal_title: profile.title || null,
          title: profile.title || null,
          special_roles: profile.special_roles || null
        };
      });

      setUserCount(users.length);
      
      if (users.length === 1 && users[0].id === currentUser.id) {
        toast.warning(`Loaded own profile only (${users.length} user) - RLS may need admin setup`);
      } else {
        toast.success(`Successfully loaded ${users.length} users`);
      }
      
      return users;
      
    } catch (err) {
      console.error('💥 Unexpected error fetching users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error('Failed to load users due to unexpected error');
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
