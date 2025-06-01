
import { useCallback } from 'react';
import { Profile } from '@/types/auth';
import { AuthState } from './types';
import { supabase } from '@/integrations/supabase/client';

export const useUserDataFetching = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  mountedRef: React.MutableRefObject<boolean>,
  fetchingRef: React.MutableRefObject<boolean>
) => {
  // Enhanced user data fetching with database profile creation
  const fetchUserData = useCallback(async (userId: string, userEmail?: string, userMetadata?: any) => {
    if (!mountedRef.current || fetchingRef.current) return;
    
    console.log(`📡 useUserDataFetching: STARTING ENHANCED PROFILE FETCH for user: ${userId}, email: ${userEmail}`);
    
    fetchingRef.current = true;
    
    try {
      // First, try to fetch existing profile from database
      console.log('📋 useUserDataFetching: Checking for existing profile...');
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      console.log('📋 useUserDataFetching: Profile fetch result:', {
        hasProfile: !!existingProfile,
        profileRole: existingProfile?.role,
        profileIsAdmin: existingProfile?.is_super_admin,
        fetchError: fetchError?.message
      });
      
      let profile: Profile | null = existingProfile;
      
      // If no profile exists, create one
      if (!profile && !fetchError) {
        console.log('🔧 useUserDataFetching: Creating new profile...');
        
        // Determine if user should be admin based on email
        const isAdmin = userEmail === 'kevinskey@mac.com';
        
        const newProfileData = {
          id: userId,
          first_name: userMetadata?.first_name || userEmail?.split('@')[0] || 'User',
          last_name: userMetadata?.last_name || '',
          role: isAdmin ? 'admin' : 'member',
          status: 'active',
          is_super_admin: isAdmin,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log('🔧 useUserDataFetching: Inserting profile data:', newProfileData);
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfileData)
          .select()
          .single();
        
        if (createError) {
          console.error('❌ useUserDataFetching: Profile creation failed:', createError);
          // Fall back to in-memory profile
          profile = newProfileData as Profile;
        } else {
          console.log('✅ useUserDataFetching: Profile created successfully:', newProfile);
          profile = newProfile as Profile;
        }
      }
      
      // If we still don't have a profile, create a fallback
      if (!profile) {
        console.log('🔧 useUserDataFetching: Creating fallback profile...');
        const isAdmin = userEmail === 'kevinskey@mac.com';
        
        profile = {
          id: userId,
          first_name: userMetadata?.first_name || userEmail?.split('@')[0] || 'User',
          last_name: userMetadata?.last_name || '',
          role: isAdmin ? 'admin' : 'member',
          status: 'active',
          is_super_admin: isAdmin,
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
        permissionCount: Object.keys(permissions).length
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
      console.error('❌ useUserDataFetching: Enhanced profile fetch failed:', error);
      
      // Create emergency fallback profile
      const isAdmin = userEmail === 'kevinskey@mac.com';
      const fallbackProfile: Profile = {
        id: userId,
        first_name: userMetadata?.first_name || userEmail?.split('@')[0] || 'User',
        last_name: userMetadata?.last_name || '',
        role: isAdmin ? 'admin' : 'member',
        status: 'active',
        is_super_admin: isAdmin,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const basicPermissions = {
        'view_sheet_music': true,
        'view_calendar': true,
        'view_announcements': true,
        'admin_access': isAdmin
      };
      
      console.log('🆘 useUserDataFetching: Using emergency fallback profile');
      
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
