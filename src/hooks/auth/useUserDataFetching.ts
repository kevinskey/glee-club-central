
import { useCallback } from 'react';
import { Profile } from '@/types/auth';
import { getProfile, createFallbackProfile } from '@/utils/supabase/profiles';
import { fetchUserPermissions } from '@/utils/supabase/permissions';
import { AuthState } from './types';

export const useUserDataFetching = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  mountedRef: React.MutableRefObject<boolean>
) => {
  // Fetch user data with enhanced debugging and profile creation fallback
  const fetchUserData = useCallback(async (userId: string, userEmail?: string) => {
    if (!mountedRef.current) return;
    
    console.log(`📡 useUserDataFetching: STARTING DATA FETCH for user: ${userId}, email: ${userEmail}`);
    
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
      
      // If profile is missing, try to create one
      if (!profile) {
        console.log('🔧 useUserDataFetching: Profile missing, attempting to create fallback profile...');
        profile = await createFallbackProfile(userId, userEmail);
        
        if (!profile) {
          console.error(`❌ useUserDataFetching: Profile fetch failed for user ${userId} and could not create fallback`);
          // Set error state but don't completely fail
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
      }
      
    } catch (error) {
      console.warn(`⚠️ useUserDataFetching: Profile fetch failed for user ${userId}, attempting fallback:`, error);
      profile = await createFallbackProfile(userId, userEmail);
      
      if (!profile) {
        console.error(`❌ useUserDataFetching: Profile fetch failed for user ${userId} and could not create fallback`);
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
      console.log('🔄 useUserDataFetching: Created fallback profile:', profile);
    }
    
    // Validate profile role
    if (!profile.role) {
      console.warn(`⚠️ useUserDataFetching: Role undefined for profile ${profile.id}`);
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
        profileIsAdmin: profile?.is_super_admin,
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
  }, [setState, mountedRef]);

  return { fetchUserData };
};
