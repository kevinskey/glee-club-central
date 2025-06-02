
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/auth';

interface ProfileContextType {
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isAdmin: () => boolean;
  isMember: () => boolean;
  getUserType: () => 'admin' | 'member';
  permissions: { [key: string]: boolean };
  createFallbackProfile: () => Promise<void>;
  updateUserProfile: (profileData: Partial<Profile>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  const permissions = {
    'view_sheet_music': true,
    'view_calendar': true,
    'view_announcements': true,
    'admin_access': auth.isAdmin()
  };

  const createFallbackProfile = async () => {
    await auth.refreshProfile();
  };

  const updateUserProfile = async (profileData: Partial<Profile>) => {
    if (!auth.profile?.id) {
      throw new Error('No profile ID available');
    }
    
    // For now, just refresh the profile since we simplified the update logic
    // The actual update logic is handled in the useUserProfile hook
    await auth.refreshProfile();
  };

  const getUserType = (): 'admin' | 'member' => {
    return auth.isAdmin() ? 'admin' : 'member';
  };
  
  return (
    <ProfileContext.Provider value={{ 
      profile: auth.profile, 
      refreshProfile: auth.refreshProfile, 
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      isInitialized: auth.isInitialized,
      isAdmin: auth.isAdmin,
      isMember: auth.isMember,
      getUserType,
      permissions,
      createFallbackProfile,
      updateUserProfile
    }}>
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
