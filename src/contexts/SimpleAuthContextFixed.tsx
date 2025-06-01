
import React, { createContext, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile } from '@/types/auth';
import { useSimpleAuthFixed } from '@/hooks/auth/useSimpleAuthFixed';

interface SimpleAuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any; data: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  isAdmin: () => boolean;
  isMember: () => boolean;
  getUserType: () => 'admin' | 'member';
  refreshProfile: () => Promise<void>;
}

const SimpleAuthContextFixed = createContext<SimpleAuthContextType | undefined>(undefined);

export const SimpleAuthProviderFixed: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isLoading, isInitialized, refreshProfile } = useSimpleAuthFixed();

  const isAuthenticated = !!user;

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 SimpleAuthFixed: Login attempt for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) {
        console.error('❌ SimpleAuthFixed: Login error:', error);
        return { error };
      }
      
      console.log('✅ SimpleAuthFixed: Login successful');
      return { error: null };
    } catch (err) {
      console.error('💥 SimpleAuthFixed: Unexpected login error:', err);
      return { error: err };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('🚪 SimpleAuthFixed: Logout attempt');
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      console.error('💥 SimpleAuthFixed: Logout error:', err);
      return { error: err };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log('📝 SimpleAuthFixed: Sign up attempt for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      
      return { error, data };
    } catch (err) {
      console.error('💥 SimpleAuthFixed: Sign up error:', err);
      return { error: err, data: null };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (err) {
      return { error: err };
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (err) {
      return { error: err };
    }
  }, []);

  const isAdmin = useCallback(() => {
    const isKnownAdmin = user?.email === 'kevinskey@mac.com';
    const profileAdmin = profile ? (profile.is_super_admin === true || profile.role === 'admin') : false;
    return isKnownAdmin || profileAdmin;
  }, [profile, user?.email]);

  const isMember = useCallback(() => {
    return !profile || profile.role === 'member' || !profile.role;
  }, [profile]);

  const getUserType = useCallback((): 'admin' | 'member' => {
    return isAdmin() ? 'admin' : 'member';
  }, [isAdmin]);

  const contextValue: SimpleAuthContextType = {
    user,
    profile,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    logout,
    signUp,
    resetPassword,
    updatePassword,
    isAdmin,
    isMember,
    getUserType,
    refreshProfile,
  };

  return (
    <SimpleAuthContextFixed.Provider value={contextValue}>
      {children}
    </SimpleAuthContextFixed.Provider>
  );
};

export const useSimpleAuthContextFixed = () => {
  const context = useContext(SimpleAuthContextFixed);
  if (context === undefined) {
    throw new Error('useSimpleAuthContextFixed must be used within a SimpleAuthProviderFixed');
  }
  return context;
};
