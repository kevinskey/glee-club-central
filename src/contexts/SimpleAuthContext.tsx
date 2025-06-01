
import React, { createContext, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile } from '@/types/auth';
import { useSimpleAuth } from '@/hooks/auth/useSimpleAuth';

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

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use error boundary approach for auth hook with more robust fallback
  let authState;
  try {
    authState = useSimpleAuth();
  } catch (error) {
    console.error('💥 SimpleAuthProvider: useSimpleAuth failed:', error);
    // Fallback state to prevent complete app crash
    authState = {
      user: null,
      profile: null,
      isLoading: false,
      isInitialized: true,
      refreshProfile: async () => {}
    };
  }

  const { user, profile, isLoading, isInitialized, refreshProfile } = authState;

  const isAuthenticated = !!user;

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 SimpleAuth: Login attempt for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      console.log('🔐 SimpleAuth: Login response:', {
        hasData: !!data,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        error: error?.message
      });
      
      if (error) {
        console.error('❌ SimpleAuth: Login error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      console.error('💥 SimpleAuth: Unexpected login error:', err);
      return { error: err };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('🚪 SimpleAuth: Logout attempt');
      const { error } = await supabase.auth.signOut();
      console.log('🚪 SimpleAuth: Logout response:', { error: error?.message });
      return { error };
    } catch (err) {
      console.error('💥 SimpleAuth: Logout error:', err);
      return { error: err };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log('📝 SimpleAuth: Sign up attempt for:', email);
      
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
      
      console.log('📝 SimpleAuth: Sign up response:', {
        hasData: !!data,
        hasUser: !!data?.user,
        error: error?.message
      });
      
      return { error, data };
    } catch (err) {
      console.error('💥 SimpleAuth: Sign up error:', err);
      return { error: err, data: null };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      console.log('🔒 SimpleAuth: Reset password attempt for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      console.log('🔒 SimpleAuth: Reset password response:', { error: error?.message });
      
      return { error };
    } catch (err) {
      console.error('💥 SimpleAuth: Reset password error:', err);
      return { error: err };
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    try {
      console.log('🔐 SimpleAuth: Update password attempt');
      
      const { error } = await supabase.auth.updateUser({ password });
      
      console.log('🔐 SimpleAuth: Update password response:', { error: error?.message });
      
      return { error };
    } catch (err) {
      console.error('💥 SimpleAuth: Update password error:', err);
      return { error: err };
    }
  }, []);

  // Enhanced admin check with multiple fallbacks - prevent recursion
  const isAdmin = useCallback(() => {
    // Primary check: Known admin email
    const isKnownAdmin = user?.email === 'kevinskey@mac.com';
    
    // Secondary check: Profile admin status (only if profile exists to prevent recursion)
    const profileAdmin = profile ? (profile.is_super_admin === true || profile.role === 'admin') : false;
    
    const hasAdminAccess = isKnownAdmin || profileAdmin;
    
    console.log('👑 SimpleAuth: Enhanced admin check:', {
      userEmail: user?.email,
      isKnownAdmin,
      hasProfile: !!profile,
      profileRole: profile?.role,
      profileIsSuperAdmin: profile?.is_super_admin,
      profileAdmin,
      finalResult: hasAdminAccess
    });
    
    return hasAdminAccess;
  }, [profile, user?.email]);

  const isMember = useCallback(() => {
    const memberStatus = !profile || profile.role === 'member' || !profile.role;
    console.log('👤 SimpleAuth: Member check:', {
      hasProfile: !!profile,
      profileRole: profile?.role,
      result: memberStatus
    });
    return memberStatus;
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
    <SimpleAuthContext.Provider value={contextValue}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useSimpleAuthContext = () => {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuthContext must be used within a SimpleAuthProvider');
  }
  return context;
};
