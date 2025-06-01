
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';

export const useUnifiedAuth = () => {
  const auth = useSimpleAuthContext();

  return {
    // Core auth properties
    user: auth.user,
    profile: auth.profile,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isInitialized: auth.isInitialized,
    
    // Auth methods
    login: auth.login,
    logout: auth.logout,
    signUp: auth.signUp,
    
    // Role checking methods
    isAdmin: auth.isAdmin,
    isMember: auth.isMember,
    getUserType: auth.getUserType,
    
    // Profile management
    refreshProfile: auth.refreshProfile,
    
    // Computed properties for backward compatibility
    loading: auth.isLoading,
    signOut: auth.logout,
    signIn: auth.login,
    resetPassword: () => Promise.resolve({ error: null }),
    updatePassword: () => Promise.resolve({ error: null }),
    permissions: {},
    refreshPermissions: auth.refreshProfile,
    refreshUserData: auth.refreshProfile,
    createFallbackProfile: auth.refreshProfile,
    
    // Legacy properties (not available in simplified system)
    session: null,
    supabaseClient: null,
  };
};
