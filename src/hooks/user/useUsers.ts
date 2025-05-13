
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, BaseHookResponse } from './types';

interface UseUsersResponse extends BaseHookResponse {
  users: User[];
  userCount: number;
  fetchUsers: () => Promise<User[]>;
  getUserCount: () => Promise<number>;
  getUserById: (userId: string) => Promise<User | null>;
}

export const useUsers = (): UseUsersResponse => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number>(0);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('[DEBUG] Fetching users from database with RPC call "get_all_users"');
      const { data, error } = await supabase
        .rpc('get_all_users');

      if (error) {
        console.error('[DEBUG] Error fetching users with RPC:', error);
        setError(error.message);
        return [];
      }

      console.log(`[DEBUG] Fetched ${data?.length || 0} users from database`);
      
      if (data) {
        // Process the data to ensure consistent field formats
        const processedData = data.map(user => {
          // Create a consistent User object with all required fields
          // Determine admin status from the role property since the database doesn't provide is_super_admin
          const isAdmin = user.role === 'admin' || user.role === 'administrator';
          
          const processedUser: User = {
            id: user.id,
            email: user.email || null,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            phone: user.phone || null,
            voice_part: user.voice_part || null,
            avatar_url: user.avatar_url || null,
            status: user.status || 'pending',
            last_sign_in_at: user.last_sign_in_at || null,
            created_at: user.created_at || new Date().toISOString(),
            updated_at: null, 
            is_super_admin: isAdmin,
            class_year: null, // Default value if not provided
            join_date: user.join_date || null,
            notes: null, // Default value if not provided
            dues_paid: false, // Default value if not provided
            role: user.role || (isAdmin ? 'admin' : 'member'), // Keep the original role if available
          };
          
          return processedUser;
        });
        
        console.log('[DEBUG] Processed data from DB:', processedData.length, 'users');
        
        setUsers(processedData);
        setUserCount(processedData.length);
        return processedData;
      }
      
      console.log('[DEBUG] No data returned from database');
      return [];
    } catch (err) {
      console.error('[DEBUG] Unexpected error fetching users:', err);
      setError('An unexpected error occurred while fetching users');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error getting user count:', error);
        return 0;
      }
      
      setUserCount(count || 0);
      return count || 0;
    } catch (err) {
      console.error('Unexpected error getting user count:', err);
      return 0;
    }
  }, []);

  const getUserById = useCallback(async (userId: string) => {
    try {
      console.log(`Fetching user with ID: ${userId}`);
      const { data, error } = await supabase
        .rpc('get_user_by_id', { p_user_id: userId });

      if (error) {
        console.error('Error fetching user by ID:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log('No user found with that ID');
        return null;
      }
      
      // Process the user data to add the is_super_admin property based on role
      const userData = data[0];
      const isAdmin = userData.role === 'admin' || userData.role === 'administrator';
      
      // Create a new object with all the original properties plus the computed ones
      const processedUser = {
        ...userData,
        is_super_admin: isAdmin,
        role: userData.role || (isAdmin ? 'admin' : 'member'), // Ensure role is always defined
      };

      return processedUser;
    } catch (err) {
      console.error('Unexpected error getting user by ID:', err);
      return null;
    }
  }, []);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    getUserCount,
    userCount,
    getUserById
  };
};
