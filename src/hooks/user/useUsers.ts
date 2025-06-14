
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
      console.log('🔄 useUsers: Starting to fetch users...');
      
      // Test basic connection first
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      console.log('🧪 Connection test:', { testData, testError });
      
      if (testError) {
        console.error('❌ Basic connection failed:', testError);
        setError(`Connection failed: ${testError.message}`);
        toast.error('Database connection failed');
        return null;
      }

      // Now try to fetch all profiles
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
        setError(profilesError.message);
        toast.error('Failed to load user profiles');
        return null;
      }

      if (!profiles || profiles.length === 0) {
        console.log('ℹ️ No profiles found in database');
        setUserCount(0);
        return [];
      }

      console.log('✅ Successfully fetched profiles:', profiles.length);

      // Get auth users for additional details like email and sign-in times
      let authUsersMap: Record<string, any> = {};
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        console.log('👤 Current user for admin check:', currentUser?.email);
        
        // Only try to get auth.users data if we're an admin user
        if (currentUser?.email === 'kevinskey@mac.com') {
          console.log('🔑 Admin user detected, fetching auth data...');
          const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
          
          if (!authError && authData?.users && Array.isArray(authData.users)) {
            const typedUsers = authData.users as Array<{ 
              id: string; 
              email?: string; 
              last_sign_in_at?: string; 
              [key: string]: any 
            }>;
            authUsersMap = typedUsers.reduce((acc: Record<string, any>, user) => {
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

  const getUserCount = useCallback(async (): Promise<number> => {
    try {
      console.log('📊 Getting user count...');
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error getting user count:', countError);
        return 0;
      }

      console.log('📊 User count:', count);
      return count || 0;
    } catch (err) {
      console.error('Unexpected error getting user count:', err);
      return 0;
    }
  }, []);

  const getUserById = useCallback(async (userId: string): Promise<User | null> => {
    try {
      console.log('👤 Fetching user by ID:', userId);
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching user by ID:', fetchError);
        return null;
      }

      if (!data) return null;

      // Get auth user for email if we're admin
      let authUser: any = null;
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (currentUser?.email === 'kevinskey@mac.com') {
          const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);
          if (!authError) {
            authUser = authData?.user;
          }
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
