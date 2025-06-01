
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
  
  // Fetch user data with enhanced debugging
  const fetchUserData = useCallback(async (userId: string) => {
    if (!mountedRef.current) return;
    
    console.log(`📡 useUserDataFetching: STARTING DATA FETCH for user: ${userId}`);
    
    let profile: Profile | null = null;
    let permissions = {};
    
    try {
      console.log('📋 useUserDataFetching: Fetching profile from Supabase...');
      // Fetch profile with timeout and enhanced logging
      profile = await Promise.race([
        getProfile(userId),
        new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error('Profile timeout')), 5000);
        })
      ]);
      console.log('📋 useUserDataFetching: Profile fetch COMPLETE:', {
        hasProfile: !!profile,
        profileId: profile?.id,
        profileRole: profile?.role,
        profileIsAdmin: profile?.is_super_admin,
        profileStatus: profile?.status,
        profileData: profile
      });
    } catch (error) {
      console.warn('⚠️ useUserDataFetching: Profile fetch FAILED, using fallback:', error);
      profile = createFallbackProfile(userId);
      console.log('🔄 useUserDataFetching: Created fallback profile:', profile);
    }
    
    try {
      console.log('🔑 useUserDataFetching: Fetching permissions...');
      // Fetch permissions with timeout
      permissions = await Promise.race([
        fetchUserPermissions(userId),
        new Promise<{}>((_, reject) => {
          setTimeout(() => reject(new Error('Permissions timeout')), 3000);
        })
      ]);
      console.log('🔑 useUserDataFetching: Permissions fetch COMPLETE:', {
        permissionCount: Object.keys(permissions).length,
        permissions: Object.keys(permissions),
        permissionsData: permissions
      });
    } catch (error) {
      console.warn('⚠️ useUserDataFetching: Permissions fetch FAILED, using defaults:', error);
      permissions = {
        'view_sheet_music': true,
        'view_calendar': true,
        'view_announcements': true
      };
      console.log('🔄 useUserDataFetching: Using default permissions:', permissions);
    }
    
    if (mountedRef.current) {
      console.log('✅ useUserDataFetching: UPDATING STATE with fetched data:', {
        profileId: profile?.id,
        profileRole: profile?.role,
        permissionCount: Object.keys(permissions).length
      });
      setState(prev => ({
        ...prev,
        profile,
        permissions,
        isLoading: false,
        isInitialized: true
      }));
    } else {
      console.log('⚠️ useUserDataFetching: Component unmounted, skipping state update');
    }
  }, [createFallbackProfile, setState, mountedRef]);

  return { fetchUserData };
};
