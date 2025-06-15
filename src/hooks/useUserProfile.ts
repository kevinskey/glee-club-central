
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
  const mountedRef = useRef(true);

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

  // Fetch profile function with better error handling
  const fetchProfile = useCallback(async (userId: string, userEmail?: string): Promise<void> => {
    if (!userId || !mountedRef.current) {
      return;
    }

    console.log('📡 useUserProfile: Fetching profile for user:', userId);
    setIsLoading(true);
    setError(null);

    try {
      // Try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ useUserProfile: Error fetching profile:', fetchError);
        setError(fetchError.message);
        return;
      }

      let finalProfile = existingProfile;

      // If no profile exists, create one
      if (!existingProfile) {
        console.log('🔧 useUserProfile: No profile found, creating new one...');
        finalProfile = await createProfile(userId, userEmail);
      }

      if (mountedRef.current && finalProfile) {
        setProfile(finalProfile as Profile);
        console.log('✅ useUserProfile: Profile set successfully:', finalProfile.role);
      }

    } catch (err) {
      console.error('💥 useUserProfile: Unexpected error:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
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
        console.error('❌ useUserProfile: Update failed:', error);
        return false;
      }

      // Update local state
      if (mountedRef.current) {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
      }

      console.log('✅ useUserProfile: Profile updated successfully');
      return true;
    } catch (err) {
      console.error('💥 useUserProfile: Update error:', err);
      return false;
    }
  }, [profile]);

  // Refresh profile
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (user?.id) {
      await fetchProfile(user.id, user.email);
    }
  }, [user, fetchProfile]);

  // Effect to fetch profile when user changes
  useEffect(() => {
    mountedRef.current = true;
    
    if (user?.id) {
      fetchProfile(user.id, user.email);
    } else {
      setProfile(null);
      setIsLoading(false);
      setError(null);
    }

    return () => {
      mountedRef.current = false;
    };
  }, [user, fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refreshProfile,
    updateProfile,
  };
};
