
import { useCallback } from 'react';
import { Profile } from '@/types/auth';
import { AuthState } from './types';
import { supabase } from '@/integrations/supabase/client';

export const useUserDataFetching = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  mountedRef: React.MutableRefObject<boolean>,
  fetchingRef: React.MutableRefObject<boolean>
) => {
  // Enhanced user data fetching with fixed RLS policies
  const fetchUserData = useCallback(async (userId: string, userEmail?: string, userMetadata?: any) => {
    if (!mountedRef.current || fetchingRef.current) return;
    
    console.log(`📡 useUserDataFetching: STARTING PROFILE FETCH for user: ${userId}, email: ${userEmail}`);
    
    fetchingRef.current = true;
    
    try {
      // Try to fetch existing profile from database
      console.log('📋 useUserDataFetching: Fetching profile from database...');
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      console.log('📋 useUserDataFetching: Profile fetch result:', {
        hasProfile: !!profileData,
        profileRole: profileData?.role,
        profileIsAdmin: profileData?.is_super_admin,
        fetchError: fetchError?.message,
        errorCode: fetchError?.code
      });
      
      let profile: Profile | null = profileData;
      
      // If no profile exists and no error, create one
      if (!profile && !fetchError) {
        console.log('🔧 useUserDataFetching: No profile found, creating new profile...');
        
        // Determine if user should be admin based on email
        const isAdminUser = userEmail === 'kevinskey@mac.com';
        
        const newProfileData = {
          id: userId,
          first_name: userMetadata?.first_name || userEmail?.split('@')[0] || 'User',
          last_name: userMetadata?.last_name || '',
          role: isAdminUser ? 'admin' : 'member',
          status: 'active',
          is_super_admin: isAdminUser,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log('🔧 useUserDataFetching: Creating profile with data:', newProfileData);
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfileData)
          .select()
          .single();
        
        if (createError) {
          console.error('❌ useUserDataFetching: Profile creation failed:', createError);
          // Use fallback profile
          profile = newProfileData as Profile;
        } else {
          console.log('✅ useUserDataFetching: Profile created successfully:', newProfile);
          profile = newProfile as Profile;
        }
      }
      
      // If we still don't have a profile, create emergency fallback
      if (!profile) {
        console.log('🆘 useUserDataFetching: Creating emergency fallback profile...');
        const isAdminUser = userEmail === 'kevinskey@mac.com';
        
        profile = {
          id: userId,
          first_name: userMetadata?.first_name || userEmail?.split('@')[0] || 'User',
          last_name: userMetadata?.last_name || '',
          role: isAdminUser ? 'admin' : 'member',
          status: 'active',
          is_super_admin: isAdminUser,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      // Set up basic permissions
      const permissions = {
        'view_sheet_music': true,
        'view_calendar': true,
        'view_announcements': true,
        'admin_access': profile.is_super_admin || profile.role === 'admin'
      };
      
      console.log('✅ useUserDataFetching: Final profile setup:', {
        profileId: profile.id,
        profileRole: profile.role,
        profileIsAdmin: profile.is_super_admin,
        profileFirstName: profile.first_name,
        profileLastName: profile.last_name,
        hasAdminAccess: permissions.admin_access
      });
      
      // Update state with profile data
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          profile,
          permissions,
          isLoading: false,
          isInitialized: true
        }));
      }
      
    } catch (error) {
      console.error('❌ useUserDataFetching: Profile fetch failed with exception:', error);
      
      // Create emergency fallback profile
      const isAdminUser = userEmail === 'kevinskey@mac.com';
      const fallbackProfile: Profile = {
        id: userId,
        first_name: userMetadata?.first_name || userEmail?.split('@')[0] || 'User',
        last_name: userMetadata?.last_name || '',
        role: isAdminUser ? 'admin' : 'member',
        status: 'active',
        is_super_admin: isAdminUser,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const basicPermissions = {
        'view_sheet_music': true,
        'view_calendar': true,
        'view_announcements': true,
        'admin_access': isAdminUser
      };
      
      console.log('🆘 useUserDataFetching: Using emergency fallback profile with admin access:', isAdminUser);
      
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          profile: fallbackProfile,
          permissions: basicPermissions,
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
