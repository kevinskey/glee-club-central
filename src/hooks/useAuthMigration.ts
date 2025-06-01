
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

/**
 * Migration utility hook to help components transition from old AuthContext to new split contexts
 * This provides backward compatibility for components that haven't been updated yet
 */
export const useAuthMigration = () => {
  const auth = useAuth();
  const profile = useProfile();

  // Return an object that matches the old AuthContext interface as closely as possible
  return {
    // Core auth data
    user: auth.user,
    loading: auth.loading,
    profile: profile.profile,
    
    // Auth functions
    login: auth.login,
    logout: auth.logout,
    signUp: auth.signUp,
    signOut: auth.signOut || auth.logout,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword,
    
    // Profile functions and computed values
    isAuthenticated: profile.isAuthenticated,
    isLoading: auth.loading || !profile.isInitialized,
    isInitialized: profile.isInitialized,
    isAdmin: profile.isAdmin,
    isMember: profile.isMember,
    getUserType: profile.getUserType,
    permissions: profile.permissions,
    refreshProfile: profile.refreshProfile,
    refreshUserData: profile.refreshProfile,
    refreshPermissions: profile.refreshProfile,
    createFallbackProfile: profile.createFallbackProfile,
    
    // Mock values for properties that don't exist in new structure
    session: null,
    supabaseClient: null,
  };
};
