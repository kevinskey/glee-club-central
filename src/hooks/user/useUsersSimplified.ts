
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
      console.log('🔄 useUsersSimplified: Starting to fetch users...');
      
      // Check authentication first
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        setError('You must be logged in to view users');
        toast.error('Authentication required');
        return null;
      }

      console.log('✅ Current user authenticated:', currentUser.email);

      // Now try to fetch profiles with the fixed RLS policies
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
          title,
          special_roles
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
        setError(`Database error: ${profilesError.message}`);
        toast.error(`Failed to load users: ${profilesError.message}`);
        return null;
      }

      if (!profiles || profiles.length === 0) {
        console.log('ℹ️ No profiles found in database');
        setUserCount(0);
        toast.info('No user profiles found');
        return [];
      }

      console.log('✅ Successfully fetched profiles:', profiles.length);

      // Get auth users for additional details like email (only for admin)
      let authUsersMap: Record<string, any> = {};
      try {
        // Check if current user is admin to get additional auth data
        if (currentUser.email === 'kevinskey@mac.com') {
          console.log('🔑 Admin user detected, fetching auth data...');
          const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
          
          if (!authError && authData?.users && Array.isArray(authData.users)) {
            // Fix the TypeScript error by properly typing the auth users
            authUsersMap = (authData.users as any[]).reduce((acc: Record<string, any>, user: any) => {
              acc[user.id] = user;
              return acc;
            }, {});
            console.log('📧 Auth users data loaded, count:', Object.keys(authUsersMap).length);
          } else {
            console.warn('⚠️ Could not fetch auth users:', authError?.message);
          }
        } else {
          console.log('ℹ️ Non-admin user, skipping auth data fetch');
        }
      } catch (err) {
        console.warn('⚠️ Could not fetch auth users data:', err);
      }

      // Transform the data to match User interface
      const users: User[] = profiles.map(profile => {
        const authUser = authUsersMap[profile.id];
        
        return {
          id: profile.id,
          email: authUser?.email || currentUser.email || null,
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

      console.log('🎉 Total users processed successfully:', users.length);
      setUserCount(users.length);
      toast.success(`Successfully loaded ${users.length} users`);
      return users;
      
    } catch (err) {
      console.error('💥 Unexpected error fetching users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Failed to load users: ${errorMessage}`);
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
