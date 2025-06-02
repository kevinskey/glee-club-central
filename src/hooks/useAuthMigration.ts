
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

export const useAuthMigration = () => {
  const auth = useAuth();
  const profile = useProfile();
  
  const loading = auth.isLoading || profile.isLoading;
  const isInitialized = auth.isInitialized && profile.isInitialized;
  const isAuthenticated = auth.isAuthenticated && profile.isAuthenticated;

  return {
    // Auth methods
    login: auth.login,
    logout: auth.logout,
    signUp: auth.signUp,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword,
    
    // State
    user: auth.user,
    profile: profile.profile,
    loading,
    isLoading: loading,
    isInitialized,
    isAuthenticated,
    
    // Role methods
    isAdmin: profile.isAdmin,
    isMember: profile.isMember,
    getUserType: profile.getUserType,
    permissions: profile.permissions,
    
    // Profile methods
    refreshProfile: auth.refreshProfile,
    createFallbackProfile: profile.createFallbackProfile,
  };
};
