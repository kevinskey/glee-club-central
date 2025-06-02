
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
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, refreshProfile, isLoading, isAuthenticated, isInitialized, isAdmin, isMember, getUserType } = useAuth();
  
  const permissions = {
    'view_sheet_music': true,
    'view_calendar': true,
    'view_announcements': true,
    'admin_access': isAdmin()
  };

  const createFallbackProfile = async () => {
    await refreshProfile();
  };
  
  return (
    <ProfileContext.Provider value={{ 
      profile, 
      refreshProfile, 
      isLoading,
      isAuthenticated,
      isInitialized,
      isAdmin,
      isMember,
      getUserType,
      permissions,
      createFallbackProfile
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
