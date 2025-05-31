
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile, AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { fetchUserPermissions } from '@/utils/supabase/permissions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export cleanup functions
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const resetAuthSystem = async () => {
  try {
    await supabase.auth.signOut();
    cleanupAuthState();
    return { success: true };
  } catch (error) {
    console.error('Error resetting auth system:', error);
    return { success: false };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isLoading, isInitialized, permissions, refreshUserData } = useAuthState();
  const [session, setSession] = useState<any>(null);

  // Keep track of session changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (event === 'SIGNED_OUT') {
          // Clear any cached data on sign out
          localStorage.removeItem('supabase.auth.token');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!user && !!session;

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    return login(email, password);
  }, [login]);

  const signOut = useCallback(async () => {
    return logout();
  }, [logout]);

  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string, userType: any = 'member') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
        },
      },
    });
    return { error, data };
  }, []);

  const isAdmin = useCallback(() => {
    return profile?.is_super_admin === true || profile?.role === 'admin';
  }, [profile]);

  const isMember = useCallback(() => {
    return profile?.role === 'member' || !profile?.role;
  }, [profile]);

  const getUserType = useCallback(() => {
    return profile?.role === 'admin' ? 'admin' : 'member';
  }, [profile]);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  }, []);

  const refreshPermissions = useCallback(async () => {
    if (user?.id) {
      await refreshUserData();
    }
  }, [user?.id, refreshUserData]);

  const resetAuthSystemCallback = useCallback(async () => {
    return resetAuthSystem();
  }, []);

  const createFallbackProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: user.user_metadata?.first_name || 'User',
          last_name: user.user_metadata?.last_name || '',
          role: 'member',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating fallback profile:', error);
      } else {
        await refreshUserData();
      }
    } catch (error) {
      console.error('Error creating fallback profile:', error);
    }
  }, [user, refreshUserData]);

  const contextValue: AuthContextType = {
    user,
    profile,
    isAuthenticated,
    isLoading,
    isInitialized,
    session,
    supabaseClient: supabase,
    login,
    logout,
    signIn,
    signOut,
    signUp,
    isAdmin,
    isMember,
    getUserType,
    updatePassword,
    resetPassword,
    permissions,
    refreshPermissions,
    resetAuthSystem: resetAuthSystemCallback,
    createFallbackProfile,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
