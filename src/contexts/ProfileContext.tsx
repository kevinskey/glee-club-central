
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/auth';

interface ProfileContextType {
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, refreshProfile, isLoading } = useAuth();
  
  return (
    <ProfileContext.Provider value={{ profile, refreshProfile, isLoading }}>
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
