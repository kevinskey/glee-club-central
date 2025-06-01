
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

interface AuthMigrationOptions {
  redirect?: boolean;
  redirectTo?: string;
}

/**
 * Migration utility hook to help components transition from old AuthContext to new split contexts
 * This provides backward compatibility for components that haven't been updated yet
 */
export const useAuthMigration = (options: AuthMigrationOptions = {}) => {
  const { redirect = false, redirectTo = '/login' } = options;
  const navigate = useNavigate();
  const auth = useAuth();
  const profile = useProfile();
  const [hasRedirected, setHasRedirected] = useState(false);

  // Combine loading states
  const isLoading = auth.loading || profile.loading;
  const isInitialized = profile.isInitialized;
  const isAuthenticated = profile.isAuthenticated;

  // Handle redirect logic
  useEffect(() => {
    if (redirect && isInitialized && !isAuthenticated && !hasRedirected) {
      console.log('🔄 useAuthMigration: Redirecting to', redirectTo);
      setHasRedirected(true);
      navigate(redirectTo, { replace: true });
    }
  }, [redirect, isInitialized, isAuthenticated, hasRedirected, redirectTo, navigate]);

  // Return an object that matches the old AuthContext interface as closely as possible
  return {
    // Core auth data
    user: auth.user,
    loading: isLoading,
    profile: profile.profile,
    
    // Auth functions
    login: auth.login,
    logout: auth.logout,
    signUp: auth.signUp,
    signOut: auth.signOut || auth.logout,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword,
    
    // Profile functions and computed values
    isAuthenticated,
    isLoading,
    isInitialized,
    isAdmin: profile.isAdmin,
    isMember: profile.isMember,
    getUserType: profile.getUserType,
    permissions: profile.permissions,
    refreshProfile: profile.refreshProfile,
    refreshUserData: profile.refreshProfile,
    refreshPermissions: profile.refreshProfile,
    createFallbackProfile: profile.createFallbackProfile,
    hasRedirected,
    
    // Mock values for properties that don't exist in new structure
    session: null,
    supabaseClient: null,
  };
};
