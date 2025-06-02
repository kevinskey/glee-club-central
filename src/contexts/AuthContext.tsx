
import React, { createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthManager } from '@/hooks/auth/useAuthManager';
import { AuthContextType, AuthUser, Profile, UserType } from '@/types/auth';
import { signUp, signIn, signOut, resetPassword, updatePassword } from '@/utils/supabase/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authManager = useAuthManager();

  const handleSignUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    userType?: UserType
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: userType || 'member'
          }
        }
      });

      return { data, error };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  };

  const handleLogin = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  const handleLogout = async () => {
    return await signOut();
  };

  const getUserType = (): UserType => {
    return authManager.isAdmin() ? 'admin' : 'member';
  };

  const resetAuthSystem = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      return { success: true };
    } catch (error) {
      console.error('Auth system reset failed:', error);
      return { success: false };
    }
  };

  const contextValue: AuthContextType = {
    user: authManager.user,
    profile: authManager.profile,
    isAuthenticated: authManager.isAuthenticated,
    isLoading: authManager.isLoading,
    isInitialized: authManager.isInitialized,
    session: null, // Deprecated, kept for compatibility
    supabaseClient: supabase,
    login: handleLogin,
    logout: handleLogout,
    signIn: handleLogin,
    signOut: handleLogout,
    signUp: handleSignUp,
    isAdmin: authManager.isAdmin,
    isMember: authManager.isMember,
    getUserType,
    updatePassword,
    resetPassword,
    permissions: {}, // Simplified for now
    refreshPermissions: async () => {},
    resetAuthSystem,
    refreshProfile: authManager.refreshProfile,
    refreshUserData: authManager.refreshProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
