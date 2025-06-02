
import { useAuth } from '@/contexts/AuthContext';

// Compatibility hook for components that were using SimpleAuthContext
export const useSimpleAuthContext = () => {
  const auth = useAuth();
  
  return {
    user: auth.user,
    profile: auth.profile,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isInitialized: auth.isInitialized,
    login: auth.login,
    logout: auth.logout,
    signUp: auth.signUp,
    isAdmin: auth.isAdmin,
    isMember: auth.isMember,
    getUserType: auth.getUserType,
    refreshProfile: auth.refreshProfile,
  };
};
