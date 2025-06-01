
import { useCallback } from 'react';
import { Profile } from '@/types/auth';
import { ensureProfileExists } from '@/utils/supabase/profiles';
import { fetchUserPermissions } from '@/utils/supabase/permissions';
import { AuthState } from './types';

export const useUserDataFetching = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  mountedRef: React.MutableRefObject<boolean>
) => {
  // Fetch user data with enhanced coordination and error handling
  const fetchUserData = useCallback(async (userId: string, userEmail?: string, userMetadata?: any) => {
    if (!mountedRef.current) return;
    
    console.log(`📡 useUserDataFetching: STARTING DATA FETCH for user: ${userId}, email: ${userEmail}`);
    
    // Set loading state immediately
    setState(prev => ({
      ...prev,
      isLoading: true
    }));
    
    let profile: Profile | null = null;
    let permissions = {};
    
    try {
      console.log('📋 useUserDataFetching: Ensuring profile exists...');
      
      // Ensure profile exists with enhanced retry logic
      profile = await ensureProfileExists(userId, userEmail, userMetadata);
      
      console.log('📋 useUserDataFetching: Profile ensure result:', {
        hasProfile: !!profile,
        profileId: profile?.id,
        profileRole: profile?.role,
        profileIsAdmin: profile?.is_super_admin,
        profileStatus: profile?.status,
        profileFirstName: profile?.first_name,
        profileLastName: profile?.last_name
      });
      
    } catch (error) {
      console.error('❌ useUserDataFetching: Profile ensure failed:', error);
      profile = null;
    }
    
    // Final profile validation
    if (!profile) {
      console.error(`❌ useUserDataFetching: Profile ensure failed for user ${userId}, updating state with error`);
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          profile: null,
          permissions: {},
          isLoading: false,
          isInitialized: true
        }));
      }
      return;
    }
    
    // Validate and fix profile role if needed
    if (!profile.role) {
      console.warn(`⚠️ useUserDataFetching: Role undefined for profile ${profile.id}, setting default`);
      profile.role = 'member';
    }
    
    // Fetch permissions with enhanced error handling
    try {
      console.log('🔑 useUserDataFetching: Fetching permissions...');
      permissions = await Promise.race([
        fetchUserPermissions(userId),
        new Promise<{}>((_, reject) => {
          setTimeout(() => reject(new Error('Permissions timeout')), 5000);
        })
      ]);
      console.log('🔑 useUserDataFetching: Permissions fetch COMPLETE:', {
        permissionCount: Object.keys(permissions).length,
        permissions: Object.keys(permissions)
      });
    } catch (error) {
      console.warn('⚠️ useUserDataFetching: Permissions fetch FAILED, using defaults:', error);
      permissions = {
        'view_sheet_music': true,
        'view_calendar': true,
        'view_announcements': true
      };
    }
    
    // Update state with complete data
    if (mountedRef.current) {
      console.log('✅ useUserDataFetching: UPDATING STATE with complete data:', {
        profileId: profile?.id,
        profileRole: profile?.role,
        profileIsAdmin: profile?.is_super_admin,
        profileFirstName: profile?.first_name,
        profileLastName: profile?.last_name,
        permissionCount: Object.keys(permissions).length
      });
      
      setState(prev => ({
        ...prev,
        profile,
        permissions,
        isLoading: false,
        isInitialized: true
      }));
    }
  }, [setState, mountedRef]);

  return { fetchUserData };
};
