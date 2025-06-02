
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, AuthUser } from '@/types/auth';

interface UseUserProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
}

export const useUserProfile = (user: AuthUser | null): UseUserProfileReturn => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create profile if it doesn't exist
  const createProfile = useCallback(async (userId: string, userEmail?: string): Promise<Profile | null> => {
    console.log('🔧 useUserProfile: Creating new profile for user:', userId);
    
    const isAdminUser = userEmail === 'kevinskey@mac.com';
    const profileData = {
      id: userId,
      first_name: userEmail?.split('@')[0] || 'User',
      last_name: '',
      role: isAdminUser ? 'admin' : 'member',
      status: 'active',
      is_super_admin: isAdminUser,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('❌ useUserProfile: Profile creation failed:', error);
        return profileData as Profile; // Return fallback profile
      }

      console.log('✅ useUserProfile: Profile created successfully');
      return data as Profile;
    } catch (err) {
      console.error('💥 useUserProfile: Unexpected error creating profile:', err);
      return profileData as Profile; // Return fallback profile
    }
  }, []);

  // Fetch profile from database
  const fetchProfile = useCallback(async (userId: string, userEmail?: string): Promise<void> => {
    if (!userId || fetchingRef.current || !mountedRef.current) {
      return;
    }

    console.log('📡 useUserProfile: Fetching profile for user:', userId);
    fetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    // Set a timeout to prevent infinite loading
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current && fetchingRef.current) {
        console.log('⏰ useUserProfile: Profile fetch timeout, creating fallback');
        const isAdminUser = userEmail === 'kevinskey@mac.com';
        const fallbackProfile: Profile = {
          id: userId,
          first_name: userEmail?.split('@')[0] || 'User',
          last_name: '',
          role: isAdminUser ? 'admin' : 'member',
          status: 'active',
          is_super_admin: isAdminUser,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(fallbackProfile);
        setIsLoading(false);
        fetchingRef.current = false;
      }
    }, 5000); // 5 second timeout

    try {
      // First, try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // Clear timeout since we got a response
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (fetchError) {
        console.error('❌ useUserProfile: Error fetching profile:', fetchError);
        if (mountedRef.current) {
          setError(fetchError.message);
          setIsLoading(false);
        }
        fetchingRef.current = false;
        return;
      }

      let finalProfile = existingProfile;

      // If no profile exists, create one
      if (!existingProfile) {
        console.log('🔧 useUserProfile: No profile found, creating new one...');
        finalProfile = await createProfile(userId, userEmail);
      }

      if (mountedRef.current) {
        if (finalProfile) {
          setProfile(finalProfile as Profile);
          console.log('✅ useUserProfile: Profile set successfully:', finalProfile.role);
        } else {
          setError('Failed to create profile');
        }
        setIsLoading(false);
      }

    } catch (err) {
      console.error('💥 useUserProfile: Unexpected error:', err);
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Create emergency fallback profile
        const isAdminUser = userEmail === 'kevinskey@mac.com';
        const fallbackProfile: Profile = {
          id: userId,
          first_name: userEmail?.split('@')[0] || 'User',
          last_name: '',
          role: isAdminUser ? 'admin' : 'member',
          status: 'active',
          is_super_admin: isAdminUser,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setProfile(fallbackProfile);
        setIsLoading(false);
        console.log('🆘 useUserProfile: Using emergency fallback profile');
      }
    } finally {
      fetchingRef.current = false;
    }
  }, [createProfile]);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<Profile>): Promise<boolean> => {
    if (!profile?.id) {
      console.error('❌ useUserProfile: No profile ID for update');
      return false;
    }

    try {
      console.log('📝 useUserProfile: Updating profile:', updates);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) {
        console.error('❌ useUserProfile: Profile update failed:', error);
        setError(error.message);
        return false;
      }

      // Update local state
      if (mountedRef.current) {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
      }

      console.log('✅ useUserProfile: Profile updated successfully');
      return true;
    } catch (err) {
      console.error('💥 useUserProfile: Unexpected update error:', err);
      setError(err instanceof Error ? err.message : 'Update failed');
      return false;
    }
  }, [profile?.id]);

  // Refresh profile
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (user?.id) {
      await fetchProfile(user.id, user.email);
    }
  }, [user?.id, user?.email, fetchProfile]);

  // Effect to fetch profile when user changes
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id, user.email);
    } else {
      // Clear everything when no user
      setProfile(null);
      setError(null);
      setIsLoading(false);
      fetchingRef.current = false;
      
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [user?.id, user?.email, fetchProfile]);

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      
      // Clear timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    profile,
    isLoading,
    error,
    refreshProfile,
    updateProfile
  };
};
