
import { useCallback } from 'react';
import { Profile } from '@/types/auth';
import { ensureProfileExists } from '@/utils/supabase/profiles';
import { fetchUserPermissions } from '@/utils/supabase/permissions';
import { AuthState } from './types';

export const useUserDataFetching = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  mountedRef: React.MutableRefObject<boolean>,
  fetchingRef: React.MutableRefObject<boolean>
) => {
  // Fetch user data with concurrency protection and error handling
  const fetchUserData = useCallback(async (userId: string, userEmail?: string, userMetadata?: any) => {
    if (!mountedRef.current || fetchingRef.current) return;
    
    console.log(`📡 useUserDataFetching: STARTING DATA FETCH for user: ${userId}, email: ${userEmail}`);
    
    fetchingRef.current = true;
    
    // Set loading state immediately
    setState(prev => ({
      ...prev,
      isLoading: true
    }));
    
    let profile: Profile | null = null;
    let permissions = {};
    
    try {
      console.log('📋 useUserDataFetching: Ensuring profile exists...');
      
      // Ensure profile exists with timeout protection
      profile = await Promise.race([
        ensureProfileExists(userId, userEmail, userMetadata),
        new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error('Profile fetch timeout')), 8000);
        })
      ]);
      
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
      console.warn(`⚠️ useUserDataFetching: No profile found for user ${userId}, using fallback`);
      // Create a minimal fallback profile to prevent infinite loading
      profile = {
        id: userId,
        first_name: userMetadata?.first_name || 'User',
        last_name: userMetadata?.last_name || '',
        role: 'member',
        status: 'active',
        is_super_admin: userEmail === 'kevinskey@mac.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    // Validate and fix profile role if needed
    if (!profile.role) {
      console.warn(`⚠️ useUserDataFetching: Role undefined for profile ${profile.id}, setting default`);
      profile.role = 'member';
    }
    
    // Fetch permissions with timeout protection
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
    
    fetchingRef.current = false;
  }, [setState, mountedRef, fetchingRef]);

  return { fetchUserData };
};
