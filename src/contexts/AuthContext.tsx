
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, Profile, AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/auth/useAuthState';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simplified cleanup function - only clear specific problematic keys
export const cleanupAuthState = () => {
  // Only remove keys that might be causing conflicts
  const keysToRemove = Object.keys(localStorage).filter(key => 
    key.includes('sb-') && key.includes('auth-token')
  );
  keysToRemove.forEach(key => localStorage.removeItem(key));
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

  // Simplified session tracking
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthContext: Auth state change:', event, session?.user?.id);
        setSession(session);
        
        if (event === 'SIGNED_OUT') {
          // Only clear on actual sign out
          cleanupAuthState();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user && !!session;

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('AuthContext: Login attempt for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) {
        console.error('AuthContext: Login error:', error);
        return { error };
      }
      
      if (data.session && data.user) {
        console.log('AuthContext: Login successful, session created for user:', data.user.id);
        setSession(data.session);
        return { error: null };
      }
      
      return { error: new Error('No session or user created') };
    } catch (err) {
      console.error('AuthContext: Unexpected login error:', err);
      return { error: err };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setSession(null);
        cleanupAuthState();
      }
      return { error };
    } catch (err) {
      console.error('Logout error:', err);
      return { error: err };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    return login(email, password);
  }, [login]);

  const signOut = useCallback(async () => {
    return logout();
  }, [logout]);

  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string, userType: any = 'member') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
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
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: err, data: null };
    }
  }, []);

  const isAdmin = useCallback(() => {
    return profile?.is_super_admin === true || profile?.role === 'admin';
  }, [profile]);

  const isMember = useCallback(() => {
    return profile?.role === 'member' || !profile?.role;
  }, [profile]);

  const getUserType = useCallback(() => {
    if (profile?.is_super_admin === true || profile?.role === 'admin') {
      return 'admin';
    }
    return 'member';
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
