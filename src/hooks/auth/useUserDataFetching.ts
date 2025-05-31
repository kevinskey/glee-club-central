
import { useCallback } from 'react';
import { Profile } from '@/types/auth';
import { getProfile } from '@/utils/supabase/profiles';
import { fetchUserPermissions } from '@/utils/supabase/permissions';
import { AuthState } from './types';

export const useUserDataFetching = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  mountedRef: React.MutableRefObject<boolean>
) => {
  // Create fallback profile
  const createFallbackProfile = useCallback((userId: string): Profile => ({
    id: userId,
    first_name: 'User',
    last_name: '',
    role: 'member',
    status: 'active',
    is_super_admin: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }), []);
  
  // Fetch user data with improved error handling
  const fetchUserData = useCallback(async (userId: string) => {
    if (!mountedRef.current) return;
    
    console.log(`Fetching user data for: ${userId}`);
    
    let profile: Profile | null = null;
    let permissions = {};
    
    try {
      // Fetch profile with timeout
      profile = await Promise.race([
        getProfile(userId),
        new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error('Profile timeout')), 5000);
        })
      ]);
      console.log('Profile fetched:', profile);
    } catch (error) {
      console.warn('Profile fetch failed, using fallback:', error);
      profile = createFallbackProfile(userId);
    }
    
    try {
      // Fetch permissions with timeout
      permissions = await Promise.race([
        fetchUserPermissions(userId),
        new Promise<{}>((_, reject) => {
          setTimeout(() => reject(new Error('Permissions timeout')), 3000);
        })
      ]);
      console.log('Permissions fetched:', permissions);
    } catch (error) {
      console.warn('Permissions fetch failed, using defaults:', error);
      permissions = {
        'view_sheet_music': true,
        'view_calendar': true,
        'view_announcements': true
      };
    }
    
    if (mountedRef.current) {
      setState(prev => ({
        ...prev,
        profile,
        permissions,
        isLoading: false,
        isInitialized: true
      }));
    }
  }, [createFallbackProfile, setState, mountedRef]);

  return { fetchUserData };
};
