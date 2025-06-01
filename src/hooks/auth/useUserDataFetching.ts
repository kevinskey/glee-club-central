
import { useCallback } from 'react';
import { Profile } from '@/types/auth';
import { getProfile, createFallbackProfile } from '@/utils/supabase/profiles';
import { fetchUserPermissions } from '@/utils/supabase/permissions';
import { AuthState } from './types';

export const useUserDataFetching = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  mountedRef: React.MutableRefObject<boolean>
) => {
  // Fetch user data with enhanced coordination and fallback handling
  const fetchUserData = useCallback(async (userId: string, userEmail?: string) => {
    if (!mountedRef.current) return;
    
    console.log(`📡 useUserDataFetching: STARTING DATA FETCH for user: ${userId}, email: ${userEmail}`);
    
    // Set loading state immediately
    setState(prev => ({
      ...prev,
      isLoading: true
    }));
    
    let profile: Profile | null = null;
    let permissions = {};
    let profileFetchAttempts = 0;
    const maxAttempts = 3;
    
    // Enhanced profile fetching with retry logic
    while (profileFetchAttempts < maxAttempts && !profile && mountedRef.current) {
      profileFetchAttempts++;
      
      try {
        console.log(`📋 useUserDataFetching: Profile fetch attempt ${profileFetchAttempts}/${maxAttempts}...`);
        
        profile = await Promise.race([
          getProfile(userId),
          new Promise<null>((_, reject) => {
            setTimeout(() => reject(new Error('Profile timeout')), 5000);
          })
        ]);
        
        console.log('📋 useUserDataFetching: Profile fetch result:', {
          attempt: profileFetchAttempts,
          hasProfile: !!profile,
          profileId: profile?.id,
          profileRole: profile?.role,
          profileIsAdmin: profile?.is_super_admin,
          profileStatus: profile?.status
        });
        
        if (profile) {
          break; // Successfully fetched profile
        }
        
      } catch (error) {
        console.warn(`⚠️ useUserDataFetching: Profile fetch attempt ${profileFetchAttempts} failed:`, error);
        
        // If this is the last attempt, try to create fallback profile
        if (profileFetchAttempts === maxAttempts) {
          console.log('🔧 useUserDataFetching: Max attempts reached, creating fallback profile...');
          try {
            profile = await createFallbackProfile(userId, userEmail);
            if (profile) {
              console.log('✅ useUserDataFetching: Fallback profile created successfully');
            }
          } catch (fallbackError) {
            console.error('❌ useUserDataFetching: Fallback profile creation failed:', fallbackError);
          }
        } else {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // Final profile validation
    if (!profile) {
      console.error(`❌ useUserDataFetching: Profile fetch failed for user ${userId} after ${maxAttempts} attempts`);
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
    
    // Validate profile role
    if (!profile.role) {
      console.warn(`⚠️ useUserDataFetching: Role undefined for profile ${profile.id}`);
      // Set default role if missing
      profile.role = 'member';
    }
    
    // Fetch permissions with retry logic
    try {
      console.log('🔑 useUserDataFetching: Fetching permissions...');
      permissions = await Promise.race([
        fetchUserPermissions(userId),
        new Promise<{}>((_, reject) => {
          setTimeout(() => reject(new Error('Permissions timeout')), 3000);
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
