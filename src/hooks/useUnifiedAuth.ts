
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

export const useUnifiedAuth = () => {
  const auth = useAuth();
  const profile = useProfile();

  return {
    // Auth properties
    user: auth.user,
    loading: auth.loading,
    login: auth.login,
    logout: auth.logout,
    signUp: auth.signUp,
    signOut: auth.signOut || auth.logout,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword,
    
    // Profile properties
    profile: profile.profile,
    permissions: profile.permissions,
    isAuthenticated: profile.isAuthenticated,
    isInitialized: profile.isInitialized,
    isAdmin: profile.isAdmin,
    isMember: profile.isMember,
    getUserType: profile.getUserType,
    refreshProfile: profile.refreshProfile,
    createFallbackProfile: profile.createFallbackProfile,
    
    // Computed properties for backward compatibility
    isLoading: auth.loading || !profile.isInitialized,
    refreshPermissions: profile.refreshProfile,
    refreshUserData: profile.refreshProfile,
    
    // Additional properties that some components expect
    session: null, // Not available in new structure
    supabaseClient: null, // Not exposed directly
  };
};
