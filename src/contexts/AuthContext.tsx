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

  // Debug logging for auth state
  useEffect(() => {
    console.log('🔍 AuthContext: Auth state debug:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      hasProfile: !!profile,
      profileRole: profile?.role,
      profileIsAdmin: profile?.is_super_admin,
      isLoading,
      isInitialized,
      hasSession: !!session,
      sessionUserId: session?.user?.id,
      permissions: Object.keys(permissions || {}),
      timestamp: new Date().toISOString()
    });
  }, [user, profile, isLoading, isInitialized, session, permissions]);

  // Simplified session tracking
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 AuthContext: Auth state change:', {
          event,
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          timestamp: new Date().toISOString()
        });
        setSession(session);
        
        if (event === 'SIGNED_OUT') {
          console.log('👋 AuthContext: User signed out, cleaning up');
          cleanupAuthState();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Authentication status - requires both user and session
  const isAuthenticated = !!user && !!session;

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Login attempt for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      console.log('🔐 AuthContext: Login response:', {
        hasData: !!data,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        error: error?.message
      });
      
      if (error) {
        console.error('❌ AuthContext: Login error:', error);
        return { error };
      }
      
      if (data.session && data.user) {
        console.log('✅ AuthContext: Login successful, session created for user:', data.user.id);
        setSession(data.session);
        return { error: null };
      }
      
      console.warn('⚠️ AuthContext: Login completed but no session or user created');
      return { error: new Error('No session or user created') };
    } catch (err) {
      console.error('💥 AuthContext: Unexpected login error:', err);
      return { error: err };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('🚪 AuthContext: Logout attempt');
      const { error } = await supabase.auth.signOut();
      console.log('🚪 AuthContext: Logout response:', { error: error?.message });
      
      if (!error) {
        setSession(null);
        cleanupAuthState();
        console.log('✅ AuthContext: Logout successful');
      }
      return { error };
    } catch (err) {
      console.error('💥 AuthContext: Logout error:', err);
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
      console.log('📝 AuthContext: Sign up attempt for:', email);
      
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
      
      console.log('📝 AuthContext: Sign up response:', {
        hasData: !!data,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        error: error?.message
      });
      
      return { error, data };
    } catch (err) {
      console.error('💥 AuthContext: Sign up error:', err);
      return { error: err, data: null };
    }
  }, []);

  const isAdmin = useCallback(() => {
    // Ensure we have a profile before checking admin status
    if (!profile) {
      console.log('👑 AuthContext: Admin check - no profile loaded yet');
      return false;
    }
    
    const adminStatus = profile?.is_super_admin === true || profile?.role === 'admin';
    console.log('👑 AuthContext: Admin check:', {
      hasProfile: !!profile,
      profileRole: profile?.role,
      isSuperAdmin: profile?.is_super_admin,
      isAdmin: adminStatus,
      userId: user?.id
    });
    return adminStatus;
  }, [profile, user]);

  const isMember = useCallback(() => {
    if (!profile) {
      console.log('👤 AuthContext: Member check - no profile loaded yet');
      return false;
    }
    
    const memberStatus = profile?.role === 'member' || !profile?.role;
    console.log('👤 AuthContext: Member check:', {
      hasProfile: !!profile,
      profileRole: profile?.role,
      isMember: memberStatus,
      userId: user?.id
    });
    return memberStatus;
  }, [profile, user]);

  const getUserType = useCallback(() => {
    if (!profile) {
      console.log('🏷️ AuthContext: User type check - no profile loaded yet');
      return 'member'; // Default to member while loading
    }
    
    const userType = (profile?.is_super_admin === true || profile?.role === 'admin') ? 'admin' : 'member';
    console.log('🏷️ AuthContext: User type check:', {
      hasProfile: !!profile,
      profileRole: profile?.role,
      isSuperAdmin: profile?.is_super_admin,
      userType,
      userId: user?.id
    });
    return userType;
  }, [profile, user]);

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
      console.log('🔧 AuthContext: Creating fallback profile for user:', user.id);
      
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
      
      console.log('🔧 AuthContext: Fallback profile creation result:', { error: error?.message });
      
      if (error) {
        console.error('❌ AuthContext: Error creating fallback profile:', error);
      } else {
        console.log('✅ AuthContext: Fallback profile created successfully');
        await refreshUserData();
      }
    } catch (error) {
      console.error('💥 AuthContext: Error creating fallback profile:', error);
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
