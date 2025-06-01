
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { getProfile, ensureProfileExists } from '@/utils/supabase/profiles';
import { fetchUserPermissions } from '@/utils/supabase/permissions';

interface ProfileContextType {
  profile: Profile | null;
  permissions: { [key: string]: boolean };
  isAuthenticated: boolean;
  isInitialized: boolean;
  isAdmin: () => boolean;
  isMember: () => boolean;
  getUserType: () => 'admin' | 'member';
  refreshProfile: () => Promise<void>;
  createFallbackProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch profile and permissions
  const fetchProfileData = useCallback(async (userId: string, userEmail?: string, userMetadata?: any) => {
    console.log('📋 ProfileContext: Fetching profile data for:', userId);
    
    try {
      // Try to get existing profile
      let profileData = await getProfile(userId);
      
      // If no profile exists, try to ensure one exists
      if (!profileData) {
        console.log('🔧 ProfileContext: No profile found, ensuring profile exists...');
        profileData = await ensureProfileExists(userId, userEmail, userMetadata);
      }
      
      if (profileData) {
        console.log('✅ ProfileContext: Profile loaded:', {
          id: profileData.id,
          role: profileData.role,
          isAdmin: profileData.is_super_admin
        });
        setProfile(profileData);
      }
      
      // Fetch permissions
      try {
        const userPermissions = await fetchUserPermissions(userId);
        console.log('🔑 ProfileContext: Permissions loaded:', Object.keys(userPermissions));
        setPermissions(userPermissions);
      } catch (permError) {
        console.warn('⚠️ ProfileContext: Failed to load permissions, using defaults:', permError);
        setPermissions({
          'view_sheet_music': true,
          'view_calendar': true,
          'view_announcements': true
        });
      }
      
    } catch (error) {
      console.error('❌ ProfileContext: Error fetching profile data:', error);
      // Set fallback profile
      const fallbackProfile: Profile = {
        id: userId,
        first_name: userMetadata?.first_name || userEmail?.split('@')[0] || 'User',
        last_name: userMetadata?.last_name || '',
        role: 'member',
        status: 'active',
        is_super_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(fallbackProfile);
      setPermissions({
        'view_sheet_music': true,
        'view_calendar': true,
        'view_announcements': true
      });
    }
  }, []);

  // Initialize profile data when user changes
  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to finish loading
    }

    if (user) {
      console.log('👤 ProfileContext: User authenticated, fetching profile...');
      fetchProfileData(user.id, user.email, user.user_metadata);
    } else {
      console.log('👤 ProfileContext: No user, clearing profile data');
      setProfile(null);
      setPermissions({});
    }
    
    setIsInitialized(true);
  }, [user, authLoading, fetchProfileData]);

  const isAuthenticated = !!user;

  const isAdmin = useCallback(() => {
    return profile?.is_super_admin === true || profile?.role === 'admin';
  }, [profile]);

  const isMember = useCallback(() => {
    return profile?.role === 'member' || !profile?.role;
  }, [profile]);

  const getUserType = useCallback((): 'admin' | 'member' => {
    return (profile?.is_super_admin === true || profile?.role === 'admin') ? 'admin' : 'member';
  }, [profile]);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      console.log('🔄 ProfileContext: Refreshing profile data...');
      await fetchProfileData(user.id, user.email, user.user_metadata);
    }
  }, [user, fetchProfileData]);

  const createFallbackProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      console.log('🔧 ProfileContext: Creating fallback profile for user:', user.id);
      
      const isUserAdmin = user.email === 'kevinskey@mac.com';
      
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || 'User',
          last_name: user.user_metadata?.last_name || '',
          role: isUserAdmin ? 'admin' : 'member',
          status: 'active',
          is_super_admin: isUserAdmin,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('❌ ProfileContext: Error creating fallback profile:', error);
      } else {
        console.log('✅ ProfileContext: Fallback profile created successfully');
        await refreshProfile();
      }
    } catch (error) {
      console.error('💥 ProfileContext: Error creating fallback profile:', error);
    }
  }, [user, refreshProfile]);

  const contextValue: ProfileContextType = {
    profile,
    permissions,
    isAuthenticated,
    isInitialized,
    isAdmin,
    isMember,
    getUserType,
    refreshProfile,
    createFallbackProfile,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
