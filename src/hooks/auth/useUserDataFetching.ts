
import { useCallback } from 'react';
import { Profile } from '@/types/auth';
import { AuthState } from './types';

export const useUserDataFetching = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  mountedRef: React.MutableRefObject<boolean>,
  fetchingRef: React.MutableRefObject<boolean>
) => {
  // Simplified user data fetching that creates a fallback profile
  const fetchUserData = useCallback(async (userId: string, userEmail?: string, userMetadata?: any) => {
    if (!mountedRef.current || fetchingRef.current) return;
    
    console.log(`📡 useUserDataFetching: STARTING FALLBACK PROFILE CREATION for user: ${userId}, email: ${userEmail}`);
    
    fetchingRef.current = true;
    
    try {
      // Create a minimal fallback profile to avoid database issues
      const fallbackProfile: Profile = {
        id: userId,
        first_name: userMetadata?.first_name || userEmail?.split('@')[0] || 'User',
        last_name: userMetadata?.last_name || '',
        role: 'member',
        status: 'active',
        is_super_admin: userEmail === 'kevinskey@mac.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Basic permissions for all users
      const basicPermissions = {
        'view_sheet_music': true,
        'view_calendar': true,
        'view_announcements': true
      };
      
      console.log('✅ useUserDataFetching: Using fallback profile:', {
        profileId: fallbackProfile.id,
        profileRole: fallbackProfile.role,
        profileIsAdmin: fallbackProfile.is_super_admin,
        profileFirstName: fallbackProfile.first_name,
        profileLastName: fallbackProfile.last_name
      });
      
      // Update state with fallback data
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          profile: fallbackProfile,
          permissions: basicPermissions,
          isLoading: false,
          isInitialized: true
        }));
      }
      
    } catch (error) {
      console.error('❌ useUserDataFetching: Fallback profile creation failed:', error);
      
      // Even if fallback fails, ensure we're not stuck loading
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isInitialized: true
        }));
      }
    } finally {
      fetchingRef.current = false;
    }
  }, [setState, mountedRef, fetchingRef]);

  return { fetchUserData };
};
